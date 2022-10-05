export default interface IMessage {
  _id?: string;
  message: string;
  sender: {
    _id: string;
    displayName: string;
  };
  deleted: boolean;
  updated: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
