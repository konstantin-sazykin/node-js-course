import jwt, { type JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET ?? 'testSecret';

export class JWTService {
  // Todo переделать в дженерик
  static generateToken(payload: object, expiresIn = '300000s'): string {
    const token = jwt.sign(payload, secret, { expiresIn });

    return token;
  }

  static validateToken(token: string): JwtPayload | null {
    try {
      const jwtPayload = jwt.verify(token, secret);

      if (typeof jwtPayload === 'string') {
        return null;
      }

      return { ...jwtPayload, iss: undefined };
    } catch (e) {
      console.error(e);

      return null;
    }
  }
}
