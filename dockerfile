# Usa a imagem base oficial do Node.js
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /src

# Copia o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código do projeto para o diretório de trabalho
COPY . .

# Compila o código TypeScript para JavaScript
RUN npm run build

# Define a variável de ambiente para a aplicação
ENV NODE_ENV=production

# Expõe a porta que a aplicação vai usar
EXPOSE 3000

# Define o comando para iniciar a aplicação
RUN ["node", "./manipulate-db/create-table.js"]
CMD ["npm", "run dev"]
