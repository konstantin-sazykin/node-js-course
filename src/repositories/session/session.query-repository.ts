import { ObjectId } from 'mongodb';

import { sessionCollection } from '../../db/db';
import { type SessionRepositoryOutputType } from '../../types/session/output';

import { SessionMapper } from './../../types/session/mapper';

export class SessionQueryRepository {
  static async find(sessionId: string): Promise<SessionRepositoryOutputType | null> {
    const result = await sessionCollection.findOne({ _id: new ObjectId(sessionId) });

    if (!result) {
      return null;
    }
    return { ...new SessionMapper(result) };
  }
}
