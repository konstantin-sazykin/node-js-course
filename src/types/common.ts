import { type WithId } from 'mongodb';
import { type Response, type Request } from 'express';

export type RequestType<P, B> = Request<P, {}, B, {}>;
export type QueryRequestType<P, Q> = Request<P, {}, {}, Q>;
export interface ErrorMessageType {
  field: string;
  message: string;
}

export interface ErrorType {
  errorsMessages: ErrorMessageType[];
}

export type WithCreatedAt<T> = T & {
  createdAt: string;
};

// Мб и не нужен
export type WithIdAndCreatedAt<T> = WithId<T> & {
  createdAt: string;
};

export interface QuerySortDataType {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: string;
  pageSize?: string;
};

export interface WithPaginationDataType<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export type ResponseWithPagination<T> = Response<WithPaginationDataType<T>>;
