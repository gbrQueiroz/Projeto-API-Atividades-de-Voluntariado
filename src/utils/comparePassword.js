const bcrypt = require("bcrypt");

// Função responsável por comparar a senha fornecida com a senha criptografada
async function comparePassword(password, hashedPassword) {
  try {
    // Utilização do método "compare" para comparar as senhas
    const match = await bcrypt.compare(password, hashedPassword);

    // Retorna "true" se as senhas coincidirem, ou "false" se não coincidirem
    return match;
  } catch (error) {
    // Se ocorrer um erro durante a comparação, o erro será capturado e exibido no console
    console.error("Falha ao comparar as senhas - ", error);

    // Retorna "false" caso haja um erro
    return false;
  }
}

module.exports = comparePassword;