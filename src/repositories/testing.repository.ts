import { blogCollection, commentCollection, postCollection, userCollection } from '../db/db';
import { videoDb } from '../routers/videos.router';

export class TestingRepository {
  static async clearAllData(): Promise<boolean> {
    try {
      videoDb.videos = [];

      await blogCollection.deleteMany({});
      await postCollection.deleteMany({});
      await userCollection.deleteMany({});
      await commentCollection.deleteMany({});
      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
