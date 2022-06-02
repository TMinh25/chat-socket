import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import config from "./config/config";
import logger from "./config/logger";
import generalMessageController from "./controllers/generalMessage.controller";
import { mongoDbInitValidation } from "./middlewares/initValidation";
import initializeRoutes from "./routes";

const NAMESPACE = "Server";
const app = express();

// Initialization
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((_) => {
    logger.info(NAMESPACE, "Đã kết nối tới MongoDB ");
  })
  .catch((error) => {
    logger.error(NAMESPACE, "Kết nối tới MongoDB không thành công ", error);
    process.exit(1);
  });

// Logging the request
app.use((req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  logger.request(NAMESPACE, method, url);

  // log when finish request
  res.on("finish", () => {
    logger.response(NAMESPACE, method, url, res.statusCode);
  });
  // log when error appear
  res.on("error", (error) => {
    logger.error(NAMESPACE, `${error.stack}`);
    if (error)
      return res.status(500).send({ message: "Server ngắt kết nối! ", error });
  });
  next();
});

// Parse the request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    allowedHeaders: "*",
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use(mongoDbInitValidation);

initializeRoutes(app);

const { port, hostname } = config.server;

// Create the server
const httpServer = http.createServer(app);
httpServer.listen({ port: port, host: "0.0.0.0" }, () =>
  logger.info(NAMESPACE, `Server đang chạy tại đường dẫn ${hostname}:${port}\ `)
);

// Create the socket
export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  logger.info(NAMESPACE, `Người dùng mới đã kết nối\ `);

  socket.on("message all", async (msg) => {
    await generalMessageController.pushMessage(JSON.parse(msg));
    io.emit("message all", msg);
    logger.debug(NAMESPACE, "NEW MESSAGE", msg);
  });
});
// initializeSocket(io);