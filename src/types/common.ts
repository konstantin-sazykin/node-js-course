import { Request, Response } from 'express';

export type RequestType<P, B> = Request<P, {}, B, {}>;

export type ErrorMessageType = {
  field: string;
  message: string;
};

export type ErrorType = {
  errorsMessages: ErrorMessageType[];
};

export enum ResponseStatusCodesEnum {
  Ok = 200,
  Created = 201,
  NoContent = 203,
  BadRequest = 400,
  Unathorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalError = 500,
}