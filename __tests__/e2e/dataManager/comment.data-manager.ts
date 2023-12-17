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

  static get incorrectId() {
    return '657f088bf3ffe8628112e914';
  }

  static get updatedCommentData() {
    return {
      content: 'it is updated comment`s content',
    };
  }
}
