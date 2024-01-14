import { ObjectId } from 'mongodb';

import { sessionCollection } from '../../db/db';
import { type SessionReadRepositoryOutputType, type SessionRepositoryOutputType } from '../../types/session/output';

import { SessionMapper, SessionOutputMapper } from './../../types/session/mapper';

export class SessionQueryRepository {
  static async find(sessionId: string): Promise<SessionRepositoryOutputType | null> {
    try {
      const result = await sessionCollection.findOne({ _id: new ObjectId(sessionId) });

      if (!result) {
        return null;
      }
      return { ...new SessionMapper(result) };
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  static async findAll(userId: string): Promise<SessionReadRepositoryOutputType[] | null> {
    const result = await sessionCollection.find({ userId }).toArray();

    return result.map(session => ({ ...new SessionOutputMapper(session) }));
  }
}
