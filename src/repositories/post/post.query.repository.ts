import { ObjectId } from 'mongodb';

import { postCollection } from '../../db/db';
import { PostMapper } from '../../types/post/mapper';
import { type QueryPostOutputModel } from '../../types/post/output';
import { type WithPaginationDataType } from '../../types/common';
import { type PostSortData } from '../../utils/SortData';

export class PostQueryRepository {
  async getAll(
    sortData: PostSortData,
  ): Promise<WithPaginationDataType<QueryPostOutputModel>> {
    const { sortBy, sortDirection, skip, limit, pageNumber } = sortData;
    const posts = await postCollection
      .find({})
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await postCollection.countDocuments({});
    const pagesCount = Math.ceil(totalCount / limit);

    return {
      pagesCount,
      totalCount,
      page: pageNumber,
      pageSize: limit,
      items: posts.map((video) => ({ ...new PostMapper(video) })),
    };
  }

  async getById(id: string): Promise<QueryPostOutputModel | null> {
    try {
      const post = await postCollection.findOne({ _id: new ObjectId(id) });

      if (!post) {
        return null;
      }

      return {
        ...new PostMapper(post),
      };
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async getAllByBlogId(
    blogId: string,
    sortData: PostSortData,
  ): Promise<WithPaginationDataType<QueryPostOutputModel>> {
    const { sortBy, sortDirection, skip, limit, pageNumber } = sortData;
    const posts = await postCollection
      .find({ blogId })
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await postCollection.countDocuments({ blogId });
    const pagesCount = Math.ceil(totalCount / limit);

    return {
      pagesCount,
      totalCount,
      page: pageNumber,
      pageSize: limit,
      items: posts.map((video) => ({ ...new PostMapper(video) })),
    };
  }
}
