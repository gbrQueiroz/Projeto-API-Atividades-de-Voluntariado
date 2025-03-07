const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Função responsável por verificar se o e-mail está no formato correto
function validateEmail(email) {
  // Retorna "true" se for um formato válido, e "false" caso contrário
  return emailPattern.test(email);
}

module.exports = validateEmail;