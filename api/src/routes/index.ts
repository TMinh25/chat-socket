import { Express } from "express";
import authRoutes from "./auth.routes";
import generalMessageRoutes from "./generalMessage.routes";
import userRoutes from "./user.routes";

function initializeRoutes(app: Express): void {
  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/message/general", generalMessageRoutes);
}

export default initializeRoutes;
