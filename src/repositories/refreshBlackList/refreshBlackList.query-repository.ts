import { refreshBlackListCollection } from "../../db/db";

export class RefreshBlackListQueryRepository {
  async find(token: string) {
    try {
      const result = await refreshBlackListCollection.findOne({ refresh: token });      

      return result;
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}