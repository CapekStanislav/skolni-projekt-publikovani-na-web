import React, {useEffect, useState} from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.min.css"
import Login from "./components/Login";
import Planner from "./components/Planner";


function App(props) {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("token") !== null) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, []);

    const handleLogin = (isValid) => {
        setIsLogin(isValid);
    };

    const handleLogout = async () => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const res = await fetch("http://localhost:9000/users/logout", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                });
                console.log("Logout status:", res.status);
            } catch (e) {
                console.error("Logout error:", e);
            }
        }

        // úklid
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("temp");
        setIsLogin(false);
    };

    return isLogin ?
        <Planner
            onLogout={handleLogout}
        /> :
        <Login onLogin={handleLogin}/>;
}


export default App;
