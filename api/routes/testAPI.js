const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const getEmployees = (days) => {
    return (
        [
            {
                name: "Stanislav Čapek",
                shifts: Array(days).fill("_"),
                fund: 180,
                onPlan: 168,
                diff: -12
            },
            {
                name: "Někdo další",
                shifts: Array(days).fill("_"),
                fund: 180,
                onPlan: 180,
                diff: 0
            }
        ]
    );
};

router.get("/:days", (req, res, next) => {
    const days = parseInt(req.params.days);
    if (!isNaN(days)) {
        res.json(getEmployees(days));
    } else {
        res.status(500).send();
    }
});

router.get("/",async (req,res) => {

});

module.exports = router;