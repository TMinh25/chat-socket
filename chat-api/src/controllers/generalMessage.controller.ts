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
    const newMessage = await generalMessage.save();
    return newMessage;
  } catch (error) {
    logger.error(NAMESPACE, error);
  }
};

const deleteMessage = async (
  _id: string
): Promise<
  | (IGeneralMessage & {
      _id: string;
    })
  | null
> => {
  try {
    if (!isValidObjectID(_id) || !(await GeneralMessage.exists({ _id })))
      return null;
    const message = await GeneralMessage.findOneAndUpdate(
      { _id },
      { deleted: true }
    );
    return message;
  } catch (error) {
    logger.error(NAMESPACE, error);
    return null;
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

const updateMessage = async ({
  _id,
  message,
}: Pick<IGeneralMessage, "_id" | "message">): Promise<
  | (IGeneralMessage & {
      _id: string;
    })
  | null
> => {
  try {
    if (!isValidObjectID(_id) || !(await GeneralMessage.exists({ _id })))
      return null;
    else {
      const doc = await GeneralMessage.findOneAndUpdate(
        { _id },
        { message, updated: true },
        { new: true }
      );
      return doc;
    }
  } catch (error) {
    logger.error(NAMESPACE, error);
    return null;
  }
};

export default {
  pushMessage,
  updateMessage,
  deleteMessage,
  getAllGeneralMessages,
};
