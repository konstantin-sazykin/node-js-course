import { type CommentQueryRepository } from '../repositories/comment/comment.query-repository';
import { type CommentRepository } from '../repositories/comment/comment.repository';
import { type UserQueryRepository } from '../repositories/user/user.query-repository';
import { CommentOutputDto } from '../types/comment/mapper';
import { type CommentOutputType } from '../types/comment/output';
import { type WithPaginationDataType } from '../types/common';
import { type CommentSortData } from '../utils/SortData';

export class CommentService {
  constructor(protected userQueryRepository: UserQueryRepository, protected commentRepository: CommentRepository, protected commentQueryRepository: CommentQueryRepository) {};
  async getComment(id: string, currentUserId: string | null): Promise<CommentOutputType | null> {
    const comment = await this.commentQueryRepository.find(id);

    if (!comment) {
      return null;
    }
    const user = await this.userQueryRepository.findUserById(comment.commentatorId);

    if (!user) {
      return null;
    }

    return {
      ...new CommentOutputDto({
        ...comment,
        currentUserId,
        user,
      }),
    };
  }

  async createComment(
    postId: string,
    userId: string,
    content: string,
  ): Promise<CommentOutputType | null> {
    const createdComment = await this.commentRepository.create(postId, userId, content);
    const user = await this.userQueryRepository.findUserById(userId);

    if (!createdComment || !user) {
      return null;
    }

    return {
      ...new CommentOutputDto({ ...createdComment, user, currentUserId: userId }),
    };
  }

  async findCommentsForPost(
    postId: string,
    sortData: CommentSortData,
    currentUserId: string | null,
  ): Promise<WithPaginationDataType<CommentOutputType>> {
    const result = await this.commentQueryRepository.getAllByPostId(postId, sortData);

    const promises = result.items.map(async (comm) => {
      const user = await this.userQueryRepository.findUserById(comm.commentatorId);

      if (!user) {
        throw Error(`Не найден юзер с id ${comm.commentatorId}`);
      }

      return { ...new CommentOutputDto({ ...comm, user, currentUserId }) };
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

  async update(id: string, content: string): Promise<boolean> {
    const result = await this.commentRepository.update(id, content);

    return result;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.commentRepository.remove(id);

    return result;
  }
}
