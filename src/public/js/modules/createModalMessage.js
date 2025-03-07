// Responsável pela criação da caixa de alertas
function createMessageNotification(message, color) {
  // Verifica se já existe alguma notifiçação; caso positivo, remove-a
  if (document.getElementById("notificationContainer")) {
    document.getElementById("notificationContainer").remove();
  }

  // Desenvolvendo o contêiner da notificação
  const notificationContainer = document.createElement("div");
  notificationContainer.id = "notificationContainer";

  // Incluindo a mensagem
  const textNode = document.createElement("span");
  textNode.textContent = message;
  notificationContainer.appendChild(textNode);

  // Implementando o botão de fechamento
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  notificationContainer.appendChild(closeButton);
  closeButton.addEventListener("click", closeNotification);

  // Estilos do contêiner de notificação
  notificationContainer.style.position = "fixed";
  notificationContainer.style.bottom = "0";
  notificationContainer.style.left = "50%";
  notificationContainer.style.transform = "translateX(-50%)";
  notificationContainer.style.padding = "30px 40px";
  notificationContainer.style.backgroundColor = color;
  notificationContainer.style.borderTopLeftRadius = "10px";
  notificationContainer.style.borderTopRightRadius = "10px";
  notificationContainer.style.display = "flex";
  notificationContainer.style.justifyContent = "center";
  notificationContainer.style.alignItems = "center";
  notificationContainer.style.color = "white";
  notificationContainer.style.fontSize = "20px";
  notificationContainer.style.zIndex = "1000";

  // Estilos do botão de fechar
  closeButton.style.position = "absolute";
  closeButton.style.top = "7px";
  closeButton.style.right = "7px";
  closeButton.style.cursor = "pointer";
  closeButton.style.background = "transparent";
  closeButton.style.border = "none";
  closeButton.style.color = "white";
  closeButton.style.fontSize = "25px";
  closeButton.style.fontWeight = "bold";
  closeButton.style.padding = "0";
  closeButton.style.width = "25px";
  closeButton.style.height = "25px";
  closeButton.style.textAlign = "center";

  // Função encarregada de fechar a notificação
  function closeNotification() {
    document.getElementById("notificationContainer").remove();
    clearTimeout(timeoutId);
  }

  // Função que remove a notificação automaticamente após 5 segundos
  const timeoutId = setTimeout(() => {
    document.getElementById("notificationContainer").remove();
  }, 5000);

  // Adicionando a notificação ao corpo da página
  document.body.appendChild(notificationContainer);
}

export { createMessageNotification };