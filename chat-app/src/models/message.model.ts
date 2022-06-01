export default interface IMessage {
  _id?: String;
  message: String;
  sender: {
    _id: String;
    displayName: String;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
