import { VideoType } from '../../src/types/video/output';
import { BlogType } from '../types/blog/output';

type DBType = {
  videos: VideoType[];
  blogs: BlogType[];
  defaultUser: {
    login: string;
    password: string;
  };
};

export const db: DBType = {
  videos: [],
  blogs: [],
  defaultUser: {
    login: 'admin',
    password: 'qwerty',
  },
};
