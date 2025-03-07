// Função responsável por verificar se algum usuário já possui o mesmo nome de usuário ou o mesmo e-mail
function userExistsByEmailOrUsername(data, username, email) {
  // Percorre a lista de usuários
  for (let i = 0; i < data.length; i++) {
    const userRegistered = JSON.parse(data[i].value);

    // Se o nome de usuário já existir, retorna um valor booleano "true"
    if (userRegistered.username === username) {
      return true;
    }

    // Se o e-mail já existir, retorna um valor booleano "true"
    if (userRegistered.email === email) {
      return true;
    }
  }

  // Caso não exista, retorna um valor booleano "false"
  return false;
}

module.exports = userExistsByEmailOrUsername;