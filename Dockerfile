FROM node:18

WORKDIR /app

COPY package.json .
RUN npm install -f
COPY next.config.js .

COPY public/ .
COPY src .
EXPOSE 3000

CMD ["npm","run","dev"]