export default interface IMessage {
  _id?: string;
  message: string;
  sender: {
    _id: string;
    displayName: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}
