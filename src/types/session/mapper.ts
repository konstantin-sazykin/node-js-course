import { WithId } from 'mongodb';
import { SessionType } from './output';

export class SessionMapper {
  userId: string;
  sessionId: string;
  createdAt: string;

  constructor({ _id, userId, createdAt }: WithId<SessionType>) {
    this.userId = userId;
    this.sessionId = _id.toString();
    this.createdAt = createdAt;
  }
}
