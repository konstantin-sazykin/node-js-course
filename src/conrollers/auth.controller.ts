import { NextFunction, Request, Response } from 'express';

export class AuthController {
  static async post(request: Request, response: Response, next: NextFunction) {
    try {
      response.send('ok')
    } catch (error) {
      next(error);
    }
  }
}

