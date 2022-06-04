import io, { Manager, Socket } from "socket.io-client";
import config from "../../config";

export const socketManager = new Manager(config.server.url, {
  autoConnect: false,
  transports: ["websocket", "polling", "flashsocket"],
});

export const chatSocket: Socket = io("http://localhost:5000", {
  withCredentials: true,
});
