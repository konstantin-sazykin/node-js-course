import { type CommentMapModelType, type CommentReadDbType } from './output';

export class CommentMapper {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  createdAt: string;

  constructor({ id, content, userId, userLogin, createdAt }: CommentMapModelType) {
    this.id = id;
    this.content = content;
    this.commentatorInfo = {
      userId,
      userLogin,
    };
    this.createdAt = createdAt.toISOString();
  }
}

export class CommentDbMapper {
  id: string;
  content: string;
  commentatorId: string;
  createdAt: Date;

  constructor({ _id, content, commentatorId, createdAt }: CommentReadDbType) {
    this.id = _id.toString();
    this.content = content;
    this.createdAt = createdAt;
    this.commentatorId = commentatorId;
  }
}
