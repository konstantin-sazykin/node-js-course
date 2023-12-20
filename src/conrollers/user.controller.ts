import { NextFunction, Response } from 'express';
import { QueryRequestType, RequestType } from '../types/common';
import { CreateUserControllerType, UserQuerySortDataType } from '../types/user/input';
import { UserService } from '../domain/user.service';
import { ResponseStatusCodesEnum } from '../utils/constants';
import { UserSortData } from '../utils/SortData';
import { UserQueryRepository } from '../repositories/user/user.query-repository';

export class UserController {
  static async post(
    request: RequestType<{}, CreateUserControllerType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const result = await UserService.createUser(
        request.body.login,
        request.body.email,
        request.body.password,
        true,
      );

      if (!result) {
        response.send(ResponseStatusCodesEnum.BadRequest);
      }

      response.status(ResponseStatusCodesEnum.Created).send(result);
    } catch (error) {
      console.error(error);

      next(error);
    }
  }

  static async delete(
    request: RequestType<{ id: string }, {}>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const id = request.params.id;

      const result = await UserService.delete(id);

      if (result) {
        response.sendStatus(ResponseStatusCodesEnum.NoContent);
      } else {
        response.sendStatus(ResponseStatusCodesEnum.NotFound);
      }
    } catch (error) {
      next(error);
    }
  }

  static async getAll(
    request: QueryRequestType<{}, UserQuerySortDataType>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const sortData = new UserSortData(request.query);

      const result = await UserQueryRepository.findAll(sortData);

      response.send(result);
    } catch (error) {
      next(error);
    }
  }
}
