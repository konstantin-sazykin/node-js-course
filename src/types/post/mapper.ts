import { type WithId } from 'mongodb';

import { LikesInfoEnum, type ExtendedLikesInfoOutputType, type PostLikeDataBaseOutputType, type NewestLikeInfoOutputType } from '../like/output';

import { type PostType } from './output';

export class PostDataBaseDto {
  public id: string;
  public blogId: string;
  public blogName: string;
  public content: string;
  public shortDescription: string;
  public title: string;
  public createdAt: string;
  public extendedLikesInfo: ExtendedLikesInfoOutputType;

  constructor(
    post: WithId<PostType>,
    currentUserId?: string | null,
    likes: PostLikeDataBaseOutputType[] = [],
    lastLikes: NewestLikeInfoOutputType[] | null = null,
  ) {
    const {
      _id,
      blogId,
      blogName,
      content,
      shortDescription,
      title,
      createdAt,
    } = post;

    this.id = _id.toString();
    this.blogId = blogId;
    this.blogName = blogName;
    this.content = content;
    this.shortDescription = shortDescription;
    this.title = title;
    this.createdAt = createdAt;

    const likesCount = likes.filter((i) => i.status === LikesInfoEnum.Like).length;
    const dislikesCount = likes.filter((i) => i.status === LikesInfoEnum.Dislike).length;
    const myStatus = likes.find((i) => i.userId === currentUserId)?.status ?? LikesInfoEnum.None;

    this.extendedLikesInfo = {
      dislikesCount,
      likesCount,
      myStatus,
      newestLikes: lastLikes,
    };
  }
}
