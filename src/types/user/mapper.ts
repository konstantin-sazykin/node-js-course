import { type UserDataBaseType } from './output';

export class UserMapper {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  constructor({ _id, login, email, createdAt }: UserDataBaseType) {
    this.id = _id.toString();
    this.login = login;
    this.email = email;
    this.createdAt = createdAt.toISOString();
  }
}

export class UserShortInfoDto {
  userId: string;
  login: string;
  email: string;

  constructor({ _id, login, email }: UserDataBaseType) {
    this.userId = _id.toString();
    this.login = login;
    this.email = email;
  }
}
