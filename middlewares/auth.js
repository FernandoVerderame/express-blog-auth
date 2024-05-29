require("dotenv").config();

const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send('Devi prima autenticarti.');
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            err.message === 'invalid signature' && res.status(401).send('Non sei autorizzato');
            err.message === 'jwt expired' && res.status(403).send('Sessione scaduta');
        }

        req.user = user;
        next();
    });
}

module.exports = authenticate