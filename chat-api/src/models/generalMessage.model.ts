import mongoose, { Schema, Document } from "mongoose";

export interface IGeneralMessage extends Document {
  _id: string;
  message: string;
  sender: {
    _id: string;
    displayName: string;
  };
  deleted: boolean;
  updated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GeneralMessageSchema: Schema = new Schema(
  {
    message: { type: String, required: true, trim: true },
    sender: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      displayName: { type: String, required: true },
    },
    deleted: { type: Boolean, required: true, default: false },
    updated: { type: Boolean, required: true, default: false },
  },
  {
    _id: true,
    timestamps: true,
    toObject: { minimize: false, getters: true },
    versionKey: false,
  }
);

const GeneralMessage = mongoose.model<IGeneralMessage>(
  "General Message",
  GeneralMessageSchema
);
export default GeneralMessage;
