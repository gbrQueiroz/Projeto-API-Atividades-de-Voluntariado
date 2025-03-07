// Função responsável por verificar se a atividade já existe
function checkActivityExists(activityData, title, newActivityDate, address) {
  // Extrai o título, a data e o endereço da atividade a partir do objeto repassado
  const activityTitle = activityData.title;
  const activityDate = activityData.date;
  const activityAddress = activityData.address;

  // Converte a data da atividade e a nova data fornecida para timestamps
  const activityTimestamp = new Date(activityDate).getTime();
  const newActivityTimestamp = newActivityDate.getTime();

  // Verifica se o título, a data e o endereço da atividade são iguais aos dados fornecidos; caso positivo, retorna "true"; caso negativo, retorna "false"
  if (
    activityTitle === title &&
    activityTimestamp === newActivityTimestamp &&
    activityAddress === address
  ) {
    return true;
  }

  return false;
}

module.exports = checkActivityExists;