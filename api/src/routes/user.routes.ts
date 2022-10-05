import express from "express";
import userController from "../controllers/user.controller";

const userRoutes = express.Router();

userRoutes.get("/", userController.getAllUsers);
userRoutes.post("/find", userController.findUsers);
userRoutes.get("/:_id", userController.getUser);
userRoutes.delete("/:_id", userController.deleteUser);

export default userRoutes;
