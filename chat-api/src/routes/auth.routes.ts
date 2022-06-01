import express from "express";
import authController from "../controllers/auth.controller";
import { tokenAuthorization } from "../middlewares/tokenAuthorization";

const authRoutes = express.Router();

authRoutes.post("/signup", authController.signUp);
authRoutes.post("/signin", authController.signIn);
authRoutes.delete("/signout", tokenAuthorization, authController.signOut);
authRoutes.get("/info", tokenAuthorization, authController.authInfo);
authRoutes.post("/access-token", authController.getAccessToken);
authRoutes.post("/password-reset/:userId", authController.resetPassword);

export default authRoutes;
