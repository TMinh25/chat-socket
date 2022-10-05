import IMessage from "./message.model";

export default interface IChanel {
  _id: String;
  name: String;
  member: String[];
  message: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}
