FROM node:18-slim

WORKDIR /app

RUN npm install

WORKDIR /app/services/payouts-service

CMD ["node", "payouts.service.js"]