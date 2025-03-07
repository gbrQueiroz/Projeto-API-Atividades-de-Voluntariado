const express = require("express");
const router = express.Router();
const authenticationRoutes = require("./authenticationRoutes.js");
const activitiesRoutes = require("./activitiesRoutes.js");

// Rota de autenticação (cadastro e login)
router.use("/auth", authenticationRoutes);

// Rota de atividades
router.use("/activities", activitiesRoutes);

module.exports = router;