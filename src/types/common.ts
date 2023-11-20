import { type Request } from 'express';

export type RequestType<P, B> = Request<P, {}, B, {}>;

export interface ErrorMessageType {
  field: string;
  message: string;
}

export interface ErrorType {
  errorsMessages: ErrorMessageType[];
}

