import { NextFunction, Request, Response, Router } from 'express';
import { TestingRepository } from '../repositories/testing.repository';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { ApiError } from '../exeptions/api.error';

export const testingRouter = Router();

testingRouter.delete('/', (request: Request, response: Response, next: NextFunction) => {
  const isAllDataCleared = TestingRepository.clearAllData();

  if (isAllDataCleared) {
    response.sendStatus(ResponseStatusCodesEnum.NoContent);
  } else {
    next(ApiError.BadRequest(null, 'Ошибка удаления данных'));
  }
});
