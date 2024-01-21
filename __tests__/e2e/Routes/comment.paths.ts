import { RoutesPathsEnum } from '../../../src/utils/constants';

export class CommentPaths {
  static commentById(id: string) {
    return `${RoutesPathsEnum.comments}/${id}`;
  }

  static likeForCommentById(id: string) {
    return `${RoutesPathsEnum.comments}/${id}/like-status`;
  }
}
