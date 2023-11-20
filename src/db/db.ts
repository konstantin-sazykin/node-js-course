import { BlogType } from "../types/blog/output";
import { PostType } from "../types/post/output";
import { VideoType } from "../types/video/output";

interface DBType {
  videos: VideoType[];
  blogs: BlogType[];
  posts: PostType[];
  defaultUser: {
    login: string;
    password: string;
  };
}

export const db: DBType = {
  videos: [],
  blogs: [],
  posts: [],
  defaultUser: {
    login: 'admin',
    password: 'qwerty',
  },
};
