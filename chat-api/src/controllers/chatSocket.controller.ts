import { Server } from "socket.io";
import { io } from "../app";
import logger from "../config/logger";

const NAMESPACE = "Chat Socket Controller";

const initializeSocket = (io: Server) => {
  io.of("/message/all").on("connection", (socket) => {
    logger.info(NAMESPACE, `Người dùng mới đã kết nối\ `);

    socket.on("message all", (msg) => {
      io.emit("message all", msg);

      logger.debug(NAMESPACE, "NEW MESSAGE", msg);
    });
  });
};

export default initializeSocket;
