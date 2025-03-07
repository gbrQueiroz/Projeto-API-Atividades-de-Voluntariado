const config = require("./config/index.js");
const dbInstances = require("./database/dbInstances.js");
const hashPassword = require("./utils/hashPassword.js");
const crypto = require("crypto");

// Função que tem como objetivo criar o usuário administrador
async function initializeAdminAccount() {
  // Identificador exclusivo do administrador
  const adminId = crypto.randomUUID();

  // Criptografando a senha do usuário administrador
  const adminPassword = await hashPassword(config.ADMIN_PASSWORD);

  // Definição do objeto que conterá as informações do administrador
  const userAdmin = {
    id: adminId,
    username: config.ADMIN_USERNAME,
    email: config.ADMIN_EMAIL,
    password: adminPassword,
    userType: ["admin"],
    registeredActivities: [],
  };

  // Armazenando as informações do administrador no banco de dados
  dbInstances.usersDb.put(`${adminId}`, JSON.stringify(userAdmin), (error) => {
    // Caso ocorra um erro ao salvar os dados no banco de dados, será exibida uma mensagem de falha
    if (error) {
      console.error("Falha ao criar o usuário administrador");
    }

    // Em caso de sucesso na inserção, uma mensagem de sucesso será exibida
    console.log("Usuário administrador criado com êxito");
  });
}

initializeAdminAccount();