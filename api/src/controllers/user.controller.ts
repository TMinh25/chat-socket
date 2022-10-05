import User from "../models/user.model";
import { Request, Response } from "express";
import { isValidObjectID } from "../utils";
import logger from "../config/logger";

const NAMESPACE = "User Controller";

const getAllUsers = async (req: Request, res: Response) => {
  User.find()
    .exec()
    .then((userRes) => {
      if (userRes.length > 0) {
        res.status(200).json({
          success: true,
          data: userRes.map((user) => user),
          length: userRes.length,
        });
      } else {
        res.status(404).json({
          success: false,
          data: null,
          error: { title: "Không có người dùng nào trong cơ sở dữ liệu" },
        });
      }
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        error: {
          title: error.message,
          error,
        },
      })
    );
};

const getUser = (req: Request, res: Response) => {
  if (!isValidObjectID(req.params._id)) {
    return res
      .status(400)
      .json({ success: false, title: "ID người dùng không đúng" });
  }
  User.findOne({ _id: req.params._id })
    .exec()
    .then((userRes) => {
      if (userRes === null) {
        res.status(404).json({
          success: false,
          error: { title: "Không tìm thấy người dùng" },
        });
      } else {
        res.status(200).json({ success: true, data: userRes });
      }
    })
    .catch((error) =>
      res
        .status(500)
        .json({ success: false, error: { title: error.message, error: error } })
    );
};

const findUsers = (req: Request, res: Response) => {
  const { username, displayName } = req.body;
  // logger.debug(NAMESPACE, 'findUsers', req.body);
  User.find({
    $or: [{ displayName: displayName }, { username: username }],
  })
    .then((result) => {
      if (result.length === 0) {
        return res
          .status(404)
          .json({ data: null, message: "No user found", length: 0 });
      }
      return res.status(200).json({ data: result, length: result.length });
    })
    .catch((error) => {
      logger.error(NAMESPACE, error.message, error);
      return res.status(500);
    });
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params._id;
  const userExists = await User.exists({ _id: id });

  if (!isValidObjectID(id)) {
    return res.status(400).json({ success: false, message: "Invalid id" });
  } else if (!userExists) {
    return res.status(404).json({
      success: false,
      message: "Người dùng không tồn tại trong cơ sở dữ liệu",
    });
  } else {
    User.deleteOne({ _id: id })
      .then((result) => {
        if (result.deletedCount == 1) {
          res.status(200).json({ success: true });
        } else {
          res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra, không thể xoá người dùng",
          });
        }
      })
      .catch((error) => {
        logger.error(NAMESPACE, error);
        res.status(500).json({ success: false, message: error.message, error });
      });
  }
};

export default { getAllUsers, getUser, findUsers, deleteUser };
