import { type VideoType } from 'src/types/video/output';
import { type BlogType } from 'src/types/blog/output';
import { PostType } from 'src/types/post/output';

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
