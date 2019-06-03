FROM node:8-slim

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 80

ENV Name Node

CMD ["node", "app.js"]