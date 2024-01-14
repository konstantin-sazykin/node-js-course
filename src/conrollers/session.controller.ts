import { type NextFunction, type Response } from 'express';

import { type RequestType } from '../types/common';
import { ApiError } from '../exeptions/api.error';
import { type QuerySessionIdType } from '../types/session/input';
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
      const userId: string | null = request.userId;

      if (!userId) {
        throw ApiError.UnauthorizedError();
      }

      const result = await SessionQueryRepository.findAll(userId);

      response.send(result);
    } catch (error) {
      console.error(error);

      next(error);
    }
  }

  static async removeAllSessions(request: RequestType<{}, {}>, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string | null = request.userId;
      const currentSessionId = request.sessionId;

      if (!userId || !currentSessionId) {
        throw ApiError.UnauthorizedError();
      }

      const result = await SessionService.deleteManySessions(userId, currentSessionId);

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

  static async removeById(request: RequestType<QuerySessionIdType, {}>, response: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId: string = request.params.id;

      const result = await SessionService.deleteSession(sessionId);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        response.sendStatus(ResponseStatusCodesEnum.NotFound);
      }
    } catch (error) {
      console.error(error);

      next(error);
    }
  }
}
