import { ObjectId } from 'mongodb';

import { sessionCollection } from '../../db/db';
import { type CreateSessionRepositoryType } from '../../types/session/input';
import { SessionMapper } from '../../types/session/mapper';
import { type SessionRepositoryOutputType } from '../../types/session/output';
import { addTImeToCurrentDate } from '../../utils/addTImeToCurrentDate';
import { REFRESH_TOKEN_EXPIRES_IN } from '../../utils/constants';

export class SessionRepository {
  static async create(
    data: CreateSessionRepositoryType,
  ): Promise<SessionRepositoryOutputType | null> {
    try {
      const result = await sessionCollection.insertOne({
        userId: data.userId,
        createdAt: new Date().toISOString(),
        extendedAt: new Date().toISOString(),
        expiresAt: addTImeToCurrentDate(REFRESH_TOKEN_EXPIRES_IN),
        os: data.os,
        IP: data.IP,
        browser: data.browser,
      });

      const createdSession = await sessionCollection.findOne({ _id: result.insertedId });

      if (createdSession) {
        return { ...new SessionMapper(createdSession) };
      }
      return null;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  static async update(sessionId: string): Promise<SessionRepositoryOutputType | null> {
    try {
      const id = new ObjectId(sessionId);
      const result = await sessionCollection.updateOne(
        { _id: id },
        { $set: { extendedAt: new Date().toISOString() } },
      );

      if (result.modifiedCount) {
        const updatedSession = await sessionCollection.findOne({ _id: id });

        if (!updatedSession) {
          return updatedSession;
        }

        return { ...new SessionMapper(updatedSession) };
      }
      return null;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  static async remove(sessionId: string): Promise<boolean> {
    try {
      const result = await sessionCollection.deleteOne({ _id: new ObjectId(sessionId) });

      return !!result.deletedCount;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  static async removaAll(userId: string): Promise<boolean> {
    try {
      const result = await sessionCollection.deleteMany({ userId });

      return !!result.deletedCount;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
