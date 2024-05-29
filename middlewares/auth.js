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
            return res.status(403).send(err);
        }

        req.user = user;
        next();
    });
}

module.exports = authenticate