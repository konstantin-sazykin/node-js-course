import { ObjectId } from 'mongodb';

import { CommentDataBaseDto } from '../../types/comment/mapper';
import { type WithPaginationDataType } from '../../types/common';
import { type CommentSortData } from '../../utils/SortData';
import { CommentModel } from '../../models/comment.model';

export class CommentQueryRepository {
  async getAllByPostId(
    postId: string,
    sortData: CommentSortData,
  ): Promise<WithPaginationDataType<CommentDataBaseDto>> {
    const { sortBy, sortDirection, skip, limit, pageNumber } = sortData;

    const comments = await CommentModel
      .find({ postId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit);

    const totalCount = await CommentModel.countDocuments({ postId });
    const pagesCount = Math.ceil(totalCount / limit);

    const items = comments.map((comm) => ({ ...new CommentDataBaseDto(comm) }));

    return {
      pagesCount,
      totalCount,
      page: pageNumber,
      pageSize: limit,
      items,
    };
  }

  async find(id: string): Promise<CommentDataBaseDto | null> {
    const result = await CommentModel.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return null;
    }
    return { ...new CommentDataBaseDto(result) };
  }
}
