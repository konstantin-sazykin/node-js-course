import { type NextFunction, type Request, type Response, Router } from 'express';

import { TestingRepository } from '../repositories/testing.repository';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { ApiError } from '../exeptions/api.error';

export const testingRouter = Router();

testingRouter.delete('/', async (request: Request, response: Response, next: NextFunction) => {
  const isAllDataCleared = await TestingRepository.clearAllData();

  if (isAllDataCleared) {
    response.sendStatus(ResponseStatusCodesEnum.NoContent);
  } else {
    next(ApiError.BadRequest(null, 'Ошибка удаления данных'));
  }
});
