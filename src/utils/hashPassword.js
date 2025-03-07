const bcrypt = require("bcrypt");

// Função responsável por converter a senha em um hash
async function hashPassword(password) {
  try {
    // Gera um "salt" para criptografar a senha
    const salt = await bcrypt.genSalt(10);

    // Gera o "hash" da senha fornecida
    const hash = await bcrypt.hash(password, salt);

    // Retorna o "hash" gerado
    return hash;
  } catch (error) {
    // Caso ocorra algum erro durante a geração do "salt" ou do "hash", captura o erro e imprime no console
    console.error("Falha na geração do hash da senha - ", error);

    // Retorna "false" caso ocorra um erro no processo de "hash"
    return false;
  }
}

module.exports = hashPassword;