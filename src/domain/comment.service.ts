import { CommentQueryRepository } from '../repositories/comment/comment.query-repository';
import { CommentRepository } from '../repositories/comment/comment.repository';
import { UserQueryRepository } from '../repositories/user/user.query-repository';
import { CommentMapper } from '../types/comment/mapper';
import { type CommentOutputType } from '../types/comment/output';
import { type WithPaginationDataType } from '../types/common';
import { type CommentSortData } from '../utils/SortData';

export class CommentService {
  static async getComment(id: string): Promise<CommentOutputType | null> {
    const comment = await CommentQueryRepository.find(id);

    if (!comment) {
      return null;
    }
    const user = await UserQueryRepository.findUserById(comment.commentatorId);

    return {
      ...new CommentMapper({
        ...comment,
        userId: user?.userId ?? 'Unknown user',
        userLogin: user?.login ?? 'Unknown user',
      }),
    };
  }

  static async createComment(
    postId: string,
    userId: string,
    content: string,
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
    sortData: CommentSortData,
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
      items,
    };
  }

  static async update(id: string, content: string): Promise<boolean> {
    const result = await CommentRepository.update(id, content);

    return result;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await CommentRepository.remove(id);

    return result;
  }
}
