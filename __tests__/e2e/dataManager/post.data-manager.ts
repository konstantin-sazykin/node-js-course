export class PostDataManager {
  static createWithIncorrectBlogIdPost() {
    return {
      title: 'Wrong post title',
      content: 'Wrong post content',
      blogId: '65637ae50e9d04bcf9842c83',
      shortDescription: 'Incorrect post short description',
    };
  }

  static createCorrectPost(blogId: string) {
    return {
      title: 'Correct post title',
      content: 'Correct posts content',
      blogId: blogId,
      shortDescription: 'Correct post short description',
    };
  }

  static createPostFullOfIncorrectData() {
    return {
      title: null,
      content: 123,
      blogId: '65637ae50e9d04bcf9842c83' + 12,
      shortDescription: [],
    };
  }

  static getResponseFullOfErrors() {
    return [
      { message: 'Invalid value', field: 'title' },
      { message: 'Invalid value', field: 'shortDescription' },
      { message: 'Invalid value', field: 'content' },
      { message: 'Invalid value', field: 'blogId' },
    ];
  }

  static createUpdatedCorrectPost(blogId: string) {
    const blog = this.createCorrectPost(blogId);

    blog.title = 'Updated title for correct post';
    blog.content = 'Updated content for correct post';
    blog.shortDescription = 'Updated short description for correct post';

    return blog;
  }
}
