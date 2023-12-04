import { blogCollection, postCollection } from "../db/db";
import { videoDb } from "../routers/videos.router";

export class TestingRepository {
  static async clearAllData() {
    try {
      videoDb.videos = [];
      
      // if (blogCollection) {
        await blogCollection.deleteMany({});
      // }

      // if (postCollection) {
        await postCollection.deleteMany({});
      // }
      
      return true;
    } catch (error) {
      console.log(error);
      
      return false;
    }
  }
}
