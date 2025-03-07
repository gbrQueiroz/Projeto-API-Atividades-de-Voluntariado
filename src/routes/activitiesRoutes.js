const express = require("express");
const activitiesController = require("../controllers/activitiesController.js");
const { verifyActiveSession, isAdmin } = require("../middlewares/index.js");
const router = express.Router();

// Rota responsável por retornar um array contendo as informações das atividades nas quais o usuário está inscrito
router.get("/", verifyActiveSession, activitiesController.userActivities);

// Rota responsável por retornar um array com as informações das atividades disponíveis para o usuário
router.get(
  "/availableActivities",
  verifyActiveSession,
  activitiesController.availableActivities
);

// Rota responsável por registrar um usuário em uma atividade
router.put(
  "/signUpForActivity",
  verifyActiveSession,
  activitiesController.signUpForActivity
);

// Rota responsável por cancelar a inscrição de um usuário em uma atividade
router.put(
  "/cancelRegistration",
  verifyActiveSession,
  activitiesController.cancelRegistration
);

// Rota responsável por criar uma atividade
router.post(
  "/",
  verifyActiveSession,
  isAdmin,
  activitiesController.createActivity
);

// Rota responsável por atualizar uma atividade
router.put(
  "/",
  verifyActiveSession,
  isAdmin,
  activitiesController.updateActivity
);

// Rota responsável por deletar uma atividade
router.delete(
  "/",
  verifyActiveSession,
  isAdmin,
  activitiesController.deleteActivity
);

// Rota responsável por listar todas as atividades
router.get(
  "/allActivities",
  verifyActiveSession,
  isAdmin,
  activitiesController.allActivities
);

module.exports = router;