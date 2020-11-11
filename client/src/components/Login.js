import React, {useState} from "react";
import {Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SignUp from "./SignUp";

function Login(props) {
    const [logIn, setLogIn] = useState(true);

    const handleLogin = async (e) => {
        e.preventDefault();
        let target = e.target;
        let login = target.elements.formUserName.value;
        let password = target.elements.formUserPassword.value;

        //dočasné údaje na přihlášení
        const credential = JSON.stringify({
            login: login,
            password: password
        });


        try {
            const res = await fetch("http://localhost:9000/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "same-origin",
                    body: credential
                }
            );
            const json = await res.json();
            // console.log("Setting cookie:", json.token);
            // document.cookie = "token=" + json.token;

            if (res.status === 400) {
                alert("Přihlášení se nezdařilo!");
                return;
            }
            if (json.token) {
                sessionStorage.setItem("token", json.token);
                props.onLogin(true);
            }

        } catch (e) {
            props.onLogin(false);
            console.error(e);
        }
    };

    const showSignUpScreen = () => {
        return <SignUp onSignUp={props.onLogin} onReturn={setLogIn}/>
    }

    const showLoginScreen = () => {
        return (
            <Container fluid={"sm"}>
                <h2 className={"mt-5"}>Přihlášení do systému</h2>
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="formUserName">
                        <Form.Label>Uživatelské jméno</Form.Label>
                        <Form.Control type="input" required/>
                    </Form.Group>

                    <Form.Group controlId="formUserPassword">
                        <Form.Label>Heslo</Form.Label>
                        <Form.Control type={"password"} placeholder={"heslo"} required/>
                    </Form.Group>
                    <Container>
                        <Row className={"row justify-content-between"}>
                            <Button variant={"danger"} onClick={() => setLogIn(false)}>
                                Nový uživatel
                            </Button>
                            <Button variant="primary" type="submit">
                                Přihlásit
                            </Button>
                        </Row>
                    </Container>
                </Form>
            </Container>
        );
    }

    return logIn ? showLoginScreen() : showSignUpScreen();
}

export default Login;