import { type WithId } from 'mongodb';

import { type BlogType, type QueryBlogOutputModel } from './output';

export class BlogMapper implements QueryBlogOutputModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  constructor({ _id, name, description, websiteUrl, createdAt, isMembership }: WithId<BlogType>) {
    this.id = _id.toString();
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = createdAt;
    this.isMembership = isMembership;
  }
}
