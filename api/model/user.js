const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secret = "witcher";

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    token: {
        type: String,
        default: ""
    }
});

userSchema.virtual("plans",{
   ref: "Plan",
   localField:"id",
   foreignField:"owner"
});

userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();
});


userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, secret);

    user.token = token;
    await user.save();

    return token
};

userSchema.methods.deleteAuthToken = async function () {
    const user = this;
    user.token = "";
    await user.save();
};

userSchema.statics.findByCredentials = async function (login, password) {

    const user = await User.findOne({login});

    if (!user) {
        throw new Error("Přihlášení selhalo - uživatel nenalezen");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Přihlášení selhalo - neodpovídají údaje");
    }

    return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;