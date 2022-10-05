import { Request, Response } from "express";
import config from "../config/config";
import logger from "../config/logger";
import Note from "../models/note.model";
import { isValidObjectID } from "../utils";
// import { createApi } from "unsplash-js";

// const unsplash = createApi({ accessKey: config.unsplash.accessKey });

const NAMESPACE = "Note Controller";

const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find();
    if (notes.length <= 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không có ghi chú nào!" });
    }
    return res
      .status(200)
      .json({ success: true, data: notes, length: notes.length });
  } catch (error) {
    logger.error(NAMESPACE, error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
  }
};

const getNoteByID = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectID(_id))
      return res
        .status(400)
        .json({ success: false, message: "Mã ghi chú không đúng định dạng!" });
    const note = await Note.findById(_id);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy ghi chú!" });
    }
    return res.status(200).json({ success: true, data: note });
  } catch (error) {
    logger.error(NAMESPACE, error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
  }
};

const createNewNote = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    // const image = await unsplash.photos.getRandom({});
    const note = new Note({ title, content, tags });
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Hãy điền đủ thông tin!" });
    await note.save();
    return res.status(200).json({ success: true, data: note });
  } catch (error) {
    logger.error(NAMESPACE, error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
  }
};

const updateNote = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { title, content, tags } = req.body;
    let note = await Note.findOneAndUpdate({ _id }, { title, content, tags });
    const allNotes = await Note.find();
    return res.status(200).json({ success: true, data: allNotes });
  } catch (error) {
    logger.error(NAMESPACE, error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
  }
};

const deleteNote = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectID(_id))
      return res
        .status(400)
        .json({ success: false, message: "Mã ghi chú không đúng!" });
    if (!(await Note.findById(_id)))
      return res
        .status(404)
        .json({ success: false, message: "Ghi chú không tồn tại!" });
    await Note.findOneAndDelete({ _id });
    const allNotes = await Note.find();
    return res.status(200).json({ success: true, data: allNotes });
  } catch (error) {
    logger.error(NAMESPACE, error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
  }
};

export default {
  getAllNotes,
  getNoteByID,
  createNewNote,
  updateNote,
  deleteNote,
};
