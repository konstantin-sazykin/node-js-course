import bcrypt from 'bcrypt';

import { type CreateUserServiceModel, type QueryUserOutputModel } from '../types/user/input';
import { UserRepository } from '../repositories/user/user.repository';
import { EmailAdapter } from '../adapters/email.adapter';
import { EmailViewCreator } from '../utils/emailViewCreator';
import { JWTService } from '../application/jwt.service';

export class UserService {
  static async createUser(
    login: string,
    email: string,
    password: string,
    createdBySuperAdmin: boolean = false,
  ): Promise<QueryUserOutputModel | null> {
    try {
      const isLoginAlreadyExists = await UserRepository.checkUserByLoginOrEmail(login);
      const isEmailAlreadyExists = await UserRepository.checkUserByLoginOrEmail(email);

      if (isEmailAlreadyExists || isLoginAlreadyExists) {
        return null;
      }

      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this.createHash(password, passwordSalt);

      if (!createdBySuperAdmin) {
        const token = JWTService.generateToken({ email }, '24h');

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
    const user = await UserRepository.checkUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return null;
    }

    const passwordHash = await this.createHash(password, user.passwordSalt);

    if (passwordHash === user.passwordHash) {
      return user._id.toString();
    }
    return null;
  }

  static async confirmEmail(code: string): Promise<boolean> {
    const validationResult = JWTService.validateToken(code);

    if (!validationResult || typeof validationResult === 'string') {
      return false;
    }
    const email: string = validationResult.email;
    const isConfirmed = await UserRepository.confirmEmail(email);

    return isConfirmed;
  }

  static async resendEmail(email: string): Promise<boolean> {
    const token = JWTService.generateToken({ email }, '24h');

    const { subject, template } = EmailViewCreator.confirmation(token);

    const isEmailSended = await EmailAdapter.sendEmail(email, subject, template);

    if (!isEmailSended) {
      throw new Error('Подтверждение не отправлено');
    }

    return isEmailSended;
  }

  private static async createHash(password: string, salt: string): Promise<string> {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  static async remove(id: string): Promise<boolean> {
    const isDeleted = await UserRepository.deleteUser(id);

    return isDeleted;
  }

  static async recoveryPassword(email: string): Promise<boolean> {
    const token = JWTService.generateToken({ email }, '24h');

    const { subject, template } = EmailViewCreator.recovery(token);

    const isEmailSended = await EmailAdapter.sendEmail(email, subject, template);

    if (!isEmailSended) {
      throw new Error('Сообщение не отправлено');
    }

    return isEmailSended;
  }

  static async createPassword(newPassword: string, email: string): Promise<boolean> {
    const isUserDefined = await UserRepository.checkUserByLoginOrEmail(email);

    if (!isUserDefined) {
      return false;
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.createHash(newPassword, passwordSalt);

    const isChanged = await UserRepository.changePassword(email, passwordHash, passwordSalt);

    return isChanged;
  }
}
