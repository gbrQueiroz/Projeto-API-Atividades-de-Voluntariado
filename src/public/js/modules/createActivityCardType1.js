import { createUpdateActivityModal } from "./createUpdateActivityModal.js";
import { createMessageNotification } from "./createModalMessage.js";

// Responsável pela criação da cartela de atividades nº 1
function createActivityCardType1(activity) {
  // Criando o contêiner principal
  const cardContainer = document.createElement("div");

  // Criando o contêiner para as informações da atividade
  const infoContainer = document.createElement("div");
  cardContainer.appendChild(infoContainer);

  // Título da atividade
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

  // Identificando o horário de realização da atividade
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

  // Membros participantes
  const participantsTitle = document.createElement("p");
  participantsTitle.textContent = "Participantes:";
  infoContainer.appendChild(participantsTitle);

  const participantsList = document.createElement("ul");
  activity.subscribers.forEach((participant) => {
    const participantItem = document.createElement("li");
    participantItem.textContent = participant;
    participantsList.appendChild(participantItem);
  });
  infoContainer.appendChild(participantsList);

  // Contêiner para os botões de edição e exclusão
  const buttonContainer = document.createElement("div");
  cardContainer.appendChild(buttonContainer);

  // Botão de edição
  const editButton = document.createElement("button");
  editButton.textContent = "Editar";
  buttonContainer.appendChild(editButton);
  editButton.addEventListener("click", openActivityUpdateModal);

  // Botão de deletar
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Excluir";
  buttonContainer.appendChild(deleteButton);
  deleteButton.addEventListener("click", removeActivity);

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

  // Estilos do contêiner dos botões
  buttonContainer.style.display = "flex";
  buttonContainer.style.flexDirection = "column";
  buttonContainer.style.alignItems = "flex-end";

  // Estilos do botão de edição
  editButton.style.padding = "10px 20px";
  editButton.style.backgroundColor = "#007bff";
  editButton.style.color = "#fff";
  editButton.style.border = "none";
  editButton.style.cursor = "pointer";
  editButton.style.borderRadius = "5px";
  editButton.style.marginBottom = "10px";
  editButton.style.fontSize = "16px";

  editButton.addEventListener("mouseover", function () {
    editButton.style.backgroundColor = "#005bff";
  });
  editButton.addEventListener("mouseout", function () {
    editButton.style.backgroundColor = "#007bff";
  });

  // Estilos do botão de remoção
  deleteButton.style.padding = "10px 20px";
  deleteButton.style.backgroundColor = "#dc3545";
  deleteButton.style.color = "#fff";
  deleteButton.style.border = "none";
  deleteButton.style.cursor = "pointer";
  deleteButton.style.borderRadius = "5px";
  deleteButton.style.fontSize = "16px";

  deleteButton.addEventListener("mouseover", function () {
    deleteButton.style.backgroundColor = "#c82333";
  });
  deleteButton.addEventListener("mouseout", function () {
    deleteButton.style.backgroundColor = "#dc3545";
  });

  // Função para abrir o modal de atualização da atividade
  function openActivityUpdateModal() {
    // Obtém o ID da atividade
    const idActivity = activity.id;

    // Cria o modal de atualização da atividade
    const updateModal = createUpdateActivityModal(idActivity);

    // Adiciona o modal criado ao corpo da página
    document.querySelector("body").appendChild(updateModal);
  }

  // Função para remover uma atividade
  function removeActivity() {
    // Obtém o ID da atividade
    const idActivity = activity.id;

    // Realiza uma requisição DELETE para remover a atividade do servidor
    fetch("/api/activities", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        activityId: idActivity,
      }),
    })
      .then((response) => {
        // Verifica se a resposta da API foi bem-sucedida
        if (!response.ok) {
          // Se a resposta não for bem-sucedida, captura o erro e lança uma exceção
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Falha não identificada");
          });
        }

        // Caso a requisição tenha sido bem-sucedida, converte a resposta para JSON
        return response.json();
      })
      .then((data) => {
        // Cria uma notificação de sucesso com a mensagem retornada pela API
        createMessageNotification(data.message, " #28a745");
      })
      .catch((error) => {
        // Se ocorrer um erro, cria uma notificação com a mensagem de erro
        createMessageNotification(error.message, "#ff6347");
      });
  }

  // Retorna o contêiner principal
  return cardContainer;
}

export { createActivityCardType1 };