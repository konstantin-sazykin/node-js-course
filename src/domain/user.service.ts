import bcrypt from 'bcrypt';

import { CreateUserServiceModel, QueryUserOutputModel } from '../types/user/input';
import { UserRepository } from '../repositories/user/user.repository';

export class UserService {
  static async createUser(login: string, email: string, password: string): Promise<QueryUserOutputModel | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.createHash(password, passwordSalt);

    const newUser: CreateUserServiceModel = {
      login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date(),
    };

    const result = await UserRepository.createUser(newUser);

    return result;
  }

  static async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
    const user = await UserRepository.checkUserBuLoginOrEmail(loginOrEmail);

    if (!user) {
      return false;
    }

    const passwordHash = await this.createHash(password, user.passwordSalt);

    return passwordHash === user.passwordHash;
  }

  private static async createHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
