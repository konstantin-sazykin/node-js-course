import bcrypt from 'bcrypt';

import { CreateUserServiceModel, QueryUserOutputModel } from '../types/user/input';
import { UserRepository } from '../repositories/user/user.repository';
import { EmailAdapter } from '../adapters/email.adapter';
import { EmailViewCreator } from '../utils/emailViewCreator';
import { JWTService } from '../application/jwt.service';
export class UserService {
  static async createUser(
    login: string,
    email: string,
    password: string,
    createdBySuperAdmin: boolean = false
  ): Promise<QueryUserOutputModel | null> {
    try {
      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this.createHash(password, passwordSalt);

      if (!createdBySuperAdmin) {
        const token = JWTService.generateToken(email, '24h');

        const { subject, template } = EmailViewCreator.confirmation(token);

        const isEmailSended = await EmailAdapter.sendEmail(email, subject, template);
        
        if (!isEmailSended) {
          throw new Error('Подтверждение не отправлено');
        }
      }

      const newUser: CreateUserServiceModel = {
        login,
        email,
        passwordHash,
        passwordSalt,
        isConfirmed: createdBySuperAdmin,
        createdAt: new Date(),
      };

      const result = await UserRepository.createUser(newUser);

      return result;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  static async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
    const user = await UserRepository.checkUserBuLoginOrEmail(loginOrEmail);

    if (!user) {
      return null;
    }

    const passwordHash = await this.createHash(password, user.passwordSalt);

    if (passwordHash === user.passwordHash) {
      return user._id.toString();
    } else {
      return null;
    }
  }

  static async confirmEmail(email: string): Promise<boolean> {
    const isConfirmed = await UserRepository.confirmEmail(email);

    return isConfirmed;
  }

  private static async createHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  static async delete(id: string): Promise<boolean> {
    const isDeleted = await UserRepository.deleteUser(id);

    return isDeleted;
  }
}
