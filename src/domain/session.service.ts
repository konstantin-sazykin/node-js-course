import dotenv from 'dotenv';

import { type CreateSessionInputType } from '../types/session/input';
import { JWTService } from '../application/jwt.service';
import { SessionQueryRepository } from '../repositories/session/session.query-repository';

import { SessionRepository } from './../repositories/session/session.repository';

dotenv.config();

const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN ?? '20s';

export class SessionService {
  static async createSession(sessionData: CreateSessionInputType): Promise<string | null> {
    const {
      userId,
      IP = 'Unknown IP',
      browserName = 'Unknown browser',
      browserVersion = '',
      osName = 'Unknown OS',
      osVersion = '',
    } = sessionData;

    const browser = `${browserName} ${browserVersion}`.trim();
    const os = `${osName} ${osVersion}`.trim();

    const session = await SessionRepository.create({ userId, IP, os, browser });

    if (!session) {
      return null;
    }

    const refreshToken = JWTService.generateToken(session, REFRESH_TOKEN_EXPIRES_IN);

    return refreshToken;
  }

  static async updateSession(sessionId: string, tokenExtendedAt: string): Promise<string | null> {
    const session = await SessionQueryRepository.find(sessionId);

    if (!session) {
      return null;
    }

    const lastExtended = session.extendedAt;

    if (lastExtended && lastExtended !== tokenExtendedAt) {
      return null;
    }

    const result = await SessionRepository.update(sessionId);

    if (!result) {
      return null;
    }

    const refreshToken = JWTService.generateToken(result, REFRESH_TOKEN_EXPIRES_IN);

    return refreshToken;
  }

  static async deleteSession(sessionId: string): Promise<boolean> {
    const isDeleted = await SessionRepository.remove(sessionId);

    return isDeleted;
  }

  static async deleteAllSessions(userId: string): Promise<boolean> {
    const hasDeleted = await SessionRepository.removaAll(userId);

    return hasDeleted;
  }
}
