import { type DeleteResult } from 'mongodb';

import { attemptCollection } from '../db/db';
import { AttemptRepository } from '../repositories/attempt/attempt.repository';

export class RateLimitService {
  static async checkLimit(
    ip: string,
    url: string,
    points: number,
    duration: number,
  ): Promise<boolean> {
    try {
      const nowDate = new Date().getTime() / 1000;

      await AttemptRepository.setLimit(ip, url, nowDate);

      const ipList = await AttemptRepository.getAttempts(ip, url);

      if (!ipList.length) {
        return true;
      }

      const slicedIpList = ipList.slice(-points);

      if (slicedIpList.length < points) {
        return true;
      }

      const firstEl = slicedIpList[0];
      const diff = nowDate - firstEl;

      if (diff <= duration) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  static async clearLimits(): Promise<DeleteResult> {
    return await attemptCollection.deleteMany({});
  }
}
