import { type Request } from 'express';

export type RequestType<P, B> = Request<P, {}, B, {}>;

export interface ErrorMessageType {
  field: string;
  message: string;
}

export interface ErrorType {
  errorsMessages: ErrorMessageType[];
}

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
