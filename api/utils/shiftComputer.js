const mapper = require("./shiftMapper");

const compute = shifts => {
    const map = mapper.hoursMap();
    let count = 0.0;
    for (const shift of shifts) {
        const result = parseFloat(shift);
        if (isNaN(result)) {
            let count1 = map.get(shift);
            count += count1;
        } else {
            count += result;
        }
    }

    return count;
};


module.exports = {
    compute: compute
}