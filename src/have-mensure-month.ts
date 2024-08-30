import sqlite3 from 'sqlite3';

export default function haveMeasureMonth(customer_code:any, measure_datetime:any, measure_type:any) {
    const date = new Date(measure_datetime);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let dbMeasureType;
    if (measure_type === "WATER") {
        dbMeasureType = "water_measure";
    } else if (measure_type === "GAS") {
        dbMeasureType = "gas_measure";
    } else {
        return Promise.reject("Erro: Tipo de medida inválido, nem água nem gás.");
    }

    const db = new sqlite3.Database('./mydb.sqlite');

    return new Promise((resolve, reject) => {
        db.get(`SELECT 1 FROM readings 
                WHERE customerID = ? 
                AND ${dbMeasureType} IS NOT NULL
                AND month = ?
                AND year = ?`, [customer_code, month, year], (err, row) => {
            if (err) {
                console.log("Erro na consulta SELECT");
                console.log(err);
                reject(false);
            } else {
                console.log('Consulta realizada');
                resolve(row ? true : false);
            }
        });

        db.close(); 
    });
}
