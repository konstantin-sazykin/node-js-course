import uaParser from 'ua-parser-js';
import { type NextFunction, type Response } from 'express';

import { ApiError } from '../exeptions/api.error';
import { type RequestType } from '../types/common';
import { type UserAuthQueryType } from '../types/user/output';

import { ResponseStatusCodesEnum } from '../utils/constants';
import { JWTService } from '../application/jwt.service';
import { UserQueryRepository } from '../repositories/user/user.query-repository';
import {
  type AuthRecoveryPasswordByEmailInputType,
  type AuthConfirmEmailInputType,
  type AuthCreateUserInputType,
  type AuthResendEmailInputType,
  type AuthCreateNewPasswordByRecoveryCodeInputType,
} from '../types/auth/input';
import { SessionService } from '../domain/session.service';
import { UserService } from '../domain/user.service';

export class AuthController {
  constructor(protected userService: UserService, protected userQueryRepository: UserQueryRepository, protected accessExpiresIn: string) {}
  async postLogin(
    request: RequestType<{}, UserAuthQueryType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { loginOrEmail, password } = request.body;
      const IP = request.ip;
      const userAgent = uaParser(request.headers['user-agent']);
      const {
        browser: { name: browserName, major: browserVersion },
        os: { name: osName, version: osVersion },
      } = userAgent;
      const userId = await this.userService.checkCredentials(loginOrEmail, password);

      if (userId) {
        const accessToken = JWTService.generateToken({ userId }, this.accessExpiresIn);
        const refreshToken = await SessionService.createSession({
          userId,
          browserName,
          browserVersion,
          IP,
          osName,
          osVersion,
        });

        if (!accessToken || !refreshToken) {
          throw new ApiError(
            ResponseStatusCodesEnum.InternalError,
            'Не создан accessToken или refreshToken',
          );
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
      console.error({ error });

      next(error);
    }
  }

  async getUser(request: RequestType<{}, {}>, response: Response, next: NextFunction) {
    try {
      const userId = request.userId;

      if (!userId) {
        next(ApiError.UnauthorizedError());
        return;
      }

      const user = await this.userQueryRepository.findUserById(userId);

      if (!user) {
        next(ApiError.UnauthorizedError());
        return;
      }

      response.send(user);
    } catch (error) {
      console.error(error);
      
      next(error);
    }
  }

  async postRegistration(
    request: RequestType<{}, AuthCreateUserInputType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { email, login, password } = request.body;

      const result = await this.userService.createUser(login, email, password, false);

      if (!result) {
        next(ApiError.BadRequest(null));
        return;
      }

      response.sendStatus(ResponseStatusCodesEnum.NoContent);
    } catch (error) {
      console.error(error);

      next(error);
    }
  }

  async confirmRegistration(
    request: RequestType<{}, AuthConfirmEmailInputType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const result = await this.userService.confirmEmail(request.body.code);
      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        throw new ApiError(
          ResponseStatusCodesEnum.InternalError,
          'Внутренняя ошибка в процессе подвтерждения email',
        );
      }
    } catch (error) {
      next(error);
    }
  }

  async resendEmail(
    request: RequestType<{}, AuthResendEmailInputType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const email = request.body.email;

      const result = await this.userService.resendEmail(email);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        throw new ApiError(
          ResponseStatusCodesEnum.InternalError,
          'Не удалось поторно отправить письмо',
        );
      }
    } catch (error) {
      console.error(error);

      next(error);
    }
  }

  async refresh(request: RequestType<{}, {}>, response: Response, next: NextFunction) {
    try {
      const oldRefreshToken: string = request.cookies.refreshToken;

      if (!oldRefreshToken) {
        throw ApiError.UnauthorizedError();
      }

      const sessionData = JWTService.validateToken(oldRefreshToken);

      if (typeof sessionData === 'string' || !sessionData) {
        throw ApiError.UnauthorizedError();
      }

      const userId: string = sessionData.userId;
      const sessionId: string = sessionData.sessionId;
      const extendedAt: string = sessionData.extendedAt;

      const newRefreshToken = await SessionService.updateSession(sessionId, extendedAt);

      if (!newRefreshToken) {
        throw ApiError.UnauthorizedError();
      }

      const accessToken = JWTService.generateToken({ userId }, this.accessExpiresIn);

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

  async logout(request: RequestType<{}, {}>, response: Response, next: NextFunction) {
    try {
      const sessionId: string | null = request.sessionId;

      if (!sessionId) {
        throw ApiError.UnauthorizedError();
      }

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

  async recoveryPassword(
    request: RequestType<{}, AuthRecoveryPasswordByEmailInputType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const email = request.body.email;

      const result = await this.userService.recoveryPassword(email);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        throw new ApiError(
          ResponseStatusCodesEnum.InternalError,
          'Не удалось поторно отправить письмо',
        );
      }
    } catch (error) {
      console.error(error);

      next(error);
    }
  }

  async createNewPassword(
    request: RequestType<{}, AuthCreateNewPasswordByRecoveryCodeInputType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { newPassword, recoveryCode } = request.body;

      const jwtPayload = JWTService.validateToken(recoveryCode);

      if (typeof jwtPayload === 'string' || !jwtPayload?.email) {
        throw ApiError.BadRequest(null, 'Recovery code is wrong');
      }

      const result = await this.userService.createPassword(newPassword, jwtPayload.email as string);

      if (result) {
        response.send(ResponseStatusCodesEnum.NoContent);
      } else {
        response.sendStatus(ResponseStatusCodesEnum.BadRequest);
      }
    } catch (error) {
      console.error(error);

      next(error);
    }
  }
}
