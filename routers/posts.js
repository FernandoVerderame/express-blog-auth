// Importo express
const express = require('express');

// Istanza di express.Router()
const router = express.Router();

// Controller dei posts
const postsControllers = require("../controllers/posts.js");

// Middleware per analizzare i dati codificati in URL
router.use(express.urlencoded({ extended: true }));

// Middleware della delete
const deleteErrors = require("../middlewares/deleteErrors.js");

//
const auth = require("../middlewares/auth.js");

// Importo multer 
const multer = require("multer");

// Istanza di multer
const uploader = multer({ dest: "public" });

// Index dei Posts
router.get("/", postsControllers.index);

// Rotta store
router.post("/", auth.authenticate, uploader.single("image"), postsControllers.store);

// Creazione di un Post
router.get("/create", postsControllers.create);

// Show dei posts
router.get("/:slug", postsControllers.show);

// Cancellazione di un Post
router.delete("/:slug", auth.authenticate, auth.authenticateAdmin, deleteErrors, postsControllers.destroy);

// Rotta per il download delle immagini
router.get("/:slug/download", postsControllers.file('download'));

// Esporto l'istanza di router
module.exports = router;