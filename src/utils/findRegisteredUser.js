// Função responsável por retornar os dados do usuário, caso o mesmo já esteja cadastrado
function findRegisteredUser(data, email) {
  // Percorre a lista de usuários
  for (let i = 0; i < data.length; i++) {
    const userRegistered = JSON.parse(data[i].value);

    // Caso já exista um usuário com esse e-mail cadastrado, retorna os dados do usuário
    if (userRegistered.email === email) {
      return userRegistered;
    }
  }
}

module.exports = findRegisteredUser;