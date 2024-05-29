require("dotenv").config();

const jwt = require("jsonwebtoken");

const users = require('../db/users.json');

const generateToken = user => jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1m" });

const login = (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(404).send('Credenziali errate.');
    }

    const token = generateToken(user);
    res.send(token);
}

module.exports = {
    login
}