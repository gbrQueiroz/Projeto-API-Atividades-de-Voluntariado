import { createLoginPage } from "./createLoginPage.js";
import { createMessageNotification } from "./createModalMessage.js";

// Função encarregada de criar a página de cadastro
function createSignUpPage() {
  // Acessando o elemento body no DOM
  const body = document.querySelector("body");

  // Montando o contêiner principal
  const container = document.createElement("div");
  body.appendChild(container);

  // Definindo o título
  const h1 = document.createElement("h1");
  h1.textContent = "Cadastro de Usuário";
  container.appendChild(h1);

  // Criando o campo de entrada para o nome de usuário
  const usernameGroup = document.createElement("div");
  usernameGroup.className = "input-group";
  const usernameLabel = document.createElement("label");
  usernameLabel.textContent = "Nome de Usuário";
  usernameGroup.appendChild(usernameLabel);
  const usernameInput = document.createElement("input");
  usernameInput.className = "input-field";
  usernameInput.placeholder = "Digite seu nome de usuário";
  usernameGroup.appendChild(usernameInput);
  container.appendChild(usernameGroup);

  // Criando o campo de entrada para o e-mail
  const emailGroup = document.createElement("div");
  emailGroup.className = "input-group";
  const emailLabel = document.createElement("label");
  emailLabel.textContent = "E-mail";
  emailGroup.appendChild(emailLabel);
  const emailInput = document.createElement("input");
  emailInput.className = "input-field";
  emailInput.placeholder = "Digite seu e-mail";
  emailGroup.appendChild(emailInput);
  container.appendChild(emailGroup);

  // Criando o campo de entrada para a senha
  const passwordGroup = document.createElement("div");
  passwordGroup.className = "input-group";
  const passwordLabel = document.createElement("label");
  passwordLabel.textContent = "Senha";
  passwordGroup.appendChild(passwordLabel);
  const passwordInput = document.createElement("input");
  passwordInput.className = "input-field";
  passwordInput.placeholder = "Digite sua senha";
  passwordInput.type = "password";
  passwordGroup.appendChild(passwordInput);
  container.appendChild(passwordGroup);

  // Criando o botão de registro
  const submitButton = document.createElement("button");
  submitButton.textContent = "Cadastrar";
  container.appendChild(submitButton);
  submitButton.addEventListener("click", signUpUser);

  // Criando um link para a página de login
  const signUpLink = document.createElement("div");
  signUpLink.textContent = "Já possui conta? Faça login";
  container.appendChild(signUpLink);
  signUpLink.addEventListener("click", redirectToLogin);

  // Estilos globais
  body.style.margin = "0";
  body.style.fontFamily = "Arial, sans-serif";
  body.style.backgroundColor = "#f4f4f9";
  body.style.display = "flex";
  body.style.justifyContent = "center";
  body.style.alignItems = "center";
  body.style.height = "100vh";

  // Estilos do contêiner principal
  container.style.margin = "0px 10px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.rowGap = "15px";
  container.style.backgroundColor = "#fff";
  container.style.padding = "40px";
  container.style.borderRadius = "8px";
  container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  container.style.width = "350px";

  // Estilos para o título
  h1.style.textAlign = "center";
  h1.style.fontSize = "30px";

  // Estilos dos campos de entrada
  const inputs_groups = document.querySelectorAll(".input-group");
  inputs_groups.forEach((input_group) => {
    input_group.style.display = "flex";
    input_group.style.flexDirection = "column";
    input_group.style.rowGap = "10px";
  });

  const inputs_fields = document.querySelectorAll(".input-field");
  inputs_fields.forEach((input) => {
    input.style.height = "35px";
    input.style.borderRadius = "4px";
    input.style.border = "1px solid #ccc";
    input.style.paddingLeft = "5px";
  });

  // Estilos para o botão
  submitButton.style.height = "35px";
  submitButton.style.backgroundColor = "#4caf50";
  submitButton.style.color = "white";
  submitButton.style.border = "none";
  submitButton.style.borderRadius = "4px";
  submitButton.style.cursor = "pointer";
  submitButton.style.marginTop = "5px";

  submitButton.addEventListener("mousemove", function () {
    submitButton.style.backgroundColor = "#45a049";
  });
  submitButton.addEventListener("mouseout", function () {
    submitButton.style.backgroundColor = "#4caf50";
  });

  // Estilos para o link de redirecionamento à página de login
  signUpLink.style.alignSelf = "flex-end";
  signUpLink.style.marginTop = "10px";
  signUpLink.style.cursor = "pointer";

  signUpLink.addEventListener("mouseover", function () {
    signUpLink.style.color = "blue";
  });
  signUpLink.addEventListener("mouseout", function () {
    signUpLink.style.color = "";
  });

  // Função que realiza o cadastro do usuário
  function signUpUser() {
    // Obtém os valores de username, email e senha inseridos nos campos de entrada
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    // Envia uma solicitação POST para o endpoint de registro
    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        // Se a resposta não for OK, lança um erro
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Falha não identificada");
          });
        }

        // Caso a resposta seja bem-sucedida, retorna os dados como JSON
        return response.json();
      })
      .then((data) => {
        // Limpa os campos de entrada
        usernameInput.value = "";
        emailInput.value = "";
        passwordInput = "";

        // Se o cadastro for bem-sucedido, exibe uma notificação com a mensagem de sucesso
        createMessageNotification(data.message, " #28a745");
      })
      .catch((error) => {
        // Se ocorrer um erro, exibe uma notificação com a mensagem de erro
        createMessageNotification(error.message, "#ff6347");
      });
  }

  // Função que redireciona para a página de login
  function redirectToLogin() {
    // Limpa o conteúdo da página atual
    document.querySelector("body").innerHTML = "";
    document.querySelector("body").style = "";

    // Chama a função para criar a página de login
    createLoginPage();
  }
}

export { createSignUpPage };