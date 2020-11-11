var express = require('express');
var router = express.Router();
const User = require("../model/user");
const auth = require("../middleware/auth");

/**
 * Vytvoření nového uživatele
 */
router.post("/", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        const name = user.name;

        res.cookie("token", token, {maxAge: 30000, httpOnly: true});
        res.status(201).json({name, token});
    } catch (e) {
        res.status(400).json({error:e.message});
    }

});

/**
 * Vymaže právě přihlášeného uživatele z databáze
 */
router.delete("/",auth.authBearer,async (req,res) => {

    try {
        await User.deleteOne({_id: req.user.id})
        res.status(200).json({message: "Odstranění uživatel proběhlo v pořádku"})
    }catch (e) {
        res.status(400).json({error:e.message})
    }
})

/**
 * Získání jména právě přihlášeného uživatele
 */
router.get("/me", auth.authBearer, async (req, res) => {
    try {
        res.status(200).json({name: req.user.name});
    } catch (e) {
        res.status(500).json({error:e.message});
    }

});

/**
 * Přihlášení stávajícího uživatele
 */
router.post("/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.login, req.body.password);
        const token = await user.generateAuthToken();
        const name = user.name;

        res.cookie("token", token, {maxAge: 30000, httpOnly: true});
        res.status(201).json({name, token});
    } catch (e) {
        res.status(400).json({error:e.message});
    }
});

/**
 * Odhlášní uživatele
 */
router.get("/logout", auth.authBearer, async (req, res) => {
    const user = req.user;

    try {
        await user.deleteAuthToken();

        res.clearCookie("token");
        res.sendStatus(200);
    } catch (e) {
        res.status(400).json({error:e.message});
    }
});

module.exports = router;
