import { NextFunction, Response } from 'express';
import { RequestType } from '../types/common';
import { CreateUserControllerType } from '../types/user/input';
import { UserService } from '../domain/user.service';
import { ResponseStatusCodesEnum } from '../utils/constants';

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
        request.body.password
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
}
