const express = require("express");
const router = express.Router();
const Plan = require("../model/plan");
const auth = require("../middleware/auth");
const hc = require("../utils/monthHourCalculator");
const comp = require("../utils/shiftComputer");

/**
 * Získání existujícího plánu směn
 */
router.get("/:year/:month", auth.authBearer, async (req, res) => {
    const user = req.user;
    const month = req.params.month;
    const year = req.params.year;
    const customID = "" + year + month + user._id;

    try {
        const plan = await Plan.findOne({_id: customID});
        if (!plan) {
            throw new Error("Nepodařilo se nalézt požadovaný plán");
        }
        res.status(200).json(plan);
    } catch (e) {
        console.log("catching error get plan")
        res.status(400).json({error: e.message});
    }
});

/**
 * Vytvoří nový plán BEZ uložení do databáze
 */
router.get("/:year/:month/new", auth.authBearer, async (req, res) => {
    const user = req.user;
    const month = req.params.month;
    const year = req.params.year;
    const customID = "" + year + month + user._id;

    // převedení měsíce na 0-base
    const date = new Date(year, month - 1, 1);

    try {
        const defPlan = createPlan(
            customID,
            user.id,
            year,
            month,
            Array(hc.getDaysInMonth(date)).fill("-")
        );
        defPlan.fund = hc.getFund(date);
        res.status(201).json(defPlan);
    } catch (e) {
        res.status(500).json({error: e.message});
    }


});

/**
 * Vypočítá počet hodin v plánu
 */
router.post("/:year/:month/comput", auth.authBearer, async (req, res) => {
    let body = req.body;
    try {
        const {shifts, fund} = body;

        const result = comp.compute(shifts);
        body.onPlan = result;
        body.diff = fund - result;

        res.status(200).json(body)
    } catch (e) {
        res.status(400).json({error: e.message});

    }
});

function createPlan(customID, id, year, month, shifts) {
    const plan = new Plan({
        customID: customID,
        owner: id,
        year: year,
        month: month,
        shifts: shifts
    });
    return plan;
}

/**
 * Uložení nového plánu směn
 */
router.post("/:year/:month", auth.authBearer, async (req, res) => {
    const id = req.user._id;
    const year = req.params.year;
    const month = req.params.month;
    const customID = "" + year + month + id;

    const plan = new Plan(req.body);
    plan._id = customID;

    try {
        await plan.save();
        res.status(201).json(plan);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

/**
 * Nahrazení existujícího plánu směn
 */
router.put("/:year/:month", auth.authBearer, async (req, res) => {
    const plan = req.body;
    try {
        await Plan.findByIdAndUpdate(plan._id, plan);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

/**
 * Vymazání plánu z databáze
 */
router.delete("/:year/:month", auth.authBearer, async (req, res) => {
    const plan = req.body;
    const user = req.user;
    try {
        if (plan.owner !== user.id) {
            throw new Error("Chyba při mazání záznam: " +
                "uživatel není vlastníkem záznamu");
        }
        await Plan.deleteOne({_id: plan._id});
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = router;