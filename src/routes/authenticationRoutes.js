const express = require("express");
const authenticationController = require("../controllers/authenticationController.js");
const { verifyActiveSession, isAdmin } = require("../middlewares/index.js");
const router = express.Router();

// Rota responsável por cadastrar um novo usuário
router.post("/register", authenticationController.registerUser);

// Rota responsável por fazer login e gerar um token de autenticação
router.post("/login", authenticationController.login);

// Rota responsável por fazer logout, invalidando o token ou a sessão
router.post("/logout", verifyActiveSession, authenticationController.logout);

module.exports = router;