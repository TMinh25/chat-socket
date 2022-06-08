import dotenv from "dotenv";

dotenv.config();

const MONGO_OPTIONS: object = {
  socketTimeoutMS: 20000,
  keepAlive: true,
  autoIndex: false,
  retryWrites: false,
};

const MONGO_USERNAME: string = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD: string = process.env.MONGO_PASSWORD || "";
const MONGO_URL: string = process.env.MONGO_URL || "";

const MONGO = {
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  options: MONGO_OPTIONS,
  url: MONGO_URL,
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
  url: SERVER_URL,
};

const client = {
  url: process.env.CLIENT_URL,
};

const jwtKey = process.env.JWT_KEY as string;

const config = {
  mongo: MONGO,
  server: SERVER,
  enviroment: process.env.NODE_ENV,
  client,
  jwtKey,
};

export default config;
