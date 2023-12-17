export class CommentDataManager {
  static get correctCommentData() {
    return {
      content: 'it is new comment`s content',
    };
  }

  static get incorrectCommentData() {
    return {
      content: null,
    };
  }
}
