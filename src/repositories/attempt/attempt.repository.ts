import { attemptCollection } from '../../db/db';

export class AttemptRepository {
  static async setLimit(ip: string, url: string, value: number): Promise<boolean> {
    try {
      const isIpAlreadyInDB = await attemptCollection.findOne({ ip, url });
      if (isIpAlreadyInDB) {
        const result = await attemptCollection.updateOne({ ip, url }, { $push: { attempts: value } });

        return !!result.modifiedCount;
      }

      const result = await attemptCollection.insertOne({ ip, url, attempts: [value] });

      return !!result.acknowledged;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  static async getAttempts(ip: string, url: string): Promise<number[]> {
    try {
      const result = await attemptCollection.findOne({ ip, url });

      if (!result) {
        return [];
      }

      return result.attempts;
    } catch (error) {
      console.error(error);

      return [];
    }
  }
}
