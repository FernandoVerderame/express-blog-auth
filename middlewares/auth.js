require("dotenv").config();

const users = require("../db/users.json");

const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send('Devi prima autenticarti.');
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send(err);
        }

        req.user = user;
        next();
    });
}

const authenticateAdmin = (req, res, next) => {
    const { username, password } = req.user;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user || !user.admin) {
        return res.status(403).send('Non sei autorizzato, devi essere admin.');
    }
    next();
}

module.exports = {
    authenticate,
    authenticateAdmin
}