import { createMessageNotification } from "./createModalMessage.js";

// Responsável pela criação da cartela de atividades nº 2
function createActivityCardType2(activity) {
  // Construindo o contêiner principal
  const cardContainer = document.createElement("div");

  // Criando o contêiner para exibir as informações da atividade
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

  // Horário de realização da atividade
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

  // Botão para inscrever
  const subscribeButton = document.createElement("button");
  subscribeButton.textContent = "Inscrever";
  buttonContainer.appendChild(subscribeButton);
  subscribeButton.addEventListener("click", joinActivity);

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

  // Estilos do botão de inscrição
  subscribeButton.style.padding = "10px 20px";
  subscribeButton.style.backgroundColor = "#007bff";
  subscribeButton.style.color = "#fff";
  subscribeButton.style.border = "none";
  subscribeButton.style.cursor = "pointer";
  subscribeButton.style.borderRadius = "5px";
  subscribeButton.style.marginBottom = "10px";
  subscribeButton.style.fontSize = "16px";

  subscribeButton.addEventListener("mouseover", function () {
    subscribeButton.style.backgroundColor = "#005bff";
  });
  subscribeButton.addEventListener("mouseout", function () {
    subscribeButton.style.backgroundColor = "#007bff";
  });

  // Função para realizar a inscrição em uma atividade
  function joinActivity() {
    // Obtém o ID da atividade
    const idActivity = activity.id;

    // Envia uma requisição PUT para o endpoint que faz a inscrição na atividade
    fetch("/api/activities/signUpForActivity", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        activityId: idActivity,
      }),
    })
      .then((response) => {
        // Se a resposta não for bem-sucedida, lança um erro
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Falha não identificada");
          });
        }

        // Se a resposta for bem-sucedida, retorna os dados como JSON
        return response.json();
      })
      .then((data) => {
        // Cria uma notificação de sucesso com a mensagem recebida da API
        createMessageNotification(data.message, " #28a745");
      })
      .catch((error) => {
        // Se ocorrer um erro, cria uma notificação de erro
        createMessageNotification(error.message, "#ff6347");
      });
  }

  // Retorna o contêiner principal
  return cardContainer;
}

export { createActivityCardType2 };