import { createMessageNotification } from "./createModalMessage.js";

// Função responsável por criar o modal para atualização de uma atividade
function createUpdateActivityModal(activityKey) {
  // Criando o contêiner do modal
  const modal = document.createElement("div");
  modal.id = "updateModalContainer";

  // Criando o conteúdo para o modal
  const modalContent = document.createElement("div");
  modal.appendChild(modalContent);

  // Título da janela modal
  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Atualizar Atividade";
  modalContent.appendChild(modalTitle);

  // Campo de entrada de título
  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Título da Atividade:";
  modalContent.appendChild(titleLabel);

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  modalContent.appendChild(titleInput);

  // Campo de entrada para a descrição
  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Descrição da Atividade:";
  modalContent.appendChild(descriptionLabel);

  const descriptionInput = document.createElement("textarea");
  modalContent.appendChild(descriptionInput);

  // Campo de seleção de data
  const dateLabel = document.createElement("label");
  dateLabel.textContent = "Data da Atividade:";
  modalContent.appendChild(dateLabel);

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  modalContent.appendChild(dateInput);

  // Campo de seleção de horário
  const timeLabel = document.createElement("label");
  timeLabel.textContent = "Horário da Atividade:";
  modalContent.appendChild(timeLabel);

  const timeInput = document.createElement("input");
  timeInput.type = "time";
  modalContent.appendChild(timeInput);

  // Campo de preenchimento de endereço
  const locationLabel = document.createElement("label");
  locationLabel.textContent = "Endereço da Atividade:";
  modalContent.appendChild(locationLabel);

  const locationInput = document.createElement("input");
  locationInput.type = "text";
  modalContent.appendChild(locationInput);

  // Campo para definir o número máximo de participantes
  const participantsLabel = document.createElement("label");
  participantsLabel.textContent = "Número Máximo de Participantes:";
  modalContent.appendChild(participantsLabel);

  const participantsInput = document.createElement("input");
  participantsInput.type = "number";
  participantsInput.min = "1";
  modalContent.appendChild(participantsInput);

  // Botão de atualizar dados
  const updateButton = document.createElement("button");
  updateButton.textContent = "Atualizar Atividade";
  modalContent.appendChild(updateButton);
  updateButton.addEventListener("click", editActivityInfo);

  // Botão de fechar modal
  const closeButton = document.createElement("button");
  closeButton.textContent = "Fechar";
  modalContent.appendChild(closeButton);
  closeButton.addEventListener("click", closeModal);

  // Estilos do contêiner do modal
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "1000";

  // Estilos para o conteúdo do modal
  modalContent.style.backgroundColor = "#fff";
  modalContent.style.padding = "30px";
  modalContent.style.borderRadius = "8px";
  modalContent.style.maxWidth = "500px";
  modalContent.style.width = "100%";

  // Estilos para o título do modal
  modalTitle.style.textAlign = "center";

  // Estilos do campo de entrada do título
  titleInput.style.width = "100%";
  titleInput.style.padding = "10px";
  titleInput.style.marginBottom = "15px";
  titleInput.style.borderRadius = "5px";
  titleInput.style.border = "1px solid #ccc";

  // Estilos do campo de entrada de descrição
  descriptionInput.style.width = "100%";
  descriptionInput.style.padding = "10px";
  descriptionInput.style.marginBottom = "15px";
  descriptionInput.style.borderRadius = "5px";
  descriptionInput.style.border = "1px solid #ccc";

  // Estilos do campo de entrada de data
  dateInput.style.width = "100%";
  dateInput.style.padding = "10px";
  dateInput.style.marginBottom = "15px";
  dateInput.style.borderRadius = "5px";
  dateInput.style.border = "1px solid #ccc";

  // Estilos do campo de entrada de horário
  timeInput.style.width = "100%";
  timeInput.style.padding = "10px";
  timeInput.style.marginBottom = "15px";
  timeInput.style.borderRadius = "5px";
  timeInput.style.border = "1px solid #ccc";

  // Estilos do campo de entrada de endereço
  locationInput.style.width = "100%";
  locationInput.style.padding = "10px";
  locationInput.style.marginBottom = "15px";
  locationInput.style.borderRadius = "5px";
  locationInput.style.border = "1px solid #ccc";

  // Estilos do campo de número máximo de participantes
  participantsInput.style.width = "100%";
  participantsInput.style.padding = "10px";
  participantsInput.style.marginBottom = "20px";
  participantsInput.style.borderRadius = "5px";
  participantsInput.style.border = "1px solid #ccc";

  // Estilos para o botão de atualizar
  updateButton.style.padding = "10px 20px";
  updateButton.style.backgroundColor = "#007bff";
  updateButton.style.color = "#fff";
  updateButton.style.border = "none";
  updateButton.style.cursor = "pointer";
  updateButton.style.borderRadius = "5px";

  updateButton.addEventListener("mouseover", function () {
    updateButton.style.backgroundColor = "#005bff";
  });
  updateButton.addEventListener("mouseout", function () {
    updateButton.style.backgroundColor = "#007bff";
  });

  // Estilos para o botão de fechar
  closeButton.style.padding = "10px 20px";
  closeButton.style.backgroundColor = "#dc3545";
  closeButton.style.color = "#fff";
  closeButton.style.border = "none";
  closeButton.style.cursor = "pointer";
  closeButton.style.borderRadius = "5px";
  closeButton.style.marginTop = "10px";
  closeButton.style.marginLeft = "10px";

  closeButton.addEventListener("mouseover", function () {
    closeButton.style.backgroundColor = "#c82333";
  });
  closeButton.addEventListener("mouseout", function () {
    closeButton.style.backgroundColor = "#dc3545";
  });

  // Função responsável pela atualização da atividade
  function editActivityInfo() {
    // Obtém o ID da atividade
    const idActivity = activityKey;

    // Obtém os novos valores inseridos pelo usuário nos campos de input
    const newTitle = titleInput.value;
    const newDescription = descriptionInput.value;
    const newDate = dateInput.value;
    const newTime = timeInput.value;
    const newLocation = locationInput.value;
    const newMaxParticipants = participantsInput.value;

    // Envia uma requisição PUT para atualizar a atividade no servidor
    fetch("/api/activities", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        activityId: idActivity,
        title: newTitle,
        description: newDescription,
        date: newDate,
        time: newTime,
        address: newLocation,
        maxQuantitySubscribers: newMaxParticipants,
      }),
    })
      .then((response) => {
        // Verifica se a resposta da requisição foi bem-sucedida
        if (!response.ok) {
          // Se a resposta não for bem-sucedida, captura o erro e lança uma exceção
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Falha não identificada");
          });
        }

        // Se a requisição for bem-sucedida, converte a resposta para JSON
        return response.json();
      })
      .then((data) => {
        // Após a atualização da atividade, fecha o modal
        closeModal();

        // Cria uma notificação de sucesso com a mensagem retornada pela API
        createMessageNotification(data.message, " #28a745");
      })
      .catch((error) => {
        // Em caso de erro, cria uma notificação de erro com a mensagem de erro
        createMessageNotification(error.message, "#ff6347");
      });
  }

  // Função responsável por fechar o modal
  function closeModal() {
    document.getElementById("updateModalContainer").remove();
  }

  // Retorna o contêiner principal
  return modal;
}

export { createUpdateActivityModal };