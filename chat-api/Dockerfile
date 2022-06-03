FROM node:lts-bullseye

WORKDIR /app

ENV MONGO_URL mongodb+srv://NguyenTruongMinh:07355608@tms-database.oni45.mongodb.net/?retryWrites=true&w=majority
ENV MONGO_USER NguyenTruongMinh
ENV MONGO_PASS 07355608
ENV PORT 5000
ENV JWT_KEY NguyenTruongMinh735568
ENV NODE_ENV development

COPY package.json /app/package.json

RUN yarn

COPY . /app

CMD ["yarn", "start"]