import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {Button} from "react-bootstrap";
import React from "react";


function SignUp(props) {

    const fetchToken = async (user) => {
        const res = await fetch("http://localhost:9000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: user
        });
        return await res.json();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let login = e.target.formLoginName.value;
        let name = e.target.formUserName.value;
        let pass1 = e.target.formUserPassword1.value;
        let pass2 = e.target.formUserPassword2.value;

        if (!validatePassword(pass1, pass2)) {
            alert("Heslo neodpovídá nebo není dostatečně dlouhé!");
            return;
        }

        try {
            const json = await fetchToken(
                JSON.stringify({
                    login: login,
                    name: name,
                    password: pass1
                })
            );
            if (json.token) {
                sessionStorage.setItem("token", json.token);
                props.onSignUp(true);
            } else {
                throw new Error("Chyba při vytvoření nového uživatele!");
            }
        } catch (e) {
            alert(e.message);
            props.onSignUp(false);
        }
    };

    const validatePassword = (pass1, pass2) => {
        return pass1.length > 5 && (pass1 === pass2);
    };

    const handleReturn = () => {
        props.onReturn(true);
    }

    return (
        <Container fluid={"sm"} bsPrefix={"container"}>
            <h2 className={"mt-5"}>
                <Button
                    onClick={handleReturn}
                    bsPrefix={"btn btn-secondary mr-3"}
                > {"<<"} </Button>
                Registrace do systému
            </h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formLoginName">
                    <Form.Label>Přihlašovací jméno</Form.Label>
                    <Form.Control type="input" required/>
                </Form.Group>

                <Form.Group controlId="formUserName">
                    <Form.Label>Jméno a příjmení</Form.Label>
                    <Form.Control type="input" required/>
                </Form.Group>

                <Form.Group controlId="formUserPassword1">
                    <Form.Label>Heslo</Form.Label>
                    <Form.Control type={"password"} placeholder={"heslo"} required/>
                    <Form.Text> min. délka hesla je 6 znaků</Form.Text>
                </Form.Group>
                <Form.Group controlId="formUserPassword2">
                    <Form.Label>Opakovat heslo</Form.Label>
                    <Form.Control type={"password"} placeholder={"heslo"} required/>
                    <Form.Text> zadané heslo musí být stejné jako předchozí</Form.Text>
                </Form.Group>

                <Container>
                    <Row className={"row justify-content-between"}>
                        <Button variant={"danger"} type={"reset"}>
                            Vymazat
                        </Button>
                        <Button variant="primary" type="submit">
                            Odeslat
                        </Button>
                    </Row>
                </Container>
            </Form>
        </Container>

    );
}

export default SignUp;