// Função responsável por verificar se a quantidade máxima de inscritos foi atingida
function hasMaxRegistrationReached(activityData) {
  // Obtém a quantidade máxima de inscritos e o número atual de participantes na atividade
  const maxQuantitySubscribers = activityData.maxQuantitySubscribers;
  const currentQuantitySubscribers = activityData.subscribers.length;

  // Retorna "true" se o número atual de inscritos na atividade for superior ou igual à quantidade máxima de inscritos; caso contrário, retorna "false"
  return currentQuantitySubscribers >= maxQuantitySubscribers;
}

module.exports = hasMaxRegistrationReached;