import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

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
}
