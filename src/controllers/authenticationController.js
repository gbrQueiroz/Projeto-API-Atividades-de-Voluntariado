const dbInstances = require("../database/dbInstances.js");
const validateUsername = require("../utils/validateUsername.js");
const validateEmail = require("../utils/validateEmail.js");
const validatePassword = require("../utils/validatePassword.js");
const userExistsByEmailOrUsername = require("../utils/userExistsByEmailOrUsername.js");
const hashPassword = require("../utils/hashPassword.js");
const findRegisteredUser = require("../utils/findRegisteredUser.js");
const comparePassword = require("../utils/comparePassword.js");
const jwt = require("jsonwebtoken");
const config = require("../config/index.js");
const crypto = require("crypto");

// Responsável por cadastrar um usuário
const registerUser = (req, res) => {
  // Extração do nome de usuário, do e-mail e da senha do corpo da requisição
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Verificação de preenchimento dos campos
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({
        error:
          "Preenchimento obrigatório dos campos de nome do usuário, e-mail e senha",
      });
  }

  // Validação do nome de usuário
  if (!validateUsername(username)) {
    return res.status(400).json({
      error:
        "O nome de usuário deve ter entre 3 e 20 caracteres, começar com uma letra e conter apenas letras, números, sublinhados e hífens",
    });
  }

  // Validação do e-mail
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Formato de e-mail inválido" });
  }

  // Validação da senha
  if (!validatePassword(password)) {
    return res.status(400).json({
      error:
        "A senha deve possuir pelo menos 8 caracteres, uma letra minúscula, uma letra maiúscula, um número e um caractere especial",
    });
  }

  // Lê todos os dados dos usuários no banco de dados (dbInstances.userDb)
  dbInstances.usersDb.readAllData(async (error, data) => {
    // Caso ocorra algum erro ao tentar acessar o banco de dados
    if (error) {
      return res.status(500).json({ error: "Falha ao listar os usuários" });
    }

    // Verifica se algum usuário já possui o mesmo nome de usuário ou o mesmo e-mail
    if (userExistsByEmailOrUsername(data, username, email)) {
      return res
        .status(400)
        .json({ error: "E-mail e/ou nome de usuário já cadastrados" });
    }

    // Gera um ID único para o novo usuário
    const newUserId = crypto.randomUUID();

    // Criptografa a senha antes de salvar no banco de dados
    const newHashedPassword = await hashPassword(password);

    // Cria o objeto do novo usuário
    const newUser = {
      id: newUserId,
      username: username,
      email: email,
      password: newHashedPassword,
      userType: ["user"],
      registeredActivities: [],
    };

    // Armazena os dados do novo usuário no banco de dados
    dbInstances.usersDb.put(
      `${newUserId}`,
      JSON.stringify(newUser),
      (error) => {
        // Caso haja algum erro na criação do usuário, retorna um erro
        if (error) {
          return res.status(500).json({ error: "Falha ao criar o usuário" });
        }

        // Se o usuário for criado com sucesso, retorna uma resposta com status 201 e os dados do novo usuário
        res
          .status(201)
          .json({ success: true, message: "Cadastro efetuado com sucesso" });
      }
    );
  });
};

// Responsável por fazer login e gerar um token de autenticação
const login = (req, res) => {
  // Extração do e-mail e da senha do corpo da requisição
  const email = req.body.email;
  const password = req.body.password;

  // Verifica se o e-mail ou a senha não foram fornecidos
  if (!email || !password) {
    // Se faltar algum campo, limpa o cookie de sessão e retorna um erro 400
    res.cookie("session_id", "", { expires: new Date(0) });
    return res.status(400).json({
      error: "Preenchimento obrigatório dos campos de e-mail e senha",
    });
  }

  // Acessa o banco de dados para buscar todos os usuários cadastrados
  dbInstances.usersDb.readAllData(async (error, data) => {
    // Caso ocorra algum erro ao tentar acessar o banco de dados, retorna um erro 500
    if (error) {
      return res.status(500).json({ error: "Falha ao listar os usuários" });
    }

    // Função para encontrar o usuário registrado no banco com o e-mail informado
    const foundUser = findRegisteredUser(data, email);

    // Se o usuário não for encontrado
    if (!foundUser) {
      // Limpa o cookie de sessão e retorna um erro 404
      res.cookie("session_id", "", { expires: new Date(0) });
      return res.status(404).json({ error: "E-mail não registrado" });
    }

    // Compara a senha fornecida com a senha armazenada no banco de dados
    const isPasswordValid = await comparePassword(password, foundUser.password);

    // Se a senha fornecida for inválida
    if (!isPasswordValid) {
      // Limpa o cookie de sessão e retorna um erro 404
      res.cookie("session_id", "", { expires: new Date(0) });
      return res.status(404).json({ error: "Senha inválida" });
    }

    // Se a autenticação for bem-sucedida, cria um objeto com os dados do usuário
    const user = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      password: foundUser.password,
      userType: foundUser.userType,
      registeredActivities: foundUser.registeredActivities,
    };

    try {
      // Gera um token JWT com as informações do usuário
      const sessionToken = jwt.sign({ user }, config.SECRET_KEY);

      // Armazena o token gerado no cookie "session_id"
      res.cookie("session_id", sessionToken, {
        maxAge: 86400000,
        httpOnly: true,
      });

      // Retorna uma resposta de sucesso 201 após gerar o token de sessão
      res
        .status(201)
        .json({ success: true, userType: `${foundUser.userType}` });
    } catch (error) {
      // Caso ocorra algum erro na criação do token, retorna um erro 500
      res.status(500).json({ error: "Falha na geração do token de sessão" });
    }
  });
};

// Responsável por invalidar o token ou a sessão
const logout = (req, res) => {
  // Limpa o cookie de sessão, e retorna um status de sucesso
  res.cookie("session_id", "", { expires: new Date(0) });
  res.status(200).json({ success: true });
};

module.exports = {
  registerUser,
  login,
  logout,
};