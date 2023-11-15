import { ErrorMessageType, ErrorType, ResponseStatusCodesEnum } from '../types/common';

export class ApiError {
  status;
  errors;
  message;

  constructor(status: number, message: string | null, errors: ErrorMessageType[] = []) {
    this.errors = errors;
    this.status = status;
    this.message = message;
  }

  static UnauthorizedError() {
    return new ApiError(ResponseStatusCodesEnum.Unathorized, 'Пользователь неавторизован');
  }

  static BadRequest(errors: ErrorMessageType[] | null, message: string | null = 'Непредвиденная ошибка') {
    if (errors?.length) {
      return new ApiError(ResponseStatusCodesEnum.BadRequest, null, errors);  
    }
    
    return new ApiError(ResponseStatusCodesEnum.BadRequest, message)
  }

  static AccessError() {
    return new ApiError(
      ResponseStatusCodesEnum.Forbidden,
      'Действие доступно только администраторам'
    );
  }
}
