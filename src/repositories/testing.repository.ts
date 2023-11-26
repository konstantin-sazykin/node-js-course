import { blogCollection, postCollection } from "../db/db";
import { videoDb } from "../routers/videos.router";

export class TestingRepository {
  static async clearAllData() {
    try {
      videoDb.videos = [];
      await blogCollection.drop();
      await postCollection.drop();
      return true;
    } catch (error) {
      return false;
    }
  }
}
