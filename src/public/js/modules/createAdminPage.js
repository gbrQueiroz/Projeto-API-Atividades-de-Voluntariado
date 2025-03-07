import { createLoginPage } from "./createLoginPage.js";
import { createMessageNotification } from "./createModalMessage.js";
import { createActivityCardType1 } from "./createActivityCardType1.js";
import { createActivityCardType2 } from "./createActivityCardType2.js";
import { createActivityCardType3 } from "./createActivityCardType3.js";
import { createActivityForm } from "./createFormActivity.js";

// Função encarregada de criar a página do administrador
function createAdminUserPage() {
  // Selecionando o elemento body dentro do DOM
  const body = document.querySelector("body");

  // Construindo o contêiner principal
  const container = document.createElement("div");
  body.appendChild(container);

  // Construindo o cabeçalho
  const header = document.createElement("header");
  container.appendChild(header);

  // Criando o menu de navegação
  const nav = document.createElement("nav");
  header.appendChild(nav);

  // Construindo os botões das atividades
  const createActivitiesButton = document.createElement("button");
  createActivitiesButton.textContent = "Criar Atividade";
  nav.appendChild(createActivitiesButton);
  createActivitiesButton.addEventListener("click", displayActivityForm);

  const listAllActivitiesButton = document.createElement("button");
  listAllActivitiesButton.textContent = "Listar Atividades";
  nav.appendChild(listAllActivitiesButton);
  listAllActivitiesButton.addEventListener("click", listAllActivities);

  const availableActivitiesButton = document.createElement("button");
  availableActivitiesButton.textContent = "Atividades Disponíveis";
  nav.appendChild(availableActivitiesButton);
  availableActivitiesButton.addEventListener("click", listAvailableActivities);

  const registeredActivitiesButton = document.createElement("button");
  registeredActivitiesButton.textContent = "Atividades Inscritas";
  nav.appendChild(registeredActivitiesButton);
  registeredActivitiesButton.addEventListener("click", listMyActivities);

  // Criando a funcionalidade de logout
  const logoutContainer = document.createElement("div");
  header.appendChild(logoutContainer);

  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutContainer.appendChild(logoutButton);
  logoutButton.addEventListener("click", userLogout);

  // Construindo o conteúdo principal
  const main = document.createElement("main");
  container.appendChild(main);

  // Construindo a seção de listagem das atividades
  const activityListContainer = document.createElement("div");
  main.appendChild(activityListContainer);

  // Estilos globais
  body.style.margin = "0";
  body.style.fontFamily = "Arial, sans-serif";
  body.style.display = "flex";
  body.style.flexDirection = "column";
  body.style.height = "100vh";
  body.style.backgroundColor = "#f4f4f9";

  // Estilos do cabeçalho
  header.style.display = "flex";
  header.style.justifyContent = "space-evenly";
  header.style.alignItems = "center";
  header.style.padding = "20px";

  // Estilos do menu de navegação
  nav.style.display = "flex";
  nav.style.justifyContent = "center";
  nav.style.columnGap = "15px";
  nav.style.flexGrow = "1";

  // Estilos dos botões das atividades
  createActivitiesButton.style.padding = "10px 20px";
  createActivitiesButton.style.backgroundColor = "#28a745";
  createActivitiesButton.style.color = "#fff";
  createActivitiesButton.style.border = "none";
  createActivitiesButton.style.cursor = "pointer";
  createActivitiesButton.style.borderRadius = "5px";
  createActivitiesButton.style.fontSize = "16px";

  createActivitiesButton.addEventListener("mouseover", function () {
    createActivitiesButton.style.backgroundColor = "#218838";
  });
  createActivitiesButton.addEventListener("mouseout", function () {
    createActivitiesButton.style.backgroundColor = "#28a745";
  });

  listAllActivitiesButton.style.padding = "10px 20px";
  listAllActivitiesButton.style.backgroundColor = "#28a745";
  listAllActivitiesButton.style.color = "#fff";
  listAllActivitiesButton.style.border = "none";
  listAllActivitiesButton.style.cursor = "pointer";
  listAllActivitiesButton.style.borderRadius = "5px";
  listAllActivitiesButton.style.fontSize = "16px";

  listAllActivitiesButton.addEventListener("mouseover", function () {
    listAllActivitiesButton.style.backgroundColor = "#218838";
  });
  listAllActivitiesButton.addEventListener("mouseout", function () {
    listAllActivitiesButton.style.backgroundColor = "#28a745";
  });

  availableActivitiesButton.style.padding = "10px 20px";
  availableActivitiesButton.style.backgroundColor = "#28a745";
  availableActivitiesButton.style.color = "#fff";
  availableActivitiesButton.style.border = "none";
  availableActivitiesButton.style.cursor = "pointer";
  availableActivitiesButton.style.borderRadius = "5px";
  availableActivitiesButton.style.fontSize = "16px";

  availableActivitiesButton.addEventListener("mouseover", function () {
    availableActivitiesButton.style.backgroundColor = "#218838";
  });
  availableActivitiesButton.addEventListener("mouseout", function () {
    availableActivitiesButton.style.backgroundColor = "#28a745";
  });

  registeredActivitiesButton.style.padding = "10px 20px";
  registeredActivitiesButton.style.backgroundColor = "#28a745";
  registeredActivitiesButton.style.color = "#fff";
  registeredActivitiesButton.style.border = "none";
  registeredActivitiesButton.style.cursor = "pointer";
  registeredActivitiesButton.style.borderRadius = "5px";
  registeredActivitiesButton.style.fontSize = "16px";

  registeredActivitiesButton.addEventListener("mouseover", function () {
    registeredActivitiesButton.style.backgroundColor = "#218838";
  });
  registeredActivitiesButton.addEventListener("mouseout", function () {
    registeredActivitiesButton.style.backgroundColor = "#28a745";
  });

  // Estilos da área de logout
  logoutButton.style.padding = "10px 15px";
  logoutButton.style.backgroundColor = "#dc3545";
  logoutButton.style.color = "white";
  logoutButton.style.border = "none";
  logoutButton.style.cursor = "pointer";
  logoutButton.style.borderRadius = "5px";
  logoutButton.style.fontSize = "16px";

  logoutButton.addEventListener("mouseover", function () {
    logoutButton.style.backgroundColor = "#c82333";
  });
  logoutButton.addEventListener("mouseout", function () {
    logoutButton.style.backgroundColor = "#dc3545";
  });

  // Estilos do conteúdo principal
  main.style.flex = "1";
  main.style.padding = "20px";
  main.style.overflowY = "auto";

  // Estilos da seção de listagem das atividades
  activityListContainer.style.display = "flex";
  activityListContainer.style.flexDirection = "column";
  activityListContainer.style.gap = "15px";

  // Função para exibir o formulário de criação de atividade
  function displayActivityForm() {
    // Limpa o conteúdo atual do contêiner de atividades
    activityListContainer.innerHTML = "";

    // Cria o formulário para a nova atividade
    const activityForm = createActivityForm();

    // Adiciona o formulário ao contêiner de atividades na página
    activityListContainer.appendChild(activityForm);
  }

  // Função para listar todas as atividades cadastradas
  function listAllActivities() {
    // Realiza uma requisição GET para buscar todas as atividades
    fetch("/api/activities/allActivities")
      .then((response) => {
        // Verifica se a resposta da API foi bem-sucedida
        if (!response.ok) {
          // Se não foi bem-sucedido, captura o erro e lança uma exceção
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Falha não identificada");
          });
        }

        // Caso a requisição tenha sido bem-sucedida, converte a resposta para JSON
        return response.json();
      })
      .then((data) => {
        // Limpa o conteúdo atual do contêiner de atividades
        activityListContainer.innerHTML = "";

        // Verifica se não há atividades retornadas
        if (data.length === 0) {
          // Se não houver atividades, exibe uma notificação informando que não há atividades cadastradas
          createMessageNotification("Não há atividades cadastradas", "#ff6347");
        } else {
          // Se houver atividades, cria um cartão para cada uma e as adiciona ao contêiner de atividades
          data.forEach((activity) => {
            const activityCard = createActivityCardType1(activity);
            activityListContainer.appendChild(activityCard);
          });
        }
      })
      .catch((error) => {
        // Em caso de erro durante a requisição ou manipulação dos dados, limpa o contêiner
        activityListContainer.innerHTML = "";

        // Exibe uma notificação de erro
        createMessageNotification(error.message, "#ff6347");
      });
  }

  // Função para listar as atividades disponíveis
  function listAvailableActivities() {
    // Envia uma solicitação GET para o endpoint que retorna as atividades disponíveis
    fetch("/api/activities/availableActivities")
      .then((response) => {
        // Se a resposta não for OK, lança um erro
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Falha não identificada");
          });
        }

        // Retorna os dados da resposta como JSON
        return response.json();
      })
      .then((data) => {
        // Limpa o contêiner de atividades
        activityListContainer.innerHTML = "";

        // Verifica se há atividades disponíveis
        if (data.length === 0) {
          // Se não houver atividades, exibe uma mensagem informando que não há atividades disponíveis
          createMessageNotification("Não há atividades disponíveis", "#ff6347");
        } else {
          // Se houver atividades, cria um cartão para cada uma e adiciona ao contêiner
          data.forEach((activity) => {
            const cardActivity = createActivityCardType2(activity);
            activityListContainer.appendChild(cardActivity);
          });
        }
      })
      .catch((error) => {
        // Se ocorrer algum erro na requisição ou no processamento, limpa o contêiner de atividades
        activityListContainer.innerHTML = "";

        // Exibe uma notificação de erro
        createMessageNotification(error.message, "#ff6347");
      });
  }

  // Função para listar as atividades do usuário
  function listMyActivities() {
    // Realiza uma requisição para a API
    fetch("/api/activities")
      .then((response) => {
        // Se a resposta não for OK, lança um erro
        if (!response.ok) {
          return response.json().then((dataError) => {
            throw new Error(dataError.error || "Falha não identificada");
          });
        }

        // Caso a resposta da API seja positiva, retorna os dados da resposta como JSON
        return response.json();
      })
      .then((data) => {
        // Limpa a lista de atividades
        activityListContainer.innerHTML = "";

        // Verifica se há atividades inscritas
        if (data.length === 0) {
          // Caso não haja atividades, exibe uma mensagem de aviso
          createMessageNotification(
            "Não há atividades inscritas no momento",
            "#ff6347"
          );
        } else {
          // Se houver atividades, cria um cartão para cada uma e adiciona ao contêiner
          data.forEach((activity) => {
            const activityCard = createActivityCardType3(activity);
            activityListContainer.appendChild(activityCard);
          });
        }
      })
      .catch((error) => {
        // Se ocorrer um erro na requisição ou no processamento, limpa o contêiner de atividades
        activityListContainer.innerHTML = "";

        // Exibe uma notificação de erro com a mensagem de erro
        createMessageNotification(error.message, "#ff6347");
      });
  }

  // Função que realiza o logout do usuário
  function userLogout() {
    // Envia uma solicitação POST para o endpoint de logout
    fetch("/api/auth/logout", {
      method: "POST",
    })
      .then((response) => {
        // Se a resposta não for OK, lança um erro
        if (!response.ok) {
          throw new Error("Falha não identificada");
        }

        // Caso a resposta seja bem-sucedida, retorna os dados como JSON
        return response.json();
      })
      .then((data) => {
        // Limpa o conteúdo da página atual
        document.querySelector("body").innerHTML = "";
        document.querySelector("body").style = "";

        // Chama a função para criar a página de login após o logout
        createLoginPage();
      })
      .catch((error) => {
        // Se ocorrer um erro, exibe uma notificação com a mensagem de erro
        createMessageNotification(error.message, "#ff6347");
      });
  }
}

export { createAdminUserPage };