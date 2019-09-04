FROM node:12.9.1-alpine

ENV EXCHANGE_CLIENT_TOKEN ""
ENV TELEGRAM_CLIENT_TOKEN ""

COPY src/ /node/src/
COPY package*.json /node/

WORKDIR /node
CMD npm install && npm start