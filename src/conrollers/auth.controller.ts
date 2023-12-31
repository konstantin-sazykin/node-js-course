import { NextFunction, Request, Response } from 'express';
import { RequestType } from '../types/common';
import { UserAuthQueryType } from '../types/user/output';
import { UserService } from '../domain/user.service';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { JWTService } from '../application/jwt.service';
import { UserQueryRepository } from '../repositories/user/user.query-repository';
import { ApiError } from '../exeptions/api.error';
import {
  AuthConfirmEmailInputType,
  AuthCreateUserInputType,
  AuthResendEmailInputType,
} from '../types/auth/input';

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
        const oldRefreshToken = request.cookies.refreshToken;
        const accessToken = JWTService.generateToken(userId, '10s');
        const refreshToken = await JWTService.generateRefreshToken(userId, oldRefreshToken);
        
        response.cookie('refreshToken', refreshToken, {
          secure: true,
          httpOnly: true,
        });
        
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
        throw new ApiError(
          ResponseStatusCodesEnum.InternalError,
          'Внутренняя ошибка в процессе подвтерждения email'
        );
      }
    } catch (error) {
      next(error);
    }
  }

  static async resendEmail(
    request: RequestType<{}, AuthResendEmailInputType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const email = request.body.email;

      const result = await UserService.resendEmail(email);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        throw new ApiError(
          ResponseStatusCodesEnum.InternalError,
          'Не удалось поторно отправить письмо'
        );
      }
    } catch (error) {
      console.error(error);

      next(error);
    }
  }

  static async refresh(request: RequestType<{}, {}>, response: Response, next: NextFunction) {
    try {
      const oldRefreshToken = request.cookies.refreshToken;

      if (!oldRefreshToken) {
        throw ApiError.UnauthorizedError();
      }

      const userData =  await JWTService.validateRefreshToken(oldRefreshToken);

      if (typeof userData === 'string' || !userData) {
        throw ApiError.UnauthorizedError();
      }

      const userId = userData.id;

      const newRefreshToken = await JWTService.generateRefreshToken(userId, oldRefreshToken);
      const accessToken = JWTService.generateToken(userId, '10s');

      response.cookie('refreshToken', newRefreshToken, {
        secure: true,
        httpOnly: true,
      });

      response.send({ accessToken });
    } catch (error) {
      next(error);
    }
  }

  static async logout(request: RequestType<{}, {}>, response: Response, next: NextFunction) {
    try {
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }

      const userData = await JWTService.validateRefreshToken(refreshToken);

      if (!userData || !userData.id) {
        throw ApiError.UnauthorizedError();
      }

      const userId = userData.id;

      const result = await UserService.logout(refreshToken, userId);

      if (result) {
        response.send(ResponseStatusCodesEnum.NoContent);
      } else {
        response.send(ResponseStatusCodesEnum.Unathorized);
      }
    } catch (error) {
      next(error);
    }
  }
}
