import { NextFunction, Request, Response } from 'express';
import { RequestType } from '../types/common';
import { UserAuthQueryType } from '../types/user/output';
import { UserService } from '../domain/user.service';
import { ResponseStatusCodesEnum } from '../utils/constants';

export class AuthController {
  static async post(
    request: RequestType<{}, UserAuthQueryType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { loginOrEmail, password } = request.body;

      const result = await UserService.checkCredentials(loginOrEmail, password);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        response.sendStatus(ResponseStatusCodesEnum.Unathorized);
      }
    } catch (error) {
      next(error);
    }
  }
}
