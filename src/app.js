const express = require("express");
const routes = require("./routes/index.js");
const path = require("path");
const cookieParser = require("cookie-parser");
const config = require("./config/index.js");
const app = express();
const port = config.PORT;

// Middleware que permite ao Express analisar o JSON no corpo das requisições
app.use(express.json());

// Middleware que permite ao Express acessar os cookies das requisições
app.use(cookieParser());

// Middleware do Express para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "public", "html", "index.html"));
});

// Definição de rotas da API
app.use("/api", routes);

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em "http://localhost:${port}"`);
});