import { ObjectId } from 'mongodb';
import { commentCollection } from '../../db/db';
import { CommentDbMapper, CommentMapper } from '../../types/comment/mapper';
import { CommentRepositoryType } from '../../types/comment/output';
import { WithPaginationDataType } from '../../types/common';
import { CommentSortData } from '../../utils/SortData';

export class CommentQueryRepository {
  static async getAllByPostId(
    postId: string,
    sortData: CommentSortData
  ): Promise<WithPaginationDataType<CommentRepositoryType>> {
    const { sortBy, sortDirection, skip, limit, pageNumber } = sortData;

    const comments = await commentCollection
      .find({ postId })
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await commentCollection.countDocuments({ postId });
    const pagesCount = Math.ceil(totalCount / limit);

    const items = comments.map((comm) => ({ ...new CommentDbMapper(comm) }));

    return {
      pagesCount,
      totalCount,
      page: pageNumber,
      pageSize: limit,
      items,
    };
  }

  static async find(id: string): Promise<CommentRepositoryType | null> {
    const result = await commentCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return null;
    }
    return { ...new CommentDbMapper(result) };
  }
}
