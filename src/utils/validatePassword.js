const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Função responsável por verificar se a senha possui pelo menos 8 caracteres, uma letra minúscula, uma letra maiúscula, um número e um caractere especial
function validatePassword(password) {
  // Retorna "true" se for um formato válido, e "false" caso contrário
  return passwordPattern.test(password);
}

module.exports = validatePassword;