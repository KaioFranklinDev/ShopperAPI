const sqlite3 = require('sqlite3').verbose(); // Importa o pacote sqlite3

// Conecta ao banco de dados (substitua 'database.db' pelo caminho para seu banco de dados)
const db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados.');
  }
});

// Usar db.serialize para garantir que as operações sejam executadas em ordem
db.serialize(() => {
    // Cria a tabela 'customers' se não existir
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        customerID TEXT PRIMARY KEY
      )
    `, (err) => {
      if (err) {
        console.error("Erro ao criar a tabela 'customers':", err.message);
      } else {
        console.log("Tabela 'customers' criada com sucesso.");
      }
    });
  
    // Cria a tabela 'readings' se não existir
    db.run(`
      CREATE TABLE IF NOT EXISTS readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerID TEXT NOT NULL,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        water_measure INTEGER,
        water_image64 TEXT,
        water_measure_uuid TEXT,
        gas_measure INTEGER,
        gas_image64 TEXT,
        gas_measure_uuid TEXT,
        FOREIGN KEY (customerID) REFERENCES customers(customerID),
        UNIQUE (customerID, month, year)
      )
    `, (err) => {
      if (err) {
        console.error("Erro ao criar a tabela 'readings':", err.message);
      } else {
        console.log("Tabela 'readings' criada com sucesso.");
      }
    });
  });

// Fecha a conexão com o banco de dados
db.close((err) => {
  if (err) {
    console.error('Erro ao fechar a conexão com o banco de dados:', err.message);
  } else {
    console.log('Conexão com o banco de dados fechada.');
  }
});
