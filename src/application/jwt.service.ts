import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET || '';

export class JWTService {
  generateToken(payload: string) {
    const token = jwt.sign(payload, secret, {
      expiresIn: '5m',
    });

    return token;
  }

  validateToken(token: string) {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
      console.error(e);

      return null;
    }
  }
}
