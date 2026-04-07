# Estágio de Build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
# Dependências de build
RUN apk add --no-cache python3 make g++
RUN npm ci  

COPY . .
RUN npm run build

# Estágio de Produção
FROM node:20-alpine
WORKDIR /app


COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

RUN mkdir -p /app/data && chown -R node:node /app/data

USER node

EXPOSE 3001

ENV DATABASE_PATH=/app/data/test.db
CMD ["node", "dist/main"]