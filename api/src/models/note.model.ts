import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  _id: string;
  title: string;
  content?: string;
  tags: string[];
  creator: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true, default: null },
    content: { type: String, required: false, default: null },
    creator: {
      type: String,
      required: false,
      default: "Anonymous",
      trim: true,
    },
    image: {
      type: String,
      required: false,
      default: null,
    },
    tags: { type: [String], required: true, default: [] },
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

const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note;
