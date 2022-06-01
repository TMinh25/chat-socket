export default interface IUser {
  _id: string;
  displayName: string;
  username: string;
  password: string;
  avatar?: string;
  refreshToken?: String;
  createdAt: Date;
  updatedAt: Date;
}
