interface INote {
  _id: string;
  title: string;
  content?: string;
  tags: string[];
  creator: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default INote;
