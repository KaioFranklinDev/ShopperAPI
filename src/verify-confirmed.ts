import sqlite3 from 'sqlite3';

export default async function verifyConfirmed(measure_uuid: any): Promise<boolean> {
    const db = new sqlite3.Database('./mydb.sqlite');
    console.log("aquiiiiiiiiiiiiiii")
    const aaa = db.get(
        `SELECT water_confirmed FROM readings 
        WHERE water_measure_uuid = ?`,
        [measure_uuid],
        (err,row:any) => {
            if (err) {
                console.log("Erro na consulta SELECT");
                console.log(err);
            
            } 
            if(row) {
                console.log('Consulta realizada');
                console.log(row);
            }
        }
    );
    db.close();
    return new Promise( (resolve, reject) => {
        db.get(
            `SELECT water_confirmed FROM readings 
            WHERE water_measure_uuid = ?`,
            [measure_uuid],
            (err:any, row:any) => {
                if (err) {
                    console.log("Erro na consulta SELECT");
                    console.log(err);
                    reject(false);
                } else {
                    console.log('Consulta realizada');
                    resolve(row && row.water_confirmed === 1);
                }
            }
        );
        db.close();
    });
}
