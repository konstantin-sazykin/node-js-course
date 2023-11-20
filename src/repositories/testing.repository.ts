import { db } from '../db/db';

export class TestingRepository {
  static clearAllData() {
    try {
      db.blogs = [];
      db.videos = [];

      return true;
    } catch (error) {
      return false;
    }
  }
}
