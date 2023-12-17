import { ObjectId } from 'mongodb';

export type CommentType = {
  content: string;
  postId: string;
  commentatorId: string;
  createdAt: Date;
};

export type CommentOutputType = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
};

export type CommentMapModelType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
};

export type CommentReadDbType = {
  _id: ObjectId;
  content: string;
  commentatorId: string;
  createdAt: Date;
}

export type CommentRepositoryType = {
  id: string;
  content: string;
  commentatorId: string;
  createdAt: Date;
}