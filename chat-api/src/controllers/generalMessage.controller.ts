import GeneralMessage, {
  IGeneralMessage,
} from "../models/generalMessage.model";
import { Request, Response } from "express";
import logger from "../config/logger";

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

export default { pushMessage, getAllGeneralMessages, deleteGeneralMessage };
