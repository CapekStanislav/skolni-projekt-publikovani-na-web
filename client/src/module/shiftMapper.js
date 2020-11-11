const keys = ["-", "D", "N", "PD", "ŘD", "ZV", "PN"];
const des = ["žádná", "denní", "noční", "1/2 dovolené", "řádná dovolená",
    "zdravotní volno", "pracovní neschopnost"];

const getChoicesMap = () => {
    const choicesMap = new Map();
    for (let i = 0; i < keys.length; i++) {
        choicesMap.set(keys[i], des[i]);
    }
    return choicesMap;
};


module.exports = {
    shiftMap: getChoicesMap,
    getKeys: keys,
    getValue: des,
};