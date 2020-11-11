const keys = ["-", "D", "N", "PD", "ŘD", "ZV", "PN"];
const des = ["žádná", "denní", "noční", "1/2 dovolené", "řádná dovolená",
    "zdravotní volno", "pracovní neschopnost"];
const hours = [0,12,12,12,12,12,12];

const getDescriptionMap = () => {
   return createMap(des);
};

const getHoursMap = () => {
    return createMap(hours);
};

const createMap = (values) => {
    const map = new Map();
    for (let i = 0; i < keys.length; i++) {
        map.set(keys[i], values[i]);
    }
    return map;
}


module.exports = {
    descriptionMap: getDescriptionMap,
    hoursMap: getHoursMap,
    getKeys: keys,
    getStringValues: des,
    getNumericValues:hours
};