// eslint-disable-next-line no-unused-vars
import Express from 'express-serve-static-core';

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    export interface Request {
      userId: string | null;
    }
  }
}
