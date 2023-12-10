export interface CreateUserServiceModel {
  email: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
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
