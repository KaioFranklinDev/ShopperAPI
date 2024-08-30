import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./mydb.sqlite');

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
