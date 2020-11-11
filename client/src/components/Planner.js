import Container from "react-bootstrap/Container";
import {NavBar} from "./NavBar";
import EmployeeTable from "./EmployeeTable";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import React, {useEffect, useRef, useState} from "react";
import Spinner from "react-bootstrap/Spinner";


function Planner(props) {

    const [date, setDate] = useState(new Date());
    const [isSave, setSave] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const getNumberOfDaysInMonth = (date) => {
        return new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDate();
    };

    const numDays = useRef(getNumberOfDaysInMonth(date));

    const [users, setUsers] = useState([]);

    const getPlan = async (date, token) => {
        numDays.current = getNumberOfDaysInMonth(date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        try {
            const isPresent = await fetch("http://localhost:9000/plans/" + year + "/" + month, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            if (isPresent.status === 200) {
                return await isPresent.json();
            } else {
                let url = `http://localhost:9000/plans/${year}/${month}/new`;
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                });
                return await res.json();
            }
        } catch (e) {
            throw new Error("Chyba při získávání plánu z extérního zdroje.");
        }
    };

    const getName = async (token) => {
        // získání jména
        try {
            const resMe = await fetch("http://localhost:9000/users/me", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });
            const json = await resMe.json();
            return json.name;
        } catch (e) {
            throw new Error("Nepodařilo se získat jméno uživatele");
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const token = sessionStorage.getItem("token");
                const plan = await getPlan(date, token);
                const name = await getName(token);
                const user = {name: name, plan}
                setUsers([user]);
            } catch (e) {
                console.log("error in useEffect", e);
            }
        }
        fetchData();
    },[date]);

    const handleSave = async () => {
        setIsSaving(true);
        const plan = users[0].plan;

        const token = sessionStorage.getItem("token");
        const url = `http://localhost:9000/plans/${plan.year}/${plan.month}`;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(plan)
            });
            if (res.status === 201) {
                setIsSaving(false);
                return setSave(true);
            } else {
                const res = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(plan)
                });
                if (res.status === 204) {
                    setIsSaving(false);
                    return setSave(true);
                } else {
                    setIsSaving(false)
                    setSave(false);
                    throw new Error("Chyba při ukládání!");
                }
            }

        } catch (e) {
            setIsSaving(false);
            console.log(e);
        }
    }

    const handleSaveChoice = async (updatedShifts, index) => {
        const usersCopy = [...users];
        const user = usersCopy[index];
        user.plan.shifts = updatedShifts;

        // výpočet na straně serveru
        try {
            const token = sessionStorage.getItem("token");
            const url = `http://localhost:9000/plans/${date.getFullYear()}/${date.getMonth() + 1}/comput`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user.plan)
            });
            const plan = await res.json();
            user.plan = plan;
            setUsers(usersCopy);
            setSave(false);

            // uložení mezi výsledku
            sessionStorage.setItem("temp", JSON.stringify(users));
        } catch (e) {
            console.log(e);
        }
    };

    const handleDate = async (newDate) => {
        setDate(newDate);
    };

    return (
        <Container fluid={"md"}>
            <NavBar
                selected={date}
                onChange={(date) => handleDate(date)}
                onLogout={props.onLogout}
            />
            <Container fluid>
                <EmployeeTable
                    numDays={numDays.current}
                    onSave={handleSaveChoice}
                    employees={users}
                />
            </Container>
            <Container fluid>
                <Row className="justify-content-end">
                    <Button
                        className={"mr-4 my-4"}
                        variant={isSave ? "success" : "danger"}
                        onClick={handleSave}
                    >
                        {isSaving ?
                            <Spinner animation={"border"}
                                     as={"span"}
                                     variant={"light"}
                                     size={"sm"}
                            /> :
                            "Uložit"
                        }
                    </Button>
                </Row>
            </Container>
            {/*    footer   */}
            <Container fluid>
                <Row className={"justify-content-center"}>
                    Studentský zápočtový projekt | UHK | Stanislav Čapek {"\u00A9"} 2020
                </Row>
            </Container>
        </Container>
    );

}

export default Planner;