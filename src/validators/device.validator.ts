import { type NextFunction, type Request, type Response } from 'express';
import { type ValidationChain, param, validationResult } from 'express-validator';

import { ResponseStatusCodesEnum } from '../utils/constants';
import { ApiError } from '../exeptions/api.error';
import { SessionQueryRepository } from '../repositories/session/session.query-repository';

const deviceIdParamValidation = param('id').custom(async (deviceId: string, { req }) => {
  const userId: string = req.userId;
  const session = await SessionQueryRepository.find(deviceId);

  if (!session) {
    throw new Error(`Device с id ${deviceId} не найден`);
  };

  if (session.userId !== userId) {
    throw new Error('Нет прав для удаления');
  }
});

export const requestParamsValidation = (request: Request, response: Response, next: NextFunction): void => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    next(new ApiError(ResponseStatusCodesEnum.Forbidden, null)); return;
  }

  next();
};

export const deleteDeviceByIdValidation = (): [
  ValidationChain,
  (request: Request, response: Response, next: NextFunction) => void,
] => [
  deviceIdParamValidation,
  requestParamsValidation,
];
