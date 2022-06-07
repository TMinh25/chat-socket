import express from "express";
import generalMessageController from "../controllers/generalMessage.controller";

const generalMessageRoutes = express.Router();

generalMessageRoutes.get("/", generalMessageController.getAllGeneralMessages);

export default generalMessageRoutes;
