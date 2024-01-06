import { type ObjectId } from 'mongodb';

export interface CommentType {
  content: string;
  postId: string;
  commentatorId: string;
  createdAt: Date;
}

export interface CommentOutputType {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
}

export interface CommentMapModelType {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
}

export interface CommentReadDbType {
  _id: ObjectId;
  content: string;
  commentatorId: string;
  createdAt: Date;
};

export interface CommentRepositoryType {
  id: string;
  content: string;
  commentatorId: string;
  createdAt: Date;
}
