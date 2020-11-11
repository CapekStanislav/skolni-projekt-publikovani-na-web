import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";
import Form from "react-bootstrap/Form";
import {FormGroup} from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";
import FormText from "react-bootstrap/FormText";
import shiftMapper from "../module/shiftMapper";
import FormLabel from "react-bootstrap/FormLabel";

function ModalButtonChoices(props) {
    const [showInput, setShowInput] = useState(false);
    const [show, setShow] = useState(false);
    let input = 0;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const choicesMap = shiftMapper.shiftMap();

    const getValues = (map) => {
        const ch = [];
        for (let value of map.values()) {
            ch.push(value);
        }
        // poslední volba
        ch.push("hodiny");
        return ch;
    };

    const choices = getValues(choicesMap);

    const getKey = (map, v) => {
        for (let [key, value] of map.entries()) {
            if (value === v) {
                return key;
            }
        }
    };

    const handleSelect = e => {
        let value = e.target.value;
        value === "hodiny" ? setShowInput(true) : setShowInput(false);
    };

    const handleInput = (e) => {
        let value = e.target.value;
        if (value > 0) {
            input = value;
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        let value = e.target.formSelect.value;
        if (value === "hodiny") {
            props.onSave(props.day, input);
        } else {
            props.onSave(props.day, getKey(choicesMap, value));
        }
        setShowInput(false);
        handleClose();
    };

    return <>
        <Button variant="light" onClick={handleShow}>
            {props.text}
        </Button>

        <Modal show={show} onHide={handleClose}>
            {/*Hlava zprávy*/}
            <ModalHeader closeButton>
                <Modal.Title>Výběr směny</Modal.Title>
            </ModalHeader>

            <Form onSubmit={handleSave}>
                {/*Tělo zprávy*/}
                <ModalBody>
                    <FormGroup controlId={"formSelect"}>
                        <FormLabel>Vyberte z nabídky</FormLabel>
                        <FormControl as={"select"} onChange={handleSelect}>
                            {choices.map((option, index) => {
                                return <option key={index}>{option}</option>
                            })}
                        </FormControl>
                    </FormGroup>
                    {showInput ?
                        <FormGroup controlId={"formValueInput"}>
                            <FormLabel>zadejte počet hodin</FormLabel>
                            <FormControl
                                type={"number"}
                                placeHolder={input}
                                min={0}
                                max={24}
                                onChange={handleInput}
                            />
                            <FormText>Hodnota od 0 do 24</FormText>
                        </FormGroup>
                        : ""}
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onClick={handleClose}>
                        Zavřít
                    </Button>
                    <Button variant="primary" type={"submit"}>
                        Uložit změnu
                    </Button>
                </ModalFooter>
            </Form>

        </Modal>
    </>;
}

export default ModalButtonChoices;