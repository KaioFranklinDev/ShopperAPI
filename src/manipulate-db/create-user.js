const sqlite3 = require('sqlite3').verbose(); // Importa o pacote sqlite3

function insertGasReading(customerID, month, year, gas_measure, gas_image64, gas_measure_uuid) {

  const db = new sqlite3.Database('./mydb.sqlite', (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err.message);
      return;
    }
    console.log('Conectado ao banco de dados.');
  });


  db.serialize(() => {
    db.run(`
        INSERT INTO customers (customerID)
        VALUES (?)
      `, [customerID], function(err) {
        if (err) {
          console.error('Erro criar user:', err.message);
        } else {
          console.log('Cliente inserido!:', this.lastID);
        }
      });

    db.run(`
      INSERT INTO readings (customerID, month, year, gas_measure, gas_image64, gas_measure_uuid)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [customerID, month, year, gas_measure, gas_image64, gas_measure_uuid], function(err) {
      if (err) {
        console.error('Erro ao inserir a leitura de gás:', err.message);
      } else {
        console.log('Leitura de gás inserida com sucesso. ID da leitura:', this.lastID);
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
}


const customerID = 'laraBTRZ';
const month = 8;
const year = 2024;
const gas_measure = 150;
const gas_image64 = 'data:image/png;base64,...'; 
const gas_measure_uuid = 'example-uuid123123';

insertGasReading(customerID, month, year, gas_measure, gas_image64, gas_measure_uuid);
