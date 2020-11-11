import React from "react";
import DatePicker from "react-datepicker/es";
import Button from "./Button";

export function NavBar(props) {


    return <nav className="navbar navbar-light position-sticky">
        <form className="form-inline">
            <label className="mr-2">Vyberte datum: </label>
            <DatePicker
                selected={props.selected}
                onChange={props.onChange}
            />
        </form>
        <Button
            className="btn btn-dark"
            value={"Odhlásit"}
            onClick={props.onLogout}
        />

    </nav>;
}

export default NavBar;