import mongoose, { Schema, Document } from "mongoose";

export interface IGeneralMessage extends Document {
  _id: String;
  message: String;
  sender: {
    _id: String;
    displayName: String;
  };
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
