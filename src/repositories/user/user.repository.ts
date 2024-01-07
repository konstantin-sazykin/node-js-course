import { ObjectId } from 'mongodb';

import { userCollection } from '../../db/db';

import { type CreateUserServiceModel, type QueryUserOutputModel } from '../../types/user/input';
import { type UserDataBaseType } from '../../types/user/output';

import { UserMapper } from './../../types/user/mapper';

export class UserRepository {
  static async createUser(user: CreateUserServiceModel): Promise<QueryUserOutputModel | null> {
    try {
      const result = await userCollection.insertOne({
        login: user.login,
        email: user.email,
        passwordSalt: user.passwordSalt,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        isConfirmed: user.isConfirmed,
      });

      const createdUser = await userCollection.findOne({ _id: result.insertedId });

      if (!createdUser) {
        return null;
      }

      return { ...new UserMapper(createdUser) };
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  static async checkUserByLoginOrEmail(loginOrEmail: string): Promise<UserDataBaseType | null> {
    try {
      const user = await userCollection.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await userCollection.deleteOne({ _id: new ObjectId(id) });

      return !!result.deletedCount;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  static async confirmEmail(email: string): Promise<boolean> {
    try {
      const result = await userCollection.updateOne({ email }, { $set: { isConfirmed: true } });

      return !!result.modifiedCount;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
