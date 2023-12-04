export class BlogDataManager {
  static createCorrectBlog() {
    return {
      description: 'My blog for testing blogs',
      name: 'Blog for tests',
      websiteUrl: 'https://my-test-blog-with-correct-data.com',
    };
  }

  static createBlogFullOfIncorrectData() {
    return {
      name: null,
      description: [1, 2, 3],
      websiteUrl: 'google',
    }
  }

  static getResponseFullOfErrors() {
    return [
      { message: 'Invalid value', field: 'name' },
      { message: 'Invalid value', field: 'description' },
      { message: 'Invalid websiteUrl field', field: 'websiteUrl' },
    ];
  }

  static createCorrectUpdatedBlog() {
    return {
      description: 'My updated Blog',
      name: 'Great blog',
      websiteUrl: 'https://blog.ru',
    }
  }
}