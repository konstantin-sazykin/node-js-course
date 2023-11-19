import { type VideoType } from '@/types/video/output';
import { type BlogType } from '@/types/blog/output';

interface DBType {
  videos: VideoType[];
  blogs: BlogType[];
  defaultUser: {
    login: string;
    password: string;
  };
}

export const db: DBType = {
  videos: [],
  blogs: [],
  defaultUser: {
    login: 'admin',
    password: 'qwerty',
  },
};
