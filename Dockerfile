FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

USER node

EXPOSE 8443

CMD ["node", "server.js"]