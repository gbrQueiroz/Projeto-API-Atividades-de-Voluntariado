const Database = require("../database/index.js");

// Criação das instâncias dos bancos de dados
const usersDb = new Database("users");
const activitiesDb = new Database("activities");

module.exports = {
  usersDb,
  activitiesDb,
};