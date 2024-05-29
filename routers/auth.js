// Importo express
const express = require('express');

// Istanza di express.Router()
const router = express.Router();

// Controller dell'autenticazione
const authController = require("../controllers/auth.js");

// Middleware per analizzare i dati codificati in URL
router.use(express.urlencoded({ extended: true }));

// 
router.post("/", authController.login)

module.exports = router;