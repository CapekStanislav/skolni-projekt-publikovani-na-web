const fs = require("fs");
const path = require("path");

function loadJson(filePath) {
    const data = fs.readFileSync(path.resolve(__dirname, filePath));
    const json = JSON.parse(data.toString());
    return json;
}

const load = (filePath) => {
    const json = loadJson(filePath);
    return json.key;
};

const loadDbUrl = (filePath) => {
    return loadJson(filePath).url;
};

module.exports = {
    loadKey: load,
    loadDbUrl: loadDbUrl
};
