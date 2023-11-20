import { ApiError } from 'src/exeptions/api.error';
import { ResponseStatusCodesEnum } from 'src/utils/constants';
import { TestingRepository } from 'src/repositories/testing.repository';
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
