import bcrypt from 'bcrypt';

import { type CreateUserServiceModel, type QueryUserOutputModel } from '../types/user/input';
import { EmailAdapter } from '../adapters/email.adapter';
import { EmailViewCreator } from '../utils/emailViewCreator';
import { JWTService } from '../application/jwt.service';
import { type UserRepository } from '../repositories/user/user.repository';

export class UserService {
  constructor(protected userRepository: UserRepository) {}
  async createUser(
    login: string,
    email: string,
    password: string,
    createdBySuperAdmin: boolean = false,
  ): Promise<QueryUserOutputModel | null> {
    try {
      const isLoginAlreadyExists = await this.userRepository.checkUserByLoginOrEmail(login);
      const isEmailAlreadyExists = await this.userRepository.checkUserByLoginOrEmail(email);

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

      const result = await this.userRepository.createUser(newUser);

      return result;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
    const user = await this.userRepository.checkUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return null;
    }

    const passwordHash = await this.createHash(password, user.passwordSalt);

    if (passwordHash === user.passwordHash) {
      return user._id.toString();
    }
    return null;
  }

  async confirmEmail(code: string): Promise<boolean> {
    const validationResult = JWTService.validateToken(code);

    if (!validationResult || typeof validationResult === 'string') {
      return false;
    }
    const email: string = validationResult.email;
    const isConfirmed = await this.userRepository.confirmEmail(email);

    return isConfirmed;
  }

  async resendEmail(email: string): Promise<boolean> {
    const token = JWTService.generateToken({ email }, '24h');

    const { subject, template } = EmailViewCreator.confirmation(token);

    const isEmailSended = await EmailAdapter.sendEmail(email, subject, template);

    if (!isEmailSended) {
      throw new Error('Подтверждение не отправлено');
    }

    return isEmailSended;
  }

  private async createHash(password: string, salt: string): Promise<string> {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async remove(id: string): Promise<boolean> {
    const isDeleted = await this.userRepository.deleteUser(id);

    return isDeleted;
  }

  async recoveryPassword(email: string): Promise<boolean> {
    const token = JWTService.generateToken({ email }, '24h');

    const { subject, template } = EmailViewCreator.recovery(token);

    const isEmailSended = await EmailAdapter.sendEmail(email, subject, template);

    if (!isEmailSended) {
      throw new Error('Сообщение не отправлено');
    }

    return isEmailSended;
  }

  async createPassword(newPassword: string, email: string): Promise<boolean> {
    const isUserDefined = await this.userRepository.checkUserByLoginOrEmail(email);

    if (!isUserDefined) {
      return false;
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.createHash(newPassword, passwordSalt);

    const isChanged = await this.userRepository.changePassword(email, passwordHash, passwordSalt);

    return isChanged;
  }
}
