import { ObjectId } from "mongodb";

export interface UserType {
  email: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
}


export interface UserDataBaseType {
  _id: ObjectId;
  email: string;
  login: string;
  createdAt: Date;
  passwordHash: string;
  passwordSalt: string;
}

export interface QueryUserOutputType {
  id: string;
  email: string;
  login: string;
  createdAt: string;
}

export interface UserAuthQueryType {
  loginOrEmail: string;
  password: string;
}