import { NextFunction, Request, Response } from 'express';
import uaParser from 'ua-parser-js';
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
import { SessionService } from '../domain/session.service';

export class AuthController {
  static async postLogin(
    request: RequestType<{}, UserAuthQueryType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { loginOrEmail, password } = request.body;
      const IP = request.header('x-forwarded-for');
      const userAgent = uaParser(request.headers['user-agent']);
      const { browser: { name: browserName, major: browserVersion }, os: { name: osName, version: osVersion } } = userAgent;
      const userId = await UserService.checkCredentials(loginOrEmail, password);

      if (userId) {
        const accessToken = JWTService.generateToken({ userId }, '10s');
        const refreshToken = await SessionService.createSession({ userId, browserName, browserVersion, IP, osName, osVersion })
        
        if (!accessToken || !refreshToken) {
          throw new ApiError(ResponseStatusCodesEnum.InternalError, 'Не создан accessToken или refreshToken');
        }

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

      const sessionData =  JWTService.validateToken(oldRefreshToken);

      if (typeof sessionData === 'string' || !sessionData) {
        throw ApiError.UnauthorizedError();
      }

      const { userId, sessionId, extendedAt } = sessionData;
      const newRefreshToken = await SessionService.updateSession(sessionId, extendedAt);

      if (!newRefreshToken) {
        throw ApiError.UnauthorizedError();
      }

      const accessToken = JWTService.generateToken({ userId }, '10s');

      response.cookie('refreshToken', newRefreshToken, {
        secure: true,
        httpOnly: true,
      });

      response.send({ accessToken });
    } catch (error) {
      console.error(error);
      
      next(error);
    }
  }

  static async logout(request: RequestType<{}, {}>, response: Response, next: NextFunction) {
    try {
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }

      const sessionData = JWTService.validateToken(refreshToken);

      if (typeof sessionData === 'string' || !sessionData) {
        throw ApiError.UnauthorizedError();
      }

      const { sessionId } = sessionData;

      const result = await SessionService.deleteSession(sessionId);

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
