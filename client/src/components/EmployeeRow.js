import React from "react";
import DayInMonth from "./DayInMonth";

function EmployeeRow(props) {
    return (
        <tr>
            <th scope="row">{props.employee.name}</th>
            <DayInMonth
                shifts={props.employee.plan.shifts}
                onSave={props.onSave}
                numDays={props.numDays}
                index={props.index}
            />
            <td> {props.employee.plan.fund} </td>
            <td> {props.employee.plan.onPlan} </td>
            <td> {props.employee.plan.diff} </td>
        </tr>
    );
}

export default EmployeeRow;