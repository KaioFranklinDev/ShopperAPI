import sqlite3 from 'sqlite3';
export default async function verifyMeasureUUID(measure_uuid:any){
    
    const db = new sqlite3.Database('./mydb.sqlite');
    let response = new Promise<boolean>((resolve, reject) => {
        db.get(
            `SELECT 1 FROM readings 
             WHERE water_measure_uuid = ? 
             OR gas_measure_uuid = ?`,
            [measure_uuid, measure_uuid],
            (err, row) => {
                if (err) {
                    console.log("Erro na consulta SELECT");
                    console.log(err);
                    reject(false);
                } else {
                    console.log('Consulta realizada: não existe uuid');
                    resolve(row ? true : false)
                }
            }
        );
    });
    console.log(measure_uuid)
    db.close();
    return true;
}

