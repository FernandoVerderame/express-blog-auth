// Importo il file .env
require("dotenv").config();

// Importo JWT
const jwt = require("jsonwebtoken");

// Importo gli users
const users = require('../db/users.json');

// Funzione per la generazione dei Token
const generateToken = user => jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

// Login
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