import { type WithId } from 'mongodb';

import { type SessionType } from './output';

export class SessionMapper {
  userId: string;
  sessionId: string;
  deviceId: string;
  createdAt: string;
  extendedAt: string;

  constructor({ _id, userId, createdAt, extendedAt }: WithId<SessionType>) {
    this.userId = userId;
    this.sessionId = _id.toString();
    this.deviceId = _id.toString();
    this.createdAt = createdAt;
    this.extendedAt = extendedAt;
  }
}

export class SessionOutputMapper {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  constructor({ _id, extendedAt, browser, IP }: WithId<SessionType>) {
    this.ip = IP;
    this.deviceId = _id.toString();
    this.lastActiveDate = extendedAt;
    this.title = browser;
  }
}
