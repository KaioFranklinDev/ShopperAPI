import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./mydb.sqlite');

db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `, (err) => {
      if (err) {
        console.error("Erro ao criar a tabela 'users':", err);
      } else {
        console.log("Tabela 'users' criada ou já existente.");
      }
    });
});
//db.run("INSERT INTO users (name, email) VALUES ('kaio','kaio@gmail.com' )")
export function getUsersFromDB(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users";

    db.all(query, (err, rows) => {
      if (err) {
        console.error("Erro ao consultar o banco de dados:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
