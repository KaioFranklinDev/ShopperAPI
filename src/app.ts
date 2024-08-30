import express from 'express';
import RunGemini from './process-image-upload';
import { getUsersFromDB } from './db-test';
import isBase64 from './base64-test';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.use(express.json());


app.get('/', async (req, res) => {
  try {
    const users = await getUsersFromDB();
    console.log(users)
    res.json(users); // Envia os dados como resposta em formato JSON
  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar o banco de dados" });
  }
});

app.get('/imagem/:id', (req, res) => {
  const imagePath = path.join(__dirname, `./img/${req.params.id}.jpeg`);
  
  res.sendFile(imagePath);
});

app.post('/submit', async (req, res) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body

  if(!image ||!customer_code||!measure_datetime||!measure_type){
    res.status(400).send({
      "error_code": "INVALID_DATA",
      "error_description":"verifique os dados enviados, algum nome de campo invalido"
    })
    return
  }
  if(!isBase64(image)){
    res.status(400).send({
      "error_code": "INVALID_DATA",
      "error_description":"Imagem não é base64"
    })
    return
  }

  const imgBuffer = Buffer.from(image, 'base64');
  const filePath = path.join('./src/img', `${"uuid-124"}.jpeg`);

  fs.writeFile(filePath, imgBuffer, (err) => {
    if (err) {
      console.error('Erro ao salvar a imagem:', err);
    } else {
      console.log('Imagem salva com sucesso!');
    }
  });

  try {
    const result = await RunGemini(image);
    res.send(result);
  } catch (error) {
    res.status(500).send("Erro ao processar a requisição.");
  }

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

