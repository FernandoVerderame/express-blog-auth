const globalErrors = (err, req, res, next) => {
    const statusCode = 500;
    res.format({
        html: () => res.status(statusCode).send("Qualcosa è andato storto! " + err.message),
        json: () => res.status(statusCode).json({ statusCode, error: err.message, stack: err.stack })
    });
}

module.exports = globalErrors;