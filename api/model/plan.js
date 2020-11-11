const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    _id: String,
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: "User"
    },
    year: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    shifts: {
        type: Array,
        default: []
    },
    fund: {
        type: Number,
        default: 0,
    },
    onPlan: {
        type: Number,
        default: 0
    },
    diff: {
        type: Number,
        default: 0
    }
});

const Plan = mongoose.model("plan", planSchema);

module.exports = Plan;