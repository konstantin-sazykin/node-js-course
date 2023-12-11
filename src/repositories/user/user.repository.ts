import { UserMapper } from './../../types/user/mapper';
import { userCollection } from '../../db/db';
import { CreateUserServiceModel, QueryUserOutputModel } from '../../types/user/input';
import { UserDataBaseType } from '../../types/user/output';
import { ObjectId } from 'mongodb';

export class UserRepository {
  static async createUser(user: CreateUserServiceModel): Promise<QueryUserOutputModel | null> {
    try {
      const result = await userCollection.insertOne({
        login: user.login,
        email: user.email,
        passwordSalt: user.passwordSalt,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
      });

      const createdUser = await userCollection.findOne({ _id: result.insertedId });

      if (!createdUser) {
        return null;
      }

      return { ... new UserMapper(createdUser) }
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  static async checkUserBuLoginOrEmail(loginOrEmail: string): Promise<UserDataBaseType | null> {
    try {
      const user = await userCollection.findOne({ $or: [ { login: loginOrEmail }, { email: loginOrEmail } ] });

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
}
