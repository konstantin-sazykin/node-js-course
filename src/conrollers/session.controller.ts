import { type NextFunction, type Response } from 'express';

import { type RequestType } from '../types/common';
import { ApiError } from '../exeptions/api.error';
import { type QuerySessionIdType } from '../types/session/input';
import { JWTService } from '../application/jwt.service';
import { SessionQueryRepository } from '../repositories/session/session.query-repository';
import { SessionService } from '../domain/session.service';
import { ResponseStatusCodesEnum } from '../utils/constants';

export class SessionController {
  static async getAllSessions(
    request: RequestType<{}, {}>,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken: string = request.cookies.refreshToken;

      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }

      const jwtPayload = JWTService.validateToken(refreshToken);

      if (!jwtPayload) {
        throw ApiError.UnauthorizedError();
      }

      const userId: string = jwtPayload.userId;

      const result = await SessionQueryRepository.findAll(userId);

      response.send(result);
    } catch (error) {
      console.error(error);

      next(error);
    }
  }

  static async removeAllSessions(request: RequestType<{}, {}>, response: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken: string = request.cookies.refreshToken;

      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }

      const jwtPayload = JWTService.validateToken(refreshToken);

      if (!jwtPayload) {
        throw ApiError.UnauthorizedError();
      }

      const userId: string = jwtPayload.userId;

      const result = await SessionService.deleteAllSessions(userId);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        response.sendStatus(ResponseStatusCodesEnum.Unathorized);
      }
    } catch (error) {
      console.error(error);

      next(error);
    }
  }

  // Вкрутить проверку в МВ если пользователь тот и пробросить сюда ид
  static async removeById(request: RequestType<QuerySessionIdType, {}>, response: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId: string = request.params.id;

      const result = await SessionService.deleteSession(sessionId);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        response.sendStatus(ResponseStatusCodesEnum.NotFound); // Мб стоит сменить
      }
    } catch (error) {
      console.error(error);

      next(error);
    }
  }
}
