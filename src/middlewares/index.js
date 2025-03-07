const jwt = require("jsonwebtoken");
const config = require("../config/index.js");

// Middleware responsável por verificar se a sessão está ativa
const verifyActiveSession = (req, res, next) => {
  // Obtém o token de sessão do cookie
  const sessionToken = req.cookies.session_id;

  // Se o token de sessão não estiver presente, retorna um erro 400
  if (!sessionToken) {
    return res.status(400).json({ error: "Token de sessão inválido" });
  }

  // Verifica a validade do token
  jwt.verify(sessionToken, config.SECRET_KEY, (error, decoded) => {
    // Se o token não for válido ou expirado, limpa o cookie da sessão e retorna um erro 404
    if (error) {
      res.cookie("session_id", "", { expires: new Date(0) });
      return res.status(404).json({ error: "Sessão inválida" });
    } else {
      // Se o token for válido, adiciona as informações do usuário ao objeto da requisição
      req.user = decoded.user;

      // Chama o próximo middleware ou a função de rota
      next();
    }
  });
};

// Middleware responsável por verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
  // Obtém os dados do usuário
  user = req.user;

  // Caso o usuário não seja administrador, retorna um erro 401
  if (!user.userType.includes("admin")) {
    return res.status(401).json({ error: "Requisição não autorizada" });
  }

  // Chama o próximo middleware ou a função da rota
  next();
};

module.exports = {
  verifyActiveSession,
  isAdmin,
};