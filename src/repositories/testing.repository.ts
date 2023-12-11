import { blogCollection, postCollection, userCollection } from "../db/db";
import { videoDb } from "../routers/videos.router";

export class TestingRepository {
  static async clearAllData() {
    try {
      videoDb.videos = [];
      
      await blogCollection.deleteMany({});
      await postCollection.deleteMany({});
      await userCollection.deleteMany({});
      return true;
    } catch (error) {
      console.log(error);
      
      return false;
    }
  }
}
