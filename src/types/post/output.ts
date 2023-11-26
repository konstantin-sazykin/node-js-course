export type PostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
  createdAt?: string;
  isMembership?: boolean;
};

export type QueryPostOutputModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
  createdAt?: string;
  isMembership?: boolean;
};
