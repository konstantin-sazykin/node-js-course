import { ObjectId, type WithId } from 'mongodb';

import { postCollection } from '../../db/db';
import { PostDataBaseDto } from '../../types/post/mapper';
import { type WithPaginationDataType } from '../../types/common';
import { type PostSortData } from '../../utils/SortData';
import { type PostType } from '../../types/post/output';
import { LikeQueryRepository } from '../like/like.query-repository';
import { UserQueryRepository } from '../user/user.query-repository';
import { LikesInfoEnum } from '../../types/like/output';

export class PostQueryRepository {
  async getAll(
    sortData: PostSortData,
    userId: string | null,
  ): Promise<WithPaginationDataType<PostDataBaseDto>> {
    const { sortBy, sortDirection, skip, limit, pageNumber } = sortData;
    const posts = await postCollection
      .find({})
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await postCollection.countDocuments({});
    const pagesCount = Math.ceil(totalCount / limit);

    const promises = posts.map(async (post: WithId<PostType>): Promise<PostDataBaseDto> => {
      const likes = await new LikeQueryRepository().getLikesByPostId(post._id.toString());

      const lastLikesPromises = likes.filter(l => l.status === LikesInfoEnum.Like).slice(-3).reverse().map(async (like) => {
        const user = await new UserQueryRepository().findUserById(like.userId);

        return {
          addedAt: like.addedAt,
          userId: like.userId,
          login: user?.login ?? 'Unknown user',
        };
      });

      const newestLikes = await Promise.all(lastLikesPromises);

      return {
        ...new PostDataBaseDto(post, userId, likes, newestLikes),
      };
    });

    const items = await Promise.all(promises);

    return {
      pagesCount,
      totalCount,
      page: pageNumber,
      pageSize: limit,
      items,
    };
  }

  async getById(id: string, userId?: string | null): Promise<PostDataBaseDto | null> {
    try {
      const post = await postCollection.findOne({ _id: new ObjectId(id) });

      if (!post) {
        return null;
      }
      const likes = await new LikeQueryRepository().getLikesByPostId(post._id.toString());

      const lastLikesPromises = likes.filter(l => l.status === LikesInfoEnum.Like).slice(-3).reverse().map(async (like) => {
        const user = await new UserQueryRepository().findUserById(like.userId);

        return {
          addedAt: like.addedAt,
          userId: like.userId,
          login: user?.login ?? 'Unknown user',
        };
      });

      const newestLikes = await Promise.all(lastLikesPromises);

      return {
        ...new PostDataBaseDto(post, userId, likes, newestLikes),
      };
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async getAllByBlogId(
    blogId: string,
    sortData: PostSortData,
    userId: string | null,
  ): Promise<WithPaginationDataType<PostDataBaseDto>> {
    const { sortBy, sortDirection, skip, limit, pageNumber } = sortData;
    const posts = await postCollection
      .find({ blogId })
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await postCollection.countDocuments({ blogId });
    const pagesCount = Math.ceil(totalCount / limit);

    const promises = posts.map(async (post: WithId<PostType>): Promise<PostDataBaseDto> => {
      const likes = await new LikeQueryRepository().getLikesByPostId(post._id.toString());

      const lastLikesPromises = likes.filter(l => l.status === LikesInfoEnum.Like).slice(-3).reverse().map(async (like) => {
        const user = await new UserQueryRepository().findUserById(like.userId);

        return {
          addedAt: like.addedAt,
          userId: like.userId,
          login: user?.login ?? 'Unknown user',
        };
      });

      const newestLikes = await Promise.all(lastLikesPromises);

      return {
        ...new PostDataBaseDto(post, userId, likes, newestLikes),
      };
    });

    const items = await Promise.all(promises);

    return {
      pagesCount,
      totalCount,
      page: pageNumber,
      pageSize: limit,
      items,
    };
  }
}
