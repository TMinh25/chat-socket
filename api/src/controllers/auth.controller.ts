import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import config from "../config/config";
import logger from "../config/logger";
import User, { IUser } from "../models/user.model";
import { getAuthorizationHeaderToken } from "../utils";

const NAMESPACE = "Auth Controller";

export const verifyAccessToken = (accessToken: string): Promise<IUser> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = jwt.verify(accessToken, config.jwtKey, {
        algorithms: ["HS512"],
      });
      if (!user) reject("notfound");
      const userFound = await User.findById((user as IUser)._id).exec();
      resolve(userFound as IUser);
    } catch (error: any) {
      if (error.name === TokenExpiredError.name) {
        reject("expired");
      }
      reject("error");
    }

    // async (error, user) => {
    //   console.log(user);
    //   if (error) {
    //     if (error.name === TokenExpiredError.name) {
    //       reject("expired");
    //     }
    //     reject("error");
    //   }
    //   if (!user) {
    //     return reject("notfound");
    //   }
    //   const userFound = await User.findOne({
    //     _id: (user as jwt.JwtPayload)._id,
    //   }).exec();
    //   resolve(userFound as IUser);
    // };
  });
};

const getAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const userWithRefreshToken = await User.findOne({ refreshToken }).exec();

  try {
    if (!!userWithRefreshToken) {
      // Cập nhật refreshToken trong cơ sở dữ liệu
      const accessToken = userWithRefreshToken.getAccessToken();
      const newRefreshToken = userWithRefreshToken.getRefreshToken();
      return res.status(200).json({
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
      });
    } else {
      res.status(403).json({ success: false, message: "Token không hợp lệ!" });
    }
  } catch (error) {
    logger.error(NAMESPACE, error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
  }
};

const authInfo = async (req: Request, res: Response) => {
  const accessToken = getAuthorizationHeaderToken(req);
  try {
    const userFound = await verifyAccessToken(accessToken);
    // const userInformation = userFound?.userInfomation();
    if (!userFound)
      return res
        .status(404)
        .json({ success: false, message: "Không thể lấy dữ liệu từ phiên" });

    return res.status(200).json({ success: true, data: userFound });
  } catch (error) {
    if (error === "expired") {
      return res.status(401).json({
        success: false,
        error: { title: "Phiên hết hạn", description: "Hãy đăng nhập lại" },
      });
    } else if (error === "notfound") {
      return res.status(404).json({
        success: false,
        error: { title: "Không thể tìm thấy người dùng" },
      });
    } else {
      return res.status(500);
    }
  }
};

const signUp = async (req: Request, res: Response) => {
  const { displayName, avatar, username, password } = req.body;

  const emptyValidatorObject = <Object>{
    ...{ displayName, username, password },
  };
  const emptyFieldArray: String[] = [];
  for (const [key, value] of Object.entries(emptyValidatorObject)) {
    if (!value) {
      emptyFieldArray.push(key);
    }
  }
  if (emptyFieldArray.length > 0)
    return res.status(400).json({
      success: false,
      error: {
        title: "Hãy điền đầy đủ thông tin",
      },
      emptyField: emptyFieldArray,
    });
  if (await User.exists({ username }).exec())
    return res
      .status(400)
      .json({ success: false, message: "Tài khoản đã tồn tại" });
  const userInfo = req.body;
  const user = new User(userInfo);
  return user
    .save()
    .then((user: IUser) => {
      return res.status(201).json({ success: true, data: user });
    })
    .catch((error) => {
      logger.error(NAMESPACE, error);
      return res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    });
};

const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      authenticated: false,
      error: { title: "Hãy nhập đầy đủ thông tin" },
    });
  }
  try {
    const user = await User.findOne({ username: username })
      .collation({ locale: "tr", strength: 2 })
      .exec();
    if (!user) {
      return res.status(404).json({
        authenticated: false,
        error: {
          title: "Tài khoản không tồn tại!",
          description: "Hãy đăng nhập bằng tài khoản khác",
        },
      });
    }
    if (!user.comparePassword(password)) {
      return res.status(401).json({
        authenticated: false,
        error: {
          title: "Mật khẩu của tài khoản không đúng",
          description: "Hãy nhập mật khẩu đúng",
        },
      });
    }
    const accessToken = user.getAccessToken();
    // get refreshToken with userInfomation/
    const refreshToken = user.getRefreshToken();
    // update refreshToken inside database
    user.refreshToken = refreshToken;
    user.save();
    res.status(200).json({ authenticated: true, accessToken, refreshToken });
  } catch (error) {
    logger.error(NAMESPACE, error);
    res.status(500).json({ authenticated: false, error });
  }
};

const signOut = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  try {
    const user = await User.findOne({ refreshToken }).exec();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Phiên không tồn tại" });
    } else {
      user.refreshToken = undefined;
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "Đăng xuất thành công" });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error);
    res
      .status(500)
      .json({ success: false, error: { title: "Không thể đăng xuất" } });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { password } = req.body;
    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "Hãy nhập mật khẩu mới" });
    const user = await User.findById(_id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Tài khoản không tồn tại!" });
    user.password = password;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Mật khẩu của bạn đã được thay đổi" });
  } catch (error) {
    logger.error(NAMESPACE, error);
    return res
      .status(500)
      .json({ success: false, message: "Đã có lỗi xảy ra!" });
  }
};

export default {
  getAccessToken,
  authInfo,
  signIn,
  signUp,
  signOut,
  resetPassword,
};
