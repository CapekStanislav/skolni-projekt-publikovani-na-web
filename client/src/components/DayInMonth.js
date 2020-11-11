import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import ModalButtonChoices from "./ModalButtonChoices";

function DayInMonth(props) {

    const handleSaveShift = (day,value) => {
        const shiftCopy = [...props.shifts];
        shiftCopy[day-1] = value;
        props.onSave(shiftCopy, props.index);
    };

    const createDayFields = () => {
        // zobrazení pro aktuální měsíc
        const dayFields = [];
        for (let i = 1; i <= props.shifts.length; i++) {
            dayFields.push(
                <td key={i}>
                    <ModalButtonChoices
                        day={i}
                        text={props.shifts[i - 1]}
                        onSave={(day, value) => handleSaveShift(day,value) }
                    />
                </td>
            )
        }
        return dayFields;
    };

    return createDayFields();
}

export default DayInMonth;