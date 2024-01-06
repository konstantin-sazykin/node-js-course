import { SessionMapper } from './../../types/session/mapper';
import { ObjectId } from 'mongodb';
import { sessionCollection } from '../../db/db';
import { SessionRepositoryOutputType } from '../../types/session/output';

export class SessionQueryRepository {
  static async find(sessionId: string): Promise<SessionRepositoryOutputType | null> {
    const result = await sessionCollection.findOne({ _id: new ObjectId(sessionId) });

    if (!result) {
      return null;
    }
    return { ...new SessionMapper(result) };
  }
}
