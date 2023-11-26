import { WithId } from 'mongodb';
import { PostType, QueryPostOutputModel } from "./output";

export class PostMapper implements QueryPostOutputModel {
  public id: string;
  public blogId: string;
  public blogName: string | undefined;
  public content: string;
  public shortDescription: string;
  public title: string;
  public createdAt?: string | undefined;

  constructor(video: WithId<PostType>) {
    const { _id, blogId, blogName, content, shortDescription, title, createdAt } = video;

    this.id = _id.toString();
    this.blogId = blogId;
    this.blogName = blogName;
    this.content = content;
    this.shortDescription = shortDescription;
    this.title = title;
    this.createdAt = createdAt;
  }
}