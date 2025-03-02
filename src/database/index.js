const RocksDB = require("@salto-io/rocksdb");
const path = require("path");

// Classe responsável por interagir com o banco de dados RocksDB
class Database {
  // Construtor responsável por criar o caminho para o banco de dados e abrir a conexão com ele
  constructor(dbName) {
    this.dbPath = path.resolve(__dirname, "../../db_data", dbName);
    this.db = null;
    this.open((error) => {
      if (error) {
        console.error("Falha na abertura do banco de dados - ", error);
      }
    });
  }

  // Método responsável por abrir a conexão com o banco de dados
  open(callback) {
    this.db = new RocksDB(this.dbPath);
    this.db.open(callback);
  }

  // Método responsável por fechar a conexão com o banco de dados
  close(callback) {
    if (this.db) {
      this.db.close(callback);
    }
  }

  // Método responsável por ler todos os dados armazenados no banco de dados
  readAllData(callback) {
    if (!this.db) {
      return callback(new Error("Banco de dados não aberto"));
    }

    const data = [];

    const iterator = this.db.iterator({});

    const loop = () => {
      iterator.next((error, key, value) => {
        if (error) {
          iterator.end(() => {
            callback(error);
          });

          return;
        }

        if (!key && !value) {
          iterator.end(() => {
            callback(null, data);
          });

          return;
        }

        data.push({ key: key.toString(), value: value.toString() });

        loop();
      });
    };

    loop();
  }

  // Método responsável por adicionar dados ao banco de dados
  put(key, value, callback) {
    if (!this.db) {
      return callback(new Error("Banco de dados não aberto"));
    }

    this.db.put(key, value, callback);
  }

  // Método responsável por recuperar dados do banco de dados
  get(key, callback) {
    if (!this.db) {
      return callback(new Error("Banco de dados não aberto"));
    }

    this.db.get(key, callback);
  }

  // Método responsável por excluir dados do banco de dados
  del(key, callback) {
    if (!this.db) {
      return callback(new Error("Banco de dados não aberto"));
    }

    this.db.del(key, callback);
  }
}

module.exports = Database;