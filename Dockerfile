FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install mysql2
RUN npm install
COPY ./app/ ./app

ARG port=3001
EXPOSE $port

run node tests.js
CMD ["node", "app/server.js"]