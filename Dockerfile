FROM node:alpine

WORKDIR /app
ADD . /app

RUN npm install

RUN npm run build

ENV PORT=8080

EXPOSE 8080

CMD node app.js