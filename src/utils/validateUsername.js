const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;

// Função responsável por verificar se o nome de usuário é válido
function validateUsername(username) {
  // Retorna "true" se for um formato válido, e "false" caso contrário
  return usernamePattern.test(username);
}

module.exports = validateUsername;