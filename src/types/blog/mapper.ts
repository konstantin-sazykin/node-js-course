import { WithId,  } from 'mongodb';
import { BlogType, QueryBlogOutputModel } from "./output";
import { WithCreatedAt } from '../common';

export class BlogMapper implements QueryBlogOutputModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string | undefined;

  constructor({ _id, name, description, websiteUrl, createdAt }: WithId<BlogType>) {
    this.id = _id.toString();
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = createdAt;
  }
}