import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Document, PreMiddlewareFunction, Schema } from "mongoose";
import config from "../config/config";

export interface IUser extends Document {
  _id: string;
  displayName: string;
  username: string;
  password: string;
  avatar?: string;
  refreshToken?: String;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): boolean;
  getAccessToken(): string;
  getRefreshToken(): string;
}

const UserSchema: Schema = new Schema(
  {
    displayName: { type: String, required: true },
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: { type: String, required: false },
    refreshToken: { type: String, required: false, default: "" },
  },
  {
    _id: true,
    timestamps: true,
    toObject: {
      minimize: false,
      getters: true,
    },
    versionKey: false,
  }
);

// Mã hoá mật khẩu trước khi lưu hoặc thay đổi
const hashPassword: PreMiddlewareFunction = function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.hash(config.jwtKey, SALT_ROUND, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
};

const SALT_ROUND = 12;
UserSchema.pre("save", hashPassword);
UserSchema.pre("updateOne", hashPassword);

// So sánh mật khẩu đã mã hoá
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Lấy accessToken đăng nhập
UserSchema.methods.getAccessToken = function (): string {
  const { refreshToken, username, password, ...userInfo } = <IUser>(
    this.toObject()
  );
  const accessToken = jwt.sign(userInfo, config.jwtKey, {
    algorithm: "HS512",
    expiresIn: "7d",
  }); // expired in 7 days
  return accessToken;
};

// Lấy refreshToken và lưu lại refreshToken
UserSchema.methods.getRefreshToken = function (): string {
  const { refreshToken, username, password, ...userInfo } = <IUser>(
    this.toObject()
  );
  const newRefreshToken = jwt.sign(userInfo, config.jwtKey, {
    algorithm: "HS512",
    expiresIn: "30d",
  }); // expired in 30 days
  this.refreshToken = newRefreshToken;
  return newRefreshToken;
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
