import { Express } from "express";
import authRoutes from "./auth.routes";
import noteRoutes from "./note.routes";

function initializeRoutes(app: Express): void {
  app.use("/note", noteRoutes);
  app.use("/auth", authRoutes);
}

export default initializeRoutes;
