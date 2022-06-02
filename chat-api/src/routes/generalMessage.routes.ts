import express from "express";
import generalMessageController from "../controllers/generalMessage.controller";

const generalMessageRoutes = express.Router();

generalMessageRoutes.get("/", generalMessageController.getAllGeneralMessages);
generalMessageRoutes.delete(
  "/delete/:_id",
  generalMessageController.deleteGeneralMessage
);

export default generalMessageRoutes;
