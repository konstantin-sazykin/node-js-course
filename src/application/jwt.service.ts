import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RefreshBlackListRepository } from '../repositories/refreshBlackList/refreshBlackList.repository';
import { RefreshBlackListQueryRepository } from '../repositories/refreshBlackList/refreshBlackList.query-repository';

dotenv.config();

const secret = process.env.JWT_SECRET || 'testSecret';

export class JWTService {
  static generateToken(payload: string, expiresIn = '300000s') {
    const token = jwt.sign({ id: payload }, secret, { expiresIn });

    return token;
  }

  static validateToken(token: string): string | JwtPayload | null {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  static async generateRefreshToken(userId: string, oldToken: string) {
    if (!userId) {
      return null;
    }

    if (oldToken) {
      await RefreshBlackListRepository.create(oldToken, userId);
    }

    const refresh = this.generateToken(userId, '20s');

    return refresh;
  }

  static async validateRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      const userData = this.validateToken(token);

      if (!userData || typeof userData === 'string') {
        return null;
      }

      const isAlreadyInBlackList = await RefreshBlackListQueryRepository.find(token);

      if (isAlreadyInBlackList) {
        return null;
      }

      return userData;
    } catch (error) {
      console.error(error);
      
      return null;
    }
  }
}
