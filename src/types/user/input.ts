import { type QuerySortDataType } from './../common';

export interface CreateUserServiceModel {
  email: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
  isConfirmed: boolean;
}

export interface CreateUserControllerType {
  email: string;
  login: string;
  password: string;
}

export interface QueryUserOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export type UserQuerySortDataType = QuerySortDataType & {
  searchLoginTerm: string;
  searchEmailTerm: string;
};
