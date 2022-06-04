import express from "express";
import generalMessageController from "../controllers/generalMessage.controller";

const generalMessageRoutes = express.Router();

generalMessageRoutes.get("/", generalMessageController.getAllGeneralMessages);
generalMessageRoutes.patch(
  "/update/:_id",
  generalMessageController.updateGeneralMessage
);
generalMessageRoutes.delete(
  "/delete/:_id",
  generalMessageController.deleteGeneralMessage
);

export default generalMessageRoutes;
