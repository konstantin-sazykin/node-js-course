import { WithId } from 'mongodb';
import { type Request } from 'express';

export type RequestType<P, B> = Request<P, {}, B, {}>;

export interface ErrorMessageType {
  field: string;
  message: string;
}

export interface ErrorType {
  errorsMessages: ErrorMessageType[];
}

export type WithCreatedAt<T> = T & {
  createdAt: string
}

// мб и не нужен
export type WithIdAndCreatedAt<T> = WithId<T> & {
  createdAt: string;
}