import Message, { IMessage } from "./message.model";
import mongoose, { Schema, Document } from "mongoose";

export interface IChannel extends Document {
  _id: String;
  name: String;
  member: String[];
  message: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChannelSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    member: { type: [mongoose.Types.ObjectId], default: [] },
    message: { type: [Message], default: [], required: true },
  },
  {
    _id: true,
    timestamps: true,
    toObject: { minimize: false, getters: true },
    versionKey: false,
  }
);

const Channel = mongoose.model<IChannel>("Channel", ChannelSchema);
export default Channel;
