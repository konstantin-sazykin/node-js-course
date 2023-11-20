import { QueryPostOutputModel } from "@/types/post/output";

export class PostDTO implements QueryPostOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogName: string;
  blogId: string;

  constructor({ id, title, shortDescription, content, blogName, blogId }: QueryPostOutputModel) {
    this.id = id;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogName = blogName;
    this.blogId = blogId;
  }
}