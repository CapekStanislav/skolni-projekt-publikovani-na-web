const getNumberOfDaysInMonth = (date) => {
    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();
};

const isWeekend = (date) => {
    return (date.getDay() === 6 || date.getDay() === 0)
};

const getFund = (date) => {
    const shiftLength = 7.5;
    const year = date.getFullYear();
    const month = date.getMonth();
    let weekendsDays = 0;
    let daysInMonth = getNumberOfDaysInMonth(date);

    for (let day = 1; day <= daysInMonth; day++) {
        if (isWeekend(new Date(year, month, day))) {
            weekendsDays++;
        }
    }

    return (daysInMonth - weekendsDays) * shiftLength;
};



module.exports = {
    getDaysInMonth: getNumberOfDaysInMonth,
    isWeekend: isWeekend,
    getFund: getFund
}