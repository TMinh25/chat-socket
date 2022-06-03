FROM node:lts-bullseye

WORKDIR /app

ENV PORT 3000
ENV NOTE_BACKEND_URL http://localhost:5000

COPY package.json /app/package.json

RUN yarn

COPY . /app

CMD ["yarn", "dev"]
