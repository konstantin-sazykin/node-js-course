import { type DeleteResult } from 'mongodb';

import { attemptCollection } from '../db/db';
import { AttemptRepository } from '../repositories/attempt/attempt.repository';

export class RateLimitService {
  static async checkLimit(ip: string, points: number, duration: number): Promise<boolean> {
    const nowDate = (new Date()).getTime() / 1000;

    // Await AttemptRepository.setLimit(ip, nowDate);

    const ipList = await AttemptRepository.getAttempts(ip);

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

    await AttemptRepository.setLimit(ip, nowDate);

    return true;
  }

  static async clearLimits(): Promise<DeleteResult> {
    return await attemptCollection.deleteMany({});
  }
}
