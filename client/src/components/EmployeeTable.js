import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import EmployeeRow from "./EmployeeRow";
import Table from "react-bootstrap/Table";

function EmployeeTable(props) {
    const createTableHead = () => {
        const dayLables = [];
        for (let i = 1; i <= props.numDays; i++) {
            dayLables.push(
                <th key={i} scope="col"> {i} </th>
            );

        }
        return dayLables
    };

    return (
        <div className="table-responsive">
            <Table hover={true}>
                <thead>
                <tr>
                    <th>Name</th>
                    {createTableHead()}
                    <th>Fond</th>
                    <th>Plán</th>
                    <th>Rozdíl</th>
                </tr>
                </thead>
                <tbody>
                {props.employees.map((empl, index) => {
                    return (
                        <EmployeeRow
                            key={index}
                            index={index}
                            numDays={props.numDays}
                            onSave={props.onSave}
                            employee={empl}
                        />
                    );
                })
                }
                </tbody>
            </Table>
        </div>
    );
}

export default EmployeeTable;