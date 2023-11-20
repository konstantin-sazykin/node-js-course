import { ApiError } from '@/exeptions/api.error';
import { ResponseStatusCodesEnum } from '@/utils/constants';
import { TestingRepository } from '@/repositories/testing.repository';
import { NextFunction, Request, Response, Router } from 'express';

export const testingRouter = Router();

testingRouter.delete('/', (request: Request, response: Response, next: NextFunction) => {
  const isAllDataCleared = TestingRepository.clearAllData();

  if (isAllDataCleared) {
    response.sendStatus(ResponseStatusCodesEnum.NoContent);
  } else {
    next(ApiError.BadRequest(null, 'Ошибка удаления данных'));
  }
});
