import { NextFunction, Request, Response } from 'express';
import { RequestType } from '../types/common';
import { UserAuthQueryType } from '../types/user/output';
import { UserService } from '../domain/user.service';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { JWTService } from '../application/jwt.service';
import { UserQueryRepository } from '../repositories/user/user.query-repository';
import { ApiError } from '../exeptions/api.error';
import { AuthConfirmEmailInputType, AuthCreateUserInputType } from '../types/auth/input';

export class AuthController {
  static async postLogin(
    request: RequestType<{}, UserAuthQueryType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { loginOrEmail, password } = request.body;

      const userId = await UserService.checkCredentials(loginOrEmail, password);

      if (userId) {
        const accessToken = JWTService.generateToken(userId);

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

  static async postRegistration(
    request: RequestType<{}, AuthCreateUserInputType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { email, login, password } = request.body;

      const result = await UserService.createUser(login, email, password, false);

      if (!result) {
        return next(ApiError.BadRequest(null));
      }

      response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } catch (error) {
      console.error(error);

      next(error);
    }
  }

  static async confirmRegistration(
    request: RequestType<{}, AuthConfirmEmailInputType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const result = await UserService.confirmEmail(request.body.code);
      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        throw new ApiError(ResponseStatusCodesEnum.InternalError, 'Внутренняя ошибка в процессе подвтерждения email')
      }
    } catch (error) {
      next(error);
    }
  }
}
