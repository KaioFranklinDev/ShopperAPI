import express from 'express';
import RunGemini from './process-image-upload';
import { getUsersFromDB } from './db-test';
import isBase64 from './base64-test';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import haveMeasureMonth from './have-mensure-month';
import verifyConfirmed from './verify-confirmed';
import verifyMeasureUUID from './verify-measure-uuid';

const app = express();
const port = 3000;

app.use(express.json());


app.get('/', async (req, res) => {
  try {
    const users = await getUsersFromDB();
    console.log(users)
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar o banco de dados" });
  }
});

app.get('/imagem/:id', (req, res) => {
  const imagePath = path.join(__dirname, `./img/${req.params.id}.jpeg`);

  res.sendFile(imagePath);
});

app.post('/upload', async (req, res) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  if (!image || !customer_code || !measure_datetime || !measure_type) {
    return res.status(400).send({
      "error_code": "INVALID_DATA",
      "error_description": "Verifique os dados enviados, algum nome de campo inválido."
    });
  }

  if (!isBase64(image)) {
    return res.status(400).send({
      "error_code": "INVALID_DATA",
      "error_description": "Imagem não é base64."
    });
  }

  try {
    const measureExists = await haveMeasureMonth(customer_code, measure_datetime, measure_type);
    if (measureExists) {
      return res.status(409).send({
        "error_code": "DOUBLE_REPORT",
        "error_description": "Leitura do mês já realizada."
      });
    }

    const measure_uuid = uuidv4();
    const imgBuffer = Buffer.from(image, 'base64');
    const filePath = path.join('./src/img', `${measure_uuid}.jpeg`);

    fs.writeFile(filePath, imgBuffer, (err) => {
      if (err) {
        console.error('Erro ao salvar a imagem:', err);
      } else {
        console.log('Imagem salva com sucesso!');
      }
    });

    const GeminiResult = await RunGemini(image);
    const GeminiCorrect = GeminiResult.trim();
    console.log(GeminiResult);

    res.send({
      image_url: `http://localhost:3000/imagem/${measure_uuid}`,
      measure_value: GeminiCorrect,
      measure_uuid: measure_uuid
    });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).send("Erro ao processar a requisição.");
  }
});

app.patch('/confirm', async (req,res) => {
  const { measure_uuid, confirmed_value } = req.body;
  if (!measure_uuid || !confirmed_value ) {
    return res.status(400).send({
      "error_code": "INVALID_DATA",
      "error_description": "Verifique os dados enviados, algum nome de campo inválido."
    });
  }

  try{
    const verifiedMeasuaUUID = await verifyMeasureUUID(measure_uuid)
    if(!verifiedMeasuaUUID){
      return res.status(404).send({
        "error_code": "MEASURE_NOT_FOUND",
        "error_description": "Não encontado uuid, verifique-o"
      }); 
    }
  } catch(error){
    res.status(401).json({"erro":"algo errado na tentativa confirmação"})
  }
  
  try{
    const hasConfirmed = await verifyConfirmed(measure_uuid)
    console.log(hasConfirmed)
    if(hasConfirmed){
      return res.status(409).send({
        "error_code": "CONFIRMATION_DUPLICATE",
        "error_description": "Leitura do mês já realizada"        
      }); 
    }  
  } catch(error){
    res.status(401).json({"fail":"algoerrado aq"})
  }
  
  return res.status(200).send({
    "success":true        
  });
  
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

