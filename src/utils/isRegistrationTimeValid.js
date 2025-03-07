// Função responsável por verificar se o período de inscrições já expirou
function isRegistrationTimeValid(activityData) {
  // Obtém o timestamp atual
  let todayTimestamp = new Date().getTime();

  // Obtém o timestamp da atividade
  const activityTimestamp = new Date(activityData.date).getTime();

  // Retorna "true" se a data atual for anterior à data da atividade; caso contrário, retorna "false"
  return todayTimestamp < activityTimestamp;
}

module.exports = isRegistrationTimeValid;