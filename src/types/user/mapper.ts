import { QueryUserOutputModel } from './input';
import { UserDataBaseType } from './output';

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
