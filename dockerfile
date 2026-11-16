FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY backend ./backend
COPY frontend ./frontend

EXPOSE 3000 4000