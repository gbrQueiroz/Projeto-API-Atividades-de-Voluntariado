require("dotenv").config();

// Variável responsável por armazenar as variáveis de ambiente
const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 80,
  SECRET_KEY: process.env.SECRET_KEY || "senha_aleatória",
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};

module.exports = config;