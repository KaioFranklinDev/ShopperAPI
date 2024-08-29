import express from 'express';
import RunGemini from './process-image-upload';

const app = express();
const port = 3000;

app.use(express.json());


app.get('/', (req, res) => {
  
  res.send("hellow world");
  
});

app.post('/submit', async (req, res) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body
  const requestTest = req.body;

  if(!image ||!customer_code||!measure_datetime||!measure_type){
    res.status(400).send({
      "error_code": "INVALID_DATA",
      "error_description":"verifique os dados enviados, algum nome de campo invalido"
    })
    return
  }

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

