import express from "express";
import noteController from "../controllers/note.controller";

const noteRoutes = express.Router();

noteRoutes.get("/", noteController.getAllNotes);
noteRoutes.get("/:_id", noteController.getNoteByID);
noteRoutes.post("/new", noteController.createNewNote);
noteRoutes.patch("/update/:_id", noteController.updateNote);
noteRoutes.delete("/delete/:_id", noteController.deleteNote);

export default noteRoutes;
