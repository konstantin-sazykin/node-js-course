import { NextFunction, Request, Response } from 'express';
import { RequestType } from '../types/common';
import { UserAuthQueryType } from '../types/user/output';
import { UserService } from '../domain/user.service';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { JWTService } from '../application/jwt.service';
import { UserQueryRepository } from '../repositories/user/user.query-repository';
import { ApiError } from '../exeptions/api.error';

export class AuthController {
  static async post(
    request: RequestType<{}, UserAuthQueryType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { loginOrEmail, password } = request.body;

      const userId = await UserService.checkCredentials(loginOrEmail, password);

      if (userId) {
        const accessToken = JWTService.generateToken(userId)

        response.send({ accessToken });
      } else {
        response.sendStatus(ResponseStatusCodesEnum.Unathorized);
      }
    } catch (error) {
      console.log({ error });
      
      next(error);
    }
  }

  static async getUser(request: RequestType<{}, {}>, response: Response, next: NextFunction) {
    try {
      const userId = request.userId;

      if (!userId) {
        return next(ApiError.UnauthorizedError());
      }

      const user = await UserQueryRepository.findUserById(userId);

      if (!user) {
        return next(ApiError.UnauthorizedError());
      }

      response.send(user);

    } catch (error) {
      next(error);
    }
  }
}
