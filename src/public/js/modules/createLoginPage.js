import { createSignUpPage } from "./createSignUpPage.js";
import { createNormalUserPage } from "./createNormalUserPage.js";
import { createAdminUserPage } from "./createAdminPage.js";
import { createMessageNotification } from "./createModalMessage.js";

// Função encarregada da criação da página de login
function createLoginPage() {
  // Acessando o elemento body no DOM
  const body = document.querySelector("body");

  // Desenvolvendo o contêiner principal
  const container = document.createElement("div");
  body.appendChild(container);

  // Definindo o título
  const h1 = document.createElement("h1");
  h1.textContent = "Login";
  container.appendChild(h1);

  // Criando o campo de entrada para o e-mail
  const emailInput = document.createElement("input");
  emailInput.className = "input-field";
  emailInput.placeholder = "E-mail";
  emailInput.required = true;
  container.appendChild(emailInput);

  // Criando o campo de entrada para a senha
  const passwordInput = document.createElement("input");
  passwordInput.className = "input-field";
  passwordInput.type = "password";
  passwordInput.placeholder = "Senha";
  passwordInput.required = true;
  container.appendChild(passwordInput);

  // Criando o botão para login
  const loginButton = document.createElement("button");
  loginButton.textContent = "Entrar";
  container.appendChild(loginButton);
  loginButton.addEventListener("click", loginUser);

  // Criando o link de direcionamento para o cadastro
  const signUpLink = document.createElement("div");
  signUpLink.textContent = "Cadastre-se";
  container.appendChild(signUpLink);
  signUpLink.addEventListener("click", redirectToSignupPage);

  // Estilos globais
  body.style.margin = "0";
  body.style.fontFamily = "Arial, sans-serif";
  body.style.backgroundColor = "#f4f4f9";
  body.style.display = "flex";
  body.style.justifyContent = "center";
  body.style.alignItems = "center";
  body.style.height = "100vh";

  // Estilos do contêiner
  container.style.margin = "0px 10px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.rowGap = "10px";
  container.style.backgroundColor = "#fff";
  container.style.padding = "20px";
  container.style.borderRadius = "8px";
  container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  container.style.width = "350px";

  // Estilos para o título
  h1.style.textAlign = "center";
  h1.style.marginBottom = "5px";

  // Estilos dos campos de entrada
  const inputs = document.querySelectorAll(".input-field");
  inputs.forEach((input) => {
    input.style.height = "35px";
    input.style.borderRadius = "4px";
    input.style.border = "1px solid #ccc";
    input.style.paddingLeft = "5px";
  });

  // Estilos do botão
  loginButton.style.height = "35px";
  loginButton.style.backgroundColor = "#4caf50";
  loginButton.style.color = "white";
  loginButton.style.border = "none";
  loginButton.style.borderRadius = "4px";
  loginButton.style.cursor = "pointer";
  loginButton.style.marginTop = "5px";

  loginButton.addEventListener("mouseover", function () {
    loginButton.style.backgroundColor = "#45a049";
  });
  loginButton.addEventListener("mouseout", function () {
    loginButton.style.backgroundColor = "#4caf50";
  });

  // Estilos do link para a página de cadastro
  signUpLink.style.alignSelf = "flex-end";
  signUpLink.style.marginTop = "10px";
  signUpLink.style.cursor = "pointer";

  signUpLink.addEventListener("mouseover", function () {
    signUpLink.style.color = "blue";
  });
  signUpLink.addEventListener("mouseout", function () {
    signUpLink.style.color = "";
  });

  // Função responsável por realizar o login do usuário
  function loginUser() {
    // Obtém o valor do email e da senha inseridos nos campos de entrada
    const email = emailInput.value;
    const password = passwordInput.value;

    // Envia uma solicitação POST para o endpoint de login
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
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
        // Verifica o tipo de usuário retornado para redirecionar para a página adequada
        if (data.userType === "user") {
          // Limpa o conteúdo da página atual
          document.querySelector("body").innerHTML = "";
          document.querySelector("body").style = "";

          // Chama a função para criar a página do usuário normal
          createNormalUserPage();
        } else {
          // Limpa o conteúdo da página atual
          document.querySelector("body").innerHTML = "";
          document.querySelector("body").style = "";

          // Chama a função para criar a página do administrador
          createAdminUserPage();
        }
      })
      .catch((error) => {
        // Se ocorrer um erro, exibe uma notificação com a mensagem de erro
        createMessageNotification(error.message, "#ff6347");
      });
  }

  // Função responsável por realizar o redirecionamento para a página de cadastro
  function redirectToSignupPage() {
    // Limpa o conteúdo da página atual
    document.querySelector("body").innerHTML = "";
    document.querySelector("body").style = "";

    // Chama a função para criar a página de cadastro
    createSignUpPage();
  }
}

export { createLoginPage };