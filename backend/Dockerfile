# Estágio de Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache python3 make g++ 
RUN npm install
COPY . .
RUN npm run build

# Estágio de Produção
FROM node:20-alpine
WORKDIR /app

# Instala dependências necessárias para o node-sqlite3 se houver compilação nativa
RUN apk add --no-cache python3 make g++ 

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Criar diretório para o banco SQLite e dar permissão
RUN mkdir -p /app/data && chown -R node:node /app/data

USER node
EXPOSE 3001
CMD ["node", "dist/main"]