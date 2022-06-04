import GeneralMessage, {
  IGeneralMessage,
} from "../models/generalMessage.model";
import { Request, Response } from "express";
import logger from "../config/logger";
import { isValidObjectID } from "../utils";

const NAMESPACE = "Message Controller";

const pushMessage = async (message: Partial<IGeneralMessage>) => {
  try {
    const generalMessage = new GeneralMessage(message);
    await generalMessage.save();
  } catch (error) {
    logger.error(NAMESPACE, error);
  }
};

const getAllGeneralMessages = async (req: Request, res: Response) => {
  try {
    const allMessages = await GeneralMessage.find().exec();
    return res
      .status(200)
      .json({ success: true, data: allMessages, length: allMessages.length });
  } catch (error) {
    logger.error(NAMESPACE, error);
    res.status(500).json({ success: false, data: undefined });
  }
};

const updateGeneralMessage = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { message } = req.body;
    if (!isValidObjectID(_id))
      return res
        .status(400)
        .json({ success: false, message: "Không tìm được tin nhắn!" });
    else if (!(await GeneralMessage.exists({ _id })))
      return res
        .status(404)
        .json({ success: false, message: "Tin nhắn không tồn tại!" });
    else {
      const doc = await GeneralMessage.findOneAndUpdate(
        { _id },
        { message },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "Tin nhắn được cập nhật thành công" });
    }
  } catch (error) {
    logger.error(NAMESPACE, error);
    res.status(500).json({ success: false });
  }
};

const deleteGeneralMessage = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const message = await GeneralMessage.findOneAndDelete({ _id });
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error(NAMESPACE, error);
    res.status(500).json({ success: false });
  }
};

export default {
  pushMessage,
  getAllGeneralMessages,
  deleteGeneralMessage,
  updateGeneralMessage,
};
