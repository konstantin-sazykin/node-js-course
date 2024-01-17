import { type NextFunction, type Response } from 'express';

import { type QueryRequestType, type RequestType } from '../types/common';
import { type CreateUserControllerType, type UserQuerySortDataType } from '../types/user/input';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { UserSortData } from '../utils/SortData';
import { type UserQueryRepository } from '../repositories/user/user.query-repository';
import { ApiError } from '../exeptions/api.error';
import { type UserService } from '../domain/user.service';

export class UserController {
  constructor(protected userService: UserService, protected userQueryRepository: UserQueryRepository) {};
  async post(
    request: RequestType<{}, CreateUserControllerType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const result = await this.userService.createUser(
        request.body.login,
        request.body.email,
        request.body.password,
        true,
      );

      if (!result) {
        throw ApiError.BadRequest(null, 'Email or login are already exists');
      }

      response.status(ResponseStatusCodesEnum.Created).send(result);
    } catch (error) {
      console.error(error);

      next(error);
    }
  }

  async delete(
    request: RequestType<{ id: string; }, {}>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const id = request.params.id;

      const result = await this.userService.remove(id);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        response.sendStatus(ResponseStatusCodesEnum.NotFound);
      }
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    request: QueryRequestType<{}, UserQuerySortDataType>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const sortData = new UserSortData(request.query);

      const result = await this.userQueryRepository.findAll(sortData);

      response.send(result);
    } catch (error) {
      next(error);
    }
  }
}
