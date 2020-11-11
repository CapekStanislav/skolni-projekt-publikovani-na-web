const jwt = require("jsonwebtoken");
const User = require("../model/user");
const secret = "witcher";

const auth = async (token, req, res, next) => {
    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findOne({_id: decoded._id, "token": token});
        if (!user) {
            throw new Error("Nepodařilo se ověřit uživatele - neplatný token")
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).json({error: e.message});
    }
};

const authCookie = async (req, res, next) => {
    const token = req.cookies.token;
    await auth(token, req, res, next);
};

const authToken = async (req, res, next) => {
    const token = req.body.token;
    await auth(token, req, res, next);
};

const authBearer = async (req, res, next) => {
    try {
        const token = req.get("Authorization").replace("Bearer ", "");
        await auth(token, req, res, next);
    } catch (e) {
        throw new Error("Chyba při autentizace uživatele - žádný token")
    }
}


module.exports = {
    authCookie: authCookie,
    authToken: authToken,
    authBearer: authBearer
};