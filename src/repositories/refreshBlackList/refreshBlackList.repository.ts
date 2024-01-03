import { refreshBlackListCollection } from "../../db/db";

export class RefreshBlackListRepository {
  static async create(token: string, userId: string) {
    try {
      const result = await refreshBlackListCollection.insertOne({ refresh: token, userId });

      return result.acknowledged;
    } catch (error) {
      console.error(error);
      
      return false;
    }
  }
}