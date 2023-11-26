import { blogCollection, postCollection } from "../db/db";
import { videoDb } from "../routers/videos.router";

export class TestingRepository {
  static async clearAllData() {
    try {
      videoDb.videos = [];
      
      if (blogCollection) {
        await blogCollection.drop().catch(err => console.log(err));
      }

      if (postCollection) {
        await postCollection.drop().catch(err => console.log(err));
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }
}
