import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY não está definida no arquivo .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


async function RunGemini(image:any) {

  function fileToGenerativePart(mimeType: any) {
    return {
      inlineData: {
        data: image,
        mimeType
      },
    };
  }
  const filePart1 = fileToGenerativePart("image/jpeg")

  const prompt = "qual o numero escrito ai? escreva apenas o numero" ;

  try {
    const result = await model.generateContent([
      prompt,
      filePart1
    ]);
    return result?.response?.text() || "Nenhuma resposta recebida";

  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    return "arquivo de imagem comrompido!";
  }
}

export default RunGemini;
