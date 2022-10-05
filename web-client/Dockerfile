FROM node:lts-bullseye

WORKDIR /app

COPY package.json /app/package.json

RUN yarn

COPY . /app

CMD ["yarn", "dev"]
