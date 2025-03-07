import { createMessageNotification } from "./createModalMessage.js";

// Responsável pela criação da cartela de atividades nº 3
function createActivityCardType3(activity) {
  // Construindo o contêiner principal
  const cardContainer = document.createElement("div");

  // Construindo o contêiner das informações da atividade
  const infoContainer = document.createElement("div");
  cardContainer.appendChild(infoContainer);

  // Nome da atividade
  const title = document.createElement("h3");
  title.textContent = activity.title;
  infoContainer.appendChild(title);

  // Descrição da atividade
  const description = document.createElement("p");
  description.textContent = activity.description;
  infoContainer.appendChild(description);

  // Converte a data para um objeto Date e ajusta o horário
  const activityDate = new Date(activity.date);
  activityDate.setHours(activityDate.getHours() - 3);

  // Convertendo a data para o formato DD/MM/AAAA
  const day = String(activityDate.getUTCDate()).padStart(2, "0");
  const month = String(activityDate.getUTCMonth() + 1).padStart(2, "0");
  const year = activityDate.getUTCFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  // Data de realização da atividade
  const date = document.createElement("p");
  date.textContent = `Data: ${formattedDate}`;
  infoContainer.appendChild(date);

  // Determinando o horário da atividade
  const hour = String(activityDate.getUTCHours()).padStart(2, "0");
  const minutes = String(activityDate.getUTCMinutes()).padStart(2, "0");
  const formattedTime = `${hour}:${minutes}`;

  // Hora da atividade
  const time = document.createElement("p");
  time.textContent = `Horário: ${formattedTime} (Horário Padrão de Brasília)`;
  infoContainer.appendChild(time);

  // Local de realização da atividade
  const location = document.createElement("p");
  location.textContent = `Local: ${activity.address}`;
  infoContainer.appendChild(location);

  // Contêiner do botão
  const buttonContainer = document.createElement("div");
  cardContainer.appendChild(buttonContainer);

  // Botão para desinscrever
  const unsubscribeButton = document.createElement("button");
  unsubscribeButton.textContent = "Desinscrever";
  buttonContainer.appendChild(unsubscribeButton);
  unsubscribeButton.addEventListener("click", unregisterFromActivity);

  // Estilos do contêiner principal
  cardContainer.style.display = "flex";
  cardContainer.style.justifyContent = "space-between";
  cardContainer.style.padding = "20px";
  cardContainer.style.marginBottom = "15px";
  cardContainer.style.backgroundColor = "#fff";
  cardContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  cardContainer.style.borderRadius = "8px";
  cardContainer.style.alignItems = "center";
  cardContainer.style.flexWrap = "wrap";

  // Estilos do contêiner das informações da atividade
  infoContainer.style.flex = "1";
  infoContainer.style.marginRight = "20px";

  // Estilos do contêiner do botão
  buttonContainer.style.display = "flex";
  buttonContainer.style.flexDirection = "column";
  buttonContainer.style.alignItems = "flex-end";

  // Estilos do botão de cancelamento
  unsubscribeButton.style.padding = "10px 20px";
  unsubscribeButton.style.backgroundColor = "#dc3545";
  unsubscribeButton.style.color = "#fff";
  unsubscribeButton.style.border = "none";
  unsubscribeButton.style.cursor = "pointer";
  unsubscribeButton.style.borderRadius = "5px";
  unsubscribeButton.style.marginBottom = "10px";
  unsubscribeButton.style.fontSize = "16px";

  unsubscribeButton.addEventListener("mouseover", function () {
    unsubscribeButton.style.backgroundColor = "#c82333";
  });
  unsubscribeButton.addEventListener("mouseout", function () {
    unsubscribeButton.style.backgroundColor = "#dc3545";
  });

  // Função para desinscrever o usuário de uma atividade
  function unregisterFromActivity() {
    // Obtém o ID da atividade
    const idActivity = activity.id;

    // Realiza uma requisição PUT para a API de cancelamento de inscrição
    fetch("/api/activities/cancelRegistration", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        activityId: idActivity,
      }),
    })
      .then((response) => {
        // Verifica se a resposta da requisição foi bem-sucedida
        if (!response.ok) {
          // Se não foi bem-sucedido, captura o erro e lança uma exceção
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Falha não identificada");
          });
        }

        // Se a requisição foi bem-sucedida, converte a resposta para JSON
        return response.json();
      })
      .then((data) => {
        // Cria uma notificação com a mensagem de sucesso após o cancelamento da inscrição
        createMessageNotification(data.message, " #28a745");
      })
      .catch((error) => {
        // Caso ocorra um erro, cria uma notificação com a mensagem de erro
        createMessageNotification(error.message, "#ff6347");
      });
  }

  // Retorna o contêiner principal
  return cardContainer;
}

export { createActivityCardType3 };