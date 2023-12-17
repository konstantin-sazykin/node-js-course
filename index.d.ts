import Express from 'express-serve-static-core';

declare global {
  namespace Express {
    export interface Request {
      userId: string | null;
    }
  }
}
