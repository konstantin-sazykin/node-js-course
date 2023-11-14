import { ErrorMessageType, ErrorType, ResponseStatusCodesEnum } from '../types/common';

export class ApiError {
  status;
  errors;
  message;

  constructor(status: number, message: string, errors: ErrorMessageType[] = []) {
    this.errors = errors;
    this.status = status;
    this.message = message;
  }

  static UnauthorizedError() {
    return new ApiError(ResponseStatusCodesEnum.Unathorized, 'Пользователь неавторизован');
  }

  static BadRequest(message: string, errors: ErrorMessageType[] = []) {
    return new ApiError(ResponseStatusCodesEnum.BadRequest, message, errors);
  }

  static AccessError() {
    return new ApiError(
      ResponseStatusCodesEnum.Forbidden,
      'Действие доступно только администраторам'
    );
  }
}
