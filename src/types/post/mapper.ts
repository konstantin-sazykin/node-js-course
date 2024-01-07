import { type WithId } from 'mongodb';

import { type PostType, type QueryPostOutputModel } from './output';

export class PostMapper implements QueryPostOutputModel {
  public id: string;
  public blogId: string;
  public blogName: string;
  public content: string;
  public shortDescription: string;
  public title: string;
  public createdAt: string;

  constructor(post: WithId<PostType>) {
    const { _id, blogId, blogName, content, shortDescription, title, createdAt } = post;

    this.id = _id.toString();
    this.blogId = blogId;
    this.blogName = blogName;
    this.content = content;
    this.shortDescription = shortDescription;
    this.title = title;
    this.createdAt = createdAt;
  }
}
