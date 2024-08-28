import express from 'express';
require('dotenv').config();


const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send({
    "api-key":process.env.GEMINI_API_KEY
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

