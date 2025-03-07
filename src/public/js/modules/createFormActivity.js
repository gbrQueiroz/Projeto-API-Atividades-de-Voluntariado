import { createMessageNotification } from "./createModalMessage.js";

// Responsável por elaborar o formulário para criar uma atividade
function createActivityForm() {
  // Criando o contêiner principal
  const formContainer = document.createElement("div");

  // Área do título do contêiner principal
  const formTitle = document.createElement("h2");
  formTitle.textContent = "Criar Atividade";
  formContainer.appendChild(formTitle);

  // Local para inserir o título da atividade
  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Título da Atividade:";
  formContainer.appendChild(titleLabel);

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  formContainer.appendChild(titleInput);

  // Área para inserir a descrição
  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Descrição da Atividade:";
  formContainer.appendChild(descriptionLabel);

  const descriptionInput = document.createElement("textarea");
  formContainer.appendChild(descriptionInput);

  // Campo para informar a data
  const dateLabel = document.createElement("label");
  dateLabel.textContent = "Data da Atividade:";
  formContainer.appendChild(dateLabel);

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  formContainer.appendChild(dateInput);

  // Campo para informar o horário
  const timeLabel = document.createElement("label");
  timeLabel.textContent = "Horário da Atividade:";
  formContainer.appendChild(timeLabel);

  const timeInput = document.createElement("input");
  timeInput.type = "time";
  formContainer.appendChild(timeInput);

  // Campo para informar o local
  const locationLabel = document.createElement("label");
  locationLabel.textContent = "Local da Atividade:";
  formContainer.appendChild(locationLabel);

  const locationInput = document.createElement("input");
  locationInput.type = "text";
  formContainer.appendChild(locationInput);

  // Campo para definir o número máximo de participantes
  const participantsLabel = document.createElement("label");
  participantsLabel.textContent = "Número Máximo de Participantes:";
  formContainer.appendChild(participantsLabel);

  const participantsInput = document.createElement("input");
  participantsInput.type = "number";
  participantsInput.min = "1";
  formContainer.appendChild(participantsInput);

  // Botão de envio
  const submitButton = document.createElement("button");
  submitButton.textContent = "Criar Atividade";
  formContainer.appendChild(submitButton);
  submitButton.addEventListener("click", createActivity);

  // Estilos do contêiner principal
  formContainer.style.width = "100%";
  formContainer.style.maxWidth = "600px";
  formContainer.style.margin = "0 auto";
  formContainer.style.padding = "20px";
  formContainer.style.backgroundColor = "#fff";
  formContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  formContainer.style.borderRadius = "8px";

  // Estilos do título do contêiner principal
  formTitle.style.textAlign = "center";
  formTitle.style.marginBottom = "20px";

  // Estilos do campo de título
  titleInput.style.padding = "10px";
  titleInput.style.marginBottom = "15px";
  titleInput.style.borderRadius = "5px";
  titleInput.style.border = "1px solid #ccc";

  // Estilos do campo de descrição
  descriptionInput.style.padding = "10px";
  descriptionInput.style.marginBottom = "15px";
  descriptionInput.style.borderRadius = "5px";
  descriptionInput.style.border = "1px solid #ccc";

  // Estilos do campo de data
  dateInput.style.padding = "10px";
  dateInput.style.marginBottom = "15px";
  dateInput.style.borderRadius = "5px";
  dateInput.style.border = "1px solid #ccc";

  // Estilos do campo de horário
  timeInput.style.padding = "10px";
  timeInput.style.marginBottom = "15px";
  timeInput.style.borderRadius = "5px";
  timeInput.style.border = "1px solid #ccc";

  // Estilos do campo de local
  locationInput.style.padding = "10px";
  locationInput.style.marginBottom = "15px";
  locationInput.style.borderRadius = "5px";
  locationInput.style.border = "1px solid #ccc";

  // Estilos do campo de número máximo de participantes
  participantsInput.style.padding = "10px";
  participantsInput.style.marginBottom = "20px";
  participantsInput.style.borderRadius = "5px";
  participantsInput.style.border = "1px solid #ccc";

  // Estilos do botão de envio
  submitButton.style.padding = "10px 20px";
  submitButton.style.backgroundColor = "#28a745";
  submitButton.style.color = "#fff";
  submitButton.style.border = "none";
  submitButton.style.cursor = "pointer";
  submitButton.style.borderRadius = "5px";
  submitButton.style.fontSize = "16px";

  submitButton.addEventListener("mouseover", function () {
    submitButton.style.backgroundColor = "#218838";
  });
  submitButton.addEventListener("mouseout", function () {
    submitButton.style.backgroundColor = "#28a745";
  });

  // Estilos extras para o formulário
  formContainer.style.display = "flex";
  formContainer.style.flexDirection = "column";
  formContainer.style.gap = "15px";

  // Função para criar uma nova atividade
  function createActivity() {
    // Obtém os valores dos campos do formulário para a nova atividade
    const titleNewActivity = titleInput.value;
    const descriptionNewActivity = descriptionInput.value;
    const dateNewActivity = dateInput.value;
    const timeNewActivity = timeInput.value;
    const locationNewActivity = locationInput.value;
    const maxQuantitySubscribersNewActivity = participantsInput.value;

    // Realiza uma requisição POST para criar a nova atividade
    fetch("/api/activities", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: titleNewActivity,
        description: descriptionNewActivity,
        date: dateNewActivity,
        time: timeNewActivity,
        address: locationNewActivity,
        maxQuantitySubscribers: maxQuantitySubscribersNewActivity,
      }),
    })
      .then((response) => {
        // Verifica se a resposta da API foi bem-sucedida
        if (!response.ok) {
          // Se não for bem-sucedida, captura o erro e lança uma exceção
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Falha não identificada");
          });
        }

        // Caso a requisição tenha sido bem-sucedida, converte a resposta para JSON
        return response.json();
      })
      .then((data) => {
        // Limpa os campos do formulário após a criação da atividade
        titleInput.value = "";
        descriptionInput.value = "";
        dateInput.value = "";
        timeInput.value = "";
        locationInput.value = "";
        participantsInput.value = "";

        // Cria uma notificação de sucesso com a mensagem retornada pela API
        createMessageNotification(data.message, " #28a745");
      })
      .catch((error) => {
        // Em caso de erro, cria uma notificação com a mensagem de erro
        createMessageNotification(error.message, "#ff6347");
      });
  }

  // Retorna o contêiner principal
  return formContainer;
}

export { createActivityForm };