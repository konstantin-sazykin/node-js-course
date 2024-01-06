import { type WithId } from 'mongodb';

import { type SessionType } from './output';

export class SessionMapper {
  userId: string;
  sessionId: string;
  createdAt: string;
  extendedAt: string;

  constructor({ _id, userId, createdAt, extendedAt }: WithId<SessionType>) {
    this.userId = userId;
    this.sessionId = _id.toString();
    this.createdAt = createdAt;
    this.extendedAt = extendedAt;
  }
}
