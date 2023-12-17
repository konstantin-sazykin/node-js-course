import { CommentQueryRepository } from '../repositories/comment/comment.query-repository';
import { CommentRepository } from '../repositories/comment/comment.repository';
import { UserQueryRepository } from '../repositories/user/user.query-repository';
import { CommentMapper } from '../types/comment/mapper';
import { CommentOutputType } from '../types/comment/output';
import { WithPaginationDataType } from '../types/common';
import { CommentSortData } from '../utils/SortData';

export class CommentService {
  static async createComment(
    postId: string,
    userId: string,
    content: string
  ): Promise<CommentOutputType | null> {
    const createdComment = await CommentRepository.create(postId, userId, content);
    const user = await UserQueryRepository.findUserById(userId);

    if (!createdComment || !user) {
      return null;
    }

    return {
      ...new CommentMapper({ ...createdComment, userId: user.userId, userLogin: user.login }),
    };
  }

  static async findCommentsForPost(
    postId: string,
    sortData: CommentSortData
  ): Promise<WithPaginationDataType<CommentOutputType>> {
    const result = await CommentQueryRepository.getAllByPostId(postId, sortData);

    const promises = result.items.map(async (comm) => {
      const user = await UserQueryRepository.findUserById(comm.commentatorId);
      if (!user) {
        throw Error(`Не найден юзер с id ${comm.commentatorId}`);
      }
      const userLogin = user?.login;
      const userId = user?.userId;

      return { ...new CommentMapper({ ...comm, userId, userLogin }) };
    });

    const items = await Promise.all(promises);

    return {
      pagesCount: result.pagesCount,
      page: result.page,
      pageSize: result.pageSize,
      totalCount: result.totalCount,
      items: items,
    };
  }
}
