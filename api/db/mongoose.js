const mongoose = require("mongoose");
const keyLoader = require("../utils/keyLoader");

const url = keyLoader.loadDbUrl("../keys/mongo.json");

try {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }, () => console.log("připojeno k DB."));


} catch (e) {
    console.error("Nepodařilo se připojit k DB:", e);
}
