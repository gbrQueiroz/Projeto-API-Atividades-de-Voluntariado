const dbInstances = require("../database/dbInstances.js");
const isRegistrationTimeValid = require("../utils/isRegistrationTimeValid.js");
const hasMaxRegistrationReached = require("../utils/hasMaxRegistrationReached.js");
const checkActivityExists = require("../utils/checkActivityExists.js");
const crypto = require("crypto");

// Responsável por listar todas as atividades nas quais o usuário está cadastrado
const userActivities = (req, res) => {
  // Obtém o ID do usuário autenticado a partir do objeto da requisição
  const userId = req.user.id;

  // Busca os dados do usuário no banco de dados
  dbInstances.usersDb.get(`${userId}`, (error, value) => {
    // Se ocorrer um erro na consulta do usuário, retorna um erro 404
    if (error) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Caso o usuário seja encontrado, converte os dados para o formato de um objeto
    const userData = JSON.parse(value.toString("utf8"));

    // Obtém as chaves das atividades nas quais o usuário está inscrito
    const userRegisteredActivitiesKeys = userData.registeredActivities;

    // Busca todas as atividades no banco de dados
    dbInstances.activitiesDb.readAllData((error, data) => {
      // Se ocorrer um erro ao buscar as atividades, retorna um erro 500
      if (error) {
        return res.status(500).json({ error: "Falha ao buscar as atividades" });
      }

      // Variável responsável por armazenar as informações das atividades nas quais o usuário está inscrito
      const userRegisteredActivities = [];

      // Para cada atividade do banco de dados, verifica se o usuário está inscrito nela
      data.forEach((activity) => {
        // Se a chave da atividade estiver nas atividades inscritas do usuário, adiciona os dados da atividade na variável "userRegisteredActivities"
        if (userRegisteredActivitiesKeys.includes(activity.key)) {
          userRegisteredActivities.push(JSON.parse(activity.value));
        }
      });

      // Retorna as atividades inscritas do usuário
      res.status(200).json(userRegisteredActivities);
    });
  });
};

// Responsável por listar todas as atividades nas quais estão disponiveis para o usuário
const availableActivities = (req, res) => {
  // Obtém o ID do usuário autenticado a partir do objeto de requisição
  const userId = req.user.id;

  // Busca os dados do usuário no banco de dados
  dbInstances.usersDb.get(`${userId}`, (error, value) => {
    // Se ocorrer um erro na consulta do usuário, retorna um erro 404
    if (error) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Caso o usuário seja encontrado, converte os dados para o formato de objeto JavaScript
    const userData = JSON.parse(value.toString("utf8"));

    // Obtém as chaves das atividades nas quais o usuário está inscrito
    const userRegisteredActivitiesKeys = userData.registeredActivities;

    // Busca todas as atividades no banco de dados
    dbInstances.activitiesDb.readAllData((error, data) => {
      // Se ocorrer um erro ao buscar as atividades, retorna um erro 500
      if (error) {
        return res.status(500).json({ error: "Falha ao buscar as atividades" });
      }

      // Variável responsável por armazenar as atividades disponíveis para o usuário
      const userAvailableActivities = [];

      // Percorre todas as atividades para verificar quais estão disponíveis para o usuário
      for (let i = 0; i < data.length; i++) {
        // Obtém a atividade e converte o valor da atividade para um objeto JavaScript
        const activity = data[i];
        const activityData = JSON.parse(activity.value);

        // Se a chave da atividade já está nas atividades registradas pelo usuário, pula para a próxima atividade
        if (userRegisteredActivitiesKeys.includes(activity.key)) {
          continue;
        }

        // Verifica se o período de inscrições para a atividade já passou. Se sim, pula esta atividade
        if (!isRegistrationTimeValid(activityData)) {
          continue;
        }

        // Verifica se o número máximo de inscrições foi atingido. Se sim, pula esta atividade
        if (hasMaxRegistrationReached(activityData)) {
          continue;
        }

        // Se a atividade ainda for válida para inscrição, adiciona a atividade na lista de atividades disponíveis para o usuário
        userAvailableActivities.push(activityData);
      }

      // Retorna as atividades nas quais estão disponíveis para o usuário
      res.status(200).json(userAvailableActivities);
    });
  });
};

// Responsável pelo cadastro de um usuário em uma atividade
const signUpForActivity = (req, res) => {
  // Obtém o ID do usuário com base na requisição recebida
  const userId = req.user.id;

  // Obtém o ID da atividade a partir do corpo da solicitação
  const activityId = req.body.activityId;

  // Recupera todas as atividades do banco de dados
  dbInstances.activitiesDb.readAllData((error, data) => {
    // Caso ocorra um erro ao acessar o banco de dados de atividades, retorna um erro 500
    if (error) {
      return res
        .status(500)
        .json({ error: "Falha ao recuperar as atividades do banco de dados" });
    }

    // Inicialização da variável que irá conter os dados da atividade encontrada
    let activityData = undefined;

    // Itera sobre todas as atividades recuperadas do banco de dados
    for (let i = 0; i < data.length; i++) {
      // Atividade específica
      const activity = data[i];

      // Converte a string armazenada para o formato de um objeto JavaScript
      const dataActivity = JSON.parse(activity.value);

      // Verifica se a atividade atual corresponde ao ID solicitado. Caso afirmativo, armazena os dados da atividade e interrompe a iteração
      if (dataActivity.id === activityId) {
        activityData = dataActivity;

        break;
      }
    }

    // Caso a atividade solicitada não seja encontrada, é retornado um erro 404
    if (activityData === undefined) {
      return res.status(404).json({ error: "Atividade não encontrada" });
    }

    // Verifica se o período de inscrição para a atividade já se encerrou. Se sim, retorna um erro 404
    if (!isRegistrationTimeValid(activityData)) {
      return res
        .status(404)
        .json({ error: "Período de inscrições finalizado" });
    }

    // Verifica se o usuário já está inscrito na atividade. Caso afirmativo, retorna um erro 409
    if (activityData.subscribers.includes(userId)) {
      return res
        .status(409)
        .json({ error: "O usuário já se encontra inscrito na atividade" });
    }

    // Verifica se o número máximo de participantes foi atingido. Caso afirmativo, retorna um erro 409
    if (hasMaxRegistrationReached(activityData)) {
      return res
        .status(409)
        .json({ error: "Limite máximo de participantes atingido" });
    }

    // Recupera os dados do usuário no banco de dados
    dbInstances.usersDb.get(`${userId}`, (error, value) => {
      // Caso haja um erro ao acessar os dados do usuário, é retornado um erro 404
      if (error) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Armazenamento dos dados do usuário no formato de objeto JavaScript
      const userData = JSON.parse(value.toString("utf8"));

      // Obtém as atividades nas quais o usuário está inscrito
      const userRegisteredActivities = userData.registeredActivities;

      // Itera sobre a lista de atividades armazenadas no banco de dados
      for (let j = 0; j < data.length; j++) {
        // Atividade específica
        const activity = data[j];

        // Caso o usuário não esteja inscrito nesta atividade, passa para a próxima
        if (!userRegisteredActivities.includes(activity.key)) {
          continue;
        }

        // Converte os dados da atividade na qual o usuário está inscrito
        const dataActivity = JSON.parse(activity.value);

        // Obtém o timestamp da atividade
        const activityTimestamp = new Date(dataActivity.date).getTime();

        // Obtém o timestamp da atividade na qual deseja se inscrever
        const newActivityDate = new Date(activityData.date).getTime();

        // Verifica se o horário da nova atividade é o mesmo de uma atividade em que o usuário já está inscrito. Caso afirmativo, retorna um erro 409
        if (activityTimestamp === newActivityDate) {
          return res.status(409).json({
            error: "Você já está inscrito em outra atividade no mesmo horário",
          });
        }
      }

      // Adiciona o ID da nova atividade à lista de atividades registradas do usuário
      userRegisteredActivities.push(activityId);

      // Cria um novo objeto com os dados atualizados do usuário
      const newData = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        userType: userData.userType,
        registeredActivities: userRegisteredActivities,
      };

      // Atualiza os dados do usuário no banco de dados
      dbInstances.usersDb.put(`${userId}`, JSON.stringify(newData), (error) => {
        // Caso haja um erro ao atualizar os dados do usuário, é retornado um erro 500
        if (error) {
          return res
            .status(500)
            .json({ error: "Falha ao atualizar os dados do usuário" });
        }

        // Obtém a lista de participantes registrados na atividade
        const subscribers = activityData.subscribers;

        // Inclui o usuário na lista de inscritos na atividade
        subscribers.push(userId);

        // Cria um novo objeto com os dados atualizados da atividade
        const newActivityData = {
          id: activityData.id,
          title: activityData.title,
          description: activityData.description,
          date: new Date(activityData.date),
          address: activityData.address,
          maxQuantitySubscribers: activityData.maxQuantitySubscribers,
          subscribers: subscribers,
        };

        // Atualiza os dados da atividade no banco de dados
        dbInstances.activitiesDb.put(
          `${activityId}`,
          JSON.stringify(newActivityData),
          (error) => {
            // Se ocorrer um erro ao salvar os dados da atividade, será retornado um erro 500
            if (error) {
              return res
                .status(500)
                .json({ error: "Erro ao tentar se inscrever na atividade" });
            }

            // Retorna sucesso ao inscrever o usuário na atividade
            res.status(200).json({
              success: true,
              message: "Inscrição realizada com sucesso",
            });
          }
        );
      });
    });
  });
};

// Responsável por cancelar a inscrição de um usuário em uma atividade
const cancelRegistration = (req, res) => {
  // Obtém os dados de ID do usuário e da atividade a partir do objeto de requisição
  const userId = req.user.id;
  const activityId = req.body.activityId;

  // Recupera os dados da atividade no banco de dados
  dbInstances.activitiesDb.get(`${activityId}`, (error, value) => {
    // Caso haja erro ao buscar a atividade, retorna um erro 404
    if (error) {
      return res.status(404).json({ error: "Atividade não encontrada" });
    }

    // Converte os dados da atividade para um objeto JavaScript
    const activityData = JSON.parse(value.toString("utf8"));

    // Obtém a lista de participantes inscritos na atividade
    const subscribers = activityData.subscribers;

    // Encontra o índice do usuário na lista de inscritos
    const index = subscribers.findIndex((subscriber) => {
      if (subscriber === userId) {
        return true;
      }
    });

    // Se o usuário não for encontrado na lista de inscritos da atividade, retorna um erro 404
    if (index === -1) {
      return res.status(404).json({
        error: "Usuário não encontrado na lista de inscritos da atividade",
      });
    }

    // Verifica se o período de inscrição já passou. Se sim, retorna um erro 404
    if (!isRegistrationTimeValid(activityData)) {
      return res.status(404).json({ error: "Atividade já encerrada" });
    }

    // Remove o usuário da lista de inscritos
    subscribers.splice(index, 1);

    // Cria um novo objeto com os dados atualizados da atividade
    const newActivityData = {
      id: activityData.id,
      title: activityData.title,
      description: activityData.description,
      date: new Date(activityData.date),
      address: activityData.address,
      maxQuantitySubscribers: activityData.maxQuantitySubscribers,
      subscribers: subscribers,
    };

    // Atualiza as informações da atividade no banco de dados
    dbInstances.activitiesDb.put(
      `${activityId}`,
      JSON.stringify(newActivityData),
      (error) => {
        // Caso haja erro ao salvar a atividade, retorna um erro 500
        if (error) {
          return res.status(500).json({
            error: "Erro ao atualizar a lista de inscritos da atividade",
          });
        }

        // Recupera os dados do usuário no banco de dados
        dbInstances.usersDb.get(`${userId}`, (error, value) => {
          // Caso haja erro ao buscar os dados do usuário, retorna um erro 404
          if (error) {
            return res.status(404).json({ error: "Usuário não encontrado" });
          }

          // Converte os dados do usuário para um objeto JavaScript, e obtém a lista de atividades em que o usuário está inscrito
          const userData = JSON.parse(value.toString("utf8"));
          const userRegisteredActivities = userData.registeredActivities;

          // Encontra o índice da atividade na lista de atividades registradas do usuário
          const activityIndex = userRegisteredActivities.findIndex(
            (activity) => {
              if (activity === activityId) {
                return true;
              }
            }
          );

          // Se a atividade não for encontrada na lista de inscrições do usuário, retorna um erro 404
          if (activityIndex === -1) {
            return res.status(404).json({
              error:
                "Atividade não encontrada na lista de atividades inscritas do usuário",
            });
          }

          // Remove a atividade da lista de atividades inscritas do usuário
          userRegisteredActivities.splice(activityIndex, 1);

          // Cria um novo objeto com os dados atualizados do usuário
          const newData = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            userType: userData.userType,
            registeredActivities: userRegisteredActivities,
          };

          // Atualiza as informações do usuário no banco de dados
          dbInstances.usersDb.put(
            `${userId}`,
            JSON.stringify(newData),
            (error) => {
              // Caso haja erro ao salvar os dados do usuário, retorna um erro 500
              if (error) {
                return res.status(500).json({
                  error: "Erro ao atualizar a lista de inscrições do usuário",
                });
              }

              // Retorna uma mensagem de sucesso após o cancelamento da inscrição
              res.status(200).json({
                success: true,
                message: "Cancelamento de inscrição realizado com sucesso",
              });
            }
          );
        });
      }
    );
  });
};

// Responsável por criar uma atividade
const createActivity = (req, res) => {
  // Extração dos dados da nova atividade do objeto da requisição
  const title = req.body.title;
  const description = req.body.description;
  const date = req.body.date;
  const time = req.body.time;
  const address = req.body.address;
  const maxQuantitySubscribers = req.body.maxQuantitySubscribers;

  // Verifica se os campos estão preenchidos; caso contrário, retorna um erro 400
  if (
    !title &&
    !description &&
    !date &&
    !time &&
    !address &&
    !maxQuantitySubscribers
  ) {
    return res
      .status(400)
      .json({ error: "Necessário preencher todos os campos" });
  }

  // Verifica se o título fornecido está no padrão desejado; caso negativo, retorna um erro 400
  if (typeof title !== "string" || title.length === 0) {
    return res
      .status(400)
      .json({ error: "O título deve ser uma string não vazia" });
  }

  // Verifica se a descrição fornecida está no padrão desejado; caso negativo, retorna um erro 400
  if (typeof description !== "string" || description.length === 0) {
    return res
      .status(400)
      .json({ error: "A descrição deve ser uma string não vazia" });
  }

  // Verifica se a data fornecida está no padrão desejado; caso negativo, retorna um erro 400
  if (typeof date !== "string" || date.length === 0) {
    return res.status(400).json({ error: "Uma data deve ser fornecida" });
  }

  // Verifica se o horário fornecido está no padrão desejado; caso negativo, retorna um erro 400
  if (typeof time !== "string" || time.length === 0) {
    return res.status(400).json({ error: "Um horário deve ser fornecido" });
  }

  // Verifica se o endereço fornecido está no padrão desejado; caso negativo, retorna um erro 400
  if (typeof address !== "string" || address.length === 0) {
    return res
      .status(400)
      .json({ error: "O endereço deve ser uma string não vazia" });
  }

  // Verifica se o número máximo de participantes fornecido está no padrão desejado; caso negativo, retorna um erro 400
  if (
    !Number.isInteger(Number(maxQuantitySubscribers)) ||
    Number(maxQuantitySubscribers) <= 0
  ) {
    return res.status(400).json({
      error:
        "É necessário escolher uma quantidade máxima de participantes que seja um número inteiro e positivo",
    });
  }

  // Lê todas as atividades já existentes no banco de dados
  dbInstances.activitiesDb.readAllData((error, data) => {
    // Caso haja erro ao buscar as atividades, retorna um erro 500
    if (error) {
      return res
        .status(500)
        .json({ error: "Falha ao buscar atividades no banco de dados" });
    }

    // Converte a data fornecida para um objeto Date, divide o horário em hora e minuto e ajusta o objeto Date de acordo com o horário
    const newActivityDate = new Date(date);
    const schedule = time.split(":");
    newActivityDate.setHours(Number(schedule[0]) + 3, schedule[1]);

    // Verifica a validade da data informada; em caso negativo, retorna um erro 400
    if (new Date().getTime() >= newActivityDate.getTime()) {
      return res.status(400).json({
        error: "A data informada deve ser posterior à data atual",
      });
    }

    // Itera sobre a lista de atividades
    for (let i = 0; i < data.length; i++) {
      // Atividade específica
      const activity = data[i];

      // Converte os dados da atividade para um objeto JavaScript
      const activityData = JSON.parse(activity.value);

      // Verifica se a atividade já existe; caso positivo, retorna um erro 409 (Conflict)
      if (checkActivityExists(activityData, title, newActivityDate, address)) {
        return res.status(409).json({ error: "A atividade já existe" });
      }
    }

    // Gera um novo ID único para a atividade
    const newActivityId = crypto.randomUUID();

    // Cria um objeto com as informações recebidas
    const newActivity = {
      id: newActivityId,
      title: title,
      description: description,
      date: newActivityDate,
      address: address,
      maxQuantitySubscribers: maxQuantitySubscribers,
      subscribers: [],
    };

    // Salva a nova atividade no banco de dados
    dbInstances.activitiesDb.put(
      `${newActivityId}`,
      JSON.stringify(newActivity),
      (error) => {
        // Caso haja erro ao salvar a nova atividade, retorna um erro 500
        if (error) {
          return res.status(500).json({ error: "Falha ao criar a atividade" });
        }

        // Se a atividade for criada com sucesso, retorna uma resposta de sucesso
        res
          .status(201)
          .json({ success: true, message: "Atividade criada com sucesso" });
      }
    );
  });
};

// Responsável por atualizar uma atividade
const updateActivity = (req, res) => {
  // Extração dos dados do objeto da requisição necessários para atualizar a atividade
  const activityId = req.body.activityId;
  const title = req.body.title;
  const description = req.body.description;
  const date = req.body.date;
  const time = req.body.time;
  const address = req.body.address;
  const maxQuantitySubscribers = req.body.maxQuantitySubscribers;

  // Verifica se os campos estão preenchidos; caso contrário, retorna um erro 400
  if (
    !title &&
    !description &&
    !date &&
    !time &&
    !address &&
    !maxQuantitySubscribers
  ) {
    return res
      .status(400)
      .json({ error: "Necessário preencher todos os campos" });
  }

  // Verifica se o título fornecido está no padrão desejado; caso negativo, retorna um erro 400
  if (typeof title !== "string" || title.length === 0) {
    return res
      .status(400)
      .json({ error: "O título deve ser uma string não vazia" });
  }

  // Verifica se a descrição fornecida está no padrão desejado; caso negativo, retorna um erro 400
  if (typeof description !== "string" || description.length === 0) {
    return res
      .status(400)
      .json({ error: "A descrição deve ser uma string não vazia" });
  }

  // Verifica se a data fornecida está no padrão desejado; caso negativo, retorna um erro 400
  if (typeof date !== "string" || date.length === 0) {
    return res.status(400).json({ error: "Uma data deve ser fornecida" });
  }

  // Verifica se o horário fornecido está no padrão desejado; caso negativo, retorna um erro 400
  if (typeof time !== "string" || time.length === 0) {
    return res.status(400).json({ error: "Um horário deve ser fornecido" });
  }

  // Verifica se o endereço fornecido está no padrão desejido; caso negativo, retorna um erro 400
  if (typeof address !== "string" || address.length === 0) {
    return res
      .status(400)
      .json({ error: "O endereço deve ser uma string não vazia" });
  }

  // Verifica se o número máximo de participantes fornecido está no padrão desejado; caso negativo, retorna um erro 400
  if (
    !Number.isInteger(Number(maxQuantitySubscribers)) ||
    Number(maxQuantitySubscribers) <= 0
  ) {
    return res.status(400).json({
      error:
        "É necessário escolher uma quantidade máxima de participantes que seja um número inteiro e positivo",
    });
  }

  // Busca a atividade no banco de dados
  dbInstances.activitiesDb.get(`${activityId}`, (error, value) => {
    // Se ocorrer erro ao buscar a atividade, retorna um erro 404
    if (error) {
      return res.status(404).json({ error: `Atividade não encontrada` });
    }

    // Converte os dados da atividade existente para um objeto JavaScript
    const activityData = JSON.parse(value.toString("utf8"));

    // Verifica se a atividade já foi finalizada; caso positivo, retorna um erro 404
    if (!isRegistrationTimeValid(activityData)) {
      return res.status(404).json({ error: "Atividade já finalizada" });
    }

    // Converte a nova data para um objeto Date e ajusta a hora conforme o horário fornecido
    const newActivityDate = new Date(date);
    const schedule = time.split(":");
    newActivityDate.setHours(Number(schedule[0]) + 3, schedule[1]);

    // Verifica a validade da data informada; se inválida, retorna um erro 400
    if (new Date().getTime() >= newActivityDate.getTime()) {
      return res.status(400).json({
        error: "A data informada deve ser posterior à data atual",
      });
    }

    // Cria um novo objeto de atividade com os dados atualizados
    const newActivityData = {
      id: activityId,
      title: title,
      description: description,
      date: newActivityDate,
      address: address,
      maxQuantitySubscribers: maxQuantitySubscribers,
      subscribers: activityData.subscribers,
    };

    // Atualiza a atividade no banco de dados com os novos dados
    dbInstances.activitiesDb.put(
      `${activityId}`,
      JSON.stringify(newActivityData),
      (error) => {
        // Se ocorrer erro ao salvar a atividade, retorna um erro 500
        if (error) {
          return res
            .status(500)
            .json({ error: "Falha ao atualizar a atividade" });
        }

        // Se a atualização for bem-sucedida, retorna uma resposta de sucesso
        res
          .status(200)
          .json({ success: true, message: "Atividade atualizada com sucesso" });
      }
    );
  });
};

// Responsável por deletar uma atividade
const deleteActivity = (req, res) => {
  // Extração do ID da atividade a ser deletada do corpo da requisição
  const activityId = req.body.activityId;

  // Busca a atividade no banco de dados
  dbInstances.activitiesDb.get(`${activityId}`, (error, value) => {
    // Se a atividade não for encontrada, retorna um erro 404
    if (error) {
      return res.status(404).json({ error: "Atividade não encontrada" });
    }

    // Converte os dados da atividade para um objeto JavaScript
    const activityData = JSON.parse(value.toString("utf8"));

    // Verifica se a atividade já foi finalizada; caso positivo, retorna um erro 404
    if (!isRegistrationTimeValid(activityData)) {
      return res.status(404).json({ error: "Atividade já finalizada" });
    }

    // Deleta a atividade do banco de dados
    dbInstances.activitiesDb.del(`${activityId}`, (error) => {
      // Se ocorrer erro ao deletar a atividade, retorna um erro 500
      if (error) {
        return res.status(500).json({ error: "Falha ao excluir a atividade" });
      }

      // Busca todos os usuários registrados para remover a atividade das suas listas de atividades inscritas
      dbInstances.usersDb.readAllData((error, data) => {
        // Se ocorrer erro ao buscar os usuários, retorna um erro 500
        if (error) {
          return res.status(500).json({ error: "Falha ao listar os usuários" });
        }

        // Itera sobre todos os usuários
        for (let i = 0; i < data.length; i++) {
          const user = data[i];
          const userData = JSON.parse(user.value);
          const userRegisteredActivities = userData.registeredActivities;

          // Verifica se o usuário está registrado na atividade
          const index = userRegisteredActivities.findIndex((activity) => {
            if (activity === activityId) {
              return true;
            }
          });

          // Se o usuário não estiver registrado na atividade, continua para o próximo usuário
          if (index === -1) {
            continue;
          }

          // Remove a atividade da lista de atividades registradas do usuário
          userRegisteredActivities.splice(index, 1);

          // Cria um novo objeto com os dados atualizados do usuário
          const newUserData = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            userType: userData.userType,
            registeredActivities: userRegisteredActivities,
          };

          // Atualiza os dados do usuário no banco de dados
          dbInstances.usersDb.put(
            `${userData.id}`,
            JSON.stringify(newUserData),
            (error) => {
              // Se ocorrer erro ao atualizar os dados do usuário, retorna um erro 500
              if (error) {
                return res.status(500).json({
                  error:
                    "Falha ao excluir a atividade na lista de atividades inscritas de cada usuário",
                });
              }
            }
          );
        }

        // Se tudo correr bem, retorna uma resposta de sucesso
        res
          .status(200)
          .json({ success: true, message: "Atividade excluída com sucesso" });
      });
    });
  });
};

// Responsável por listar todas as atividades
const allActivities = (req, res) => {
  // Recupera todos os dados dos usuários do banco de dados
  dbInstances.usersDb.readAllData((error, data) => {
    // Se ocorrer erro ao buscar os usuários, retorna um erro 500
    if (error) {
      return res.status(500).json({ error: "Falha ao listar os usuários" });
    }

    // Armazena os dados dos usuários recuperados
    const usersData = data;

    // Recupera todos os dados das atividades do banco de dados
    dbInstances.activitiesDb.readAllData((error, data) => {
      // Se ocorrer erro ao buscar as atividades, retorna um erro 500
      if (error) {
        return res.status(500).json({ error: "Erro ao listar as atividades" });
      }

      // Inicialização de um array para armazenar todas as atividades
      const listAllActivities = [];

      // Itera sobre todas as atividades recuperadas
      for (let i = 0; i < data.length; i++) {
        // Atividade individual
        const activity = data[i];

        // Converte a atividade para um objeto JavaScript
        const activityData = JSON.parse(activity.value);

        // Obtém a lista de inscritos na atividade
        const activitySubscribers = activityData.subscribers;

        // Inicialização de um array para armazenar os nomes dos usuários por atividade
        const listAllUsersPerActivity = [];

        // Itera sobre todos os usuários
        for (let j = 0; j < usersData.length; j++) {
          // Usuário individual
          const user = usersData[j];

          // Converte os dados do usuário para um objeto JavaScript
          const userData = JSON.parse(user.value);

          // Verifica se o usuário está inscrito na atividade; caso positivo, adiciona o nome do usuário à lista de inscritos da atividade
          if (activitySubscribers.includes(userData.id)) {
            listAllUsersPerActivity.push(userData.username);
          }
        }

        // Cria um novo objeto com os dados da atividade e os nomes dos inscritos
        const newActivityData = {
          id: activityData.id,
          title: activityData.title,
          description: activityData.description,
          date: new Date(activityData.date),
          address: activityData.address,
          maxQuantitySubscribers: activityData.maxQuantitySubscribers,
          subscribers: listAllUsersPerActivity,
        };

        // Adiciona a atividade com os dados formatados ao array de todas as atividades
        listAllActivities.push(newActivityData);
      }

      // Retorna a lista de todas as atividades
      res.status(200).json(listAllActivities);
    });
  });
};

module.exports = {
  userActivities,
  availableActivities,
  signUpForActivity,
  cancelRegistration,
  createActivity,
  updateActivity,
  deleteActivity,
  allActivities,
};