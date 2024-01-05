import { SessionRepository } from './../repositories/session/session.repository';
import { CreateSessionInputType, UpdateSessionInputType } from '../types/session/input';
import { JWTService } from '../application/jwt.service';

export class SessionService {
  static async createSession(sessionData: CreateSessionInputType) {
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

    const refreshToken = JWTService.generateToken(session, '20s');

    return refreshToken;
  }

  static async updateSession(sessionId: string) {
    const result = await SessionRepository.update(sessionId);

    if (!result) {
      return null;
    }

    const refreshToken = JWTService.generateToken(result, '20s');

    return refreshToken;
  }

  static async deleteSession(sessionId: string) {
    const isDeleted = await SessionRepository.delete(sessionId);

    return isDeleted;
  }
}
