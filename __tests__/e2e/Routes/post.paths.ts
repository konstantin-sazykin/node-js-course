import { RoutesPathsEnum } from "../../../src/utils/constants";

export class PostRoutes {
  static get wrongPostId() {
    return '657ed050278820c5dd2919lb'
  }
  static commentsForPost(postId: string) {
    return `${RoutesPathsEnum.posts}/${postId}/comments`;
  }
}