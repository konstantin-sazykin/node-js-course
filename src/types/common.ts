import { Request, Response } from 'express';

export type RequestType<P, B> = Request<P, {}, B, {}>;

type ErrorMessageType = {
  field: string;
  message: string;
};

export type ErrorType = {
  errorsMessages: ErrorMessageType[];
};