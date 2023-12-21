import { ObjectId } from "mongodb";

export interface UserType {
  email: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
  isConfirmed: boolean;
}


export interface UserDataBaseType {
  _id: ObjectId;
  email: string;
  login: string;
  createdAt: Date;
  passwordHash: string;
  passwordSalt: string;
  isConfirmed: boolean;
}

export interface QueryUserOutputType {
  id: string;
  email: string;
  login: string;
  createdAt: string;
}

export interface QueryUserShortInfoOutputModel {
  userId: string;
  email: string;
  login: string;
}

export interface UserAuthQueryType {
  loginOrEmail: string;
  password: string;
}