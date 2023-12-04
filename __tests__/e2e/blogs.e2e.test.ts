import { BlogType, QueryBlogOutputModel } from './../../src/types/blog/output';
import request from 'supertest';

import { ResponseStatusCodesEnum, RoutesPathsEnum } from '../../src/utils/constants';
import { app } from '../../src/settings';
import { closeDbConnection, launchDb } from '../../src/db/db';
import { TestingRepository } from '../../src/repositories/testing.repository';
import { BlogDataManager } from './dataManager/blog.data-manager';
import { CreateBlogInputModel } from '../../src/types/blog/input';
import { PostDataManager } from './dataManager/post.data-manager';
import { BlogPaths } from './Routes/blog.paths';

describe('/blogs', () => {
  const authHeaderString = `Basic ${btoa('admin:qwerty')}`;
  let newBlog: QueryBlogOutputModel | null = null;

  beforeAll(async () => {
    await launchDb();

    await TestingRepository.clearAllData();

    request(app).delete(RoutesPathsEnum.testingAllData).expect(204);
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  it('should return empty blog array', async () => {
    const blogResult = await request(app).get(BlogPaths.index);

    expect(blogResult.body.items).toEqual([]);
  });

  it(`should'nt return blog with incorrect id`, async () => {
    const blogResult = await request(app).get(BlogPaths.blogWithIncorrectId);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it(`should'nt create blog without auth header`, async () => {
    const createdBlog: CreateBlogInputModel = BlogDataManager.createCorrectBlog();

    const blogResult = await request(app).post(BlogPaths.index).send(createdBlog);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should create blog with correct data', async () => {
    const createdBlog: CreateBlogInputModel = BlogDataManager.createCorrectBlog();

    const blogResult = await request(app)
      .post(BlogPaths.index)
      .send(createdBlog)
      .set('Authorization', authHeaderString);

    newBlog = { ...blogResult.body };

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.Created);

    expect({
      name: blogResult.body.name,
      description: blogResult.body.description,
      websiteUrl: blogResult.body.websiteUrl,
    }).toEqual(createdBlog);
  });

  it('should return empty list if incorrect page', async () => {
    const result = await request(app).get(BlogPaths.indexWithPaginationAndSearch(2, 10));

    expect(result.body?.items).toEqual([]);
  });

  it('should return empty list if incorrect searchNameTerm', async () => {
    const result = await request(app).get(
      BlogPaths.indexWithPaginationAndSearch(1, 10, { field: 'searchNameTerm', value: 'sett' })
    );

    expect(result.body?.items).toEqual([]);
  });

  it('should return list with new post if correct searchNameTerm', async () => {
    const result = await request(app).get(
      BlogPaths.indexWithPaginationAndSearch(1, 10, { field: 'searchNameTerm', value: 'test' })
    );

    expect(result.body?.items[0]).toEqual(newBlog);
  });

  it('should return list with new post', async () => {
    const result = await request(app).get(BlogPaths.indexWithPaginationAndSearch(1, 10));

    expect(result.body?.items[0]).toEqual(newBlog);
  });

  it('should return new blog', async () => {
    const blogReqult = await request(app).get(BlogPaths.blogWithId(newBlog?.id));

    expect(blogReqult.body).toEqual(newBlog);
  });

  it('should update blog with correct data', async () => {
    const updatedBlog = BlogDataManager.createCorrectUpdatedBlog();

    const blogResult = await request(app)
      .put(BlogPaths.blogWithId(newBlog?.id))
      .send(updatedBlog)
      .set('Authorization', authHeaderString);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NoContent);

    const updatedBlogResult = await request(app).get(BlogPaths.blogWithId(newBlog?.id));

    expect({
      name: updatedBlogResult.body.name,
      description: updatedBlogResult.body.description,
      websiteUrl: updatedBlogResult.body.websiteUrl,
    }).toEqual(updatedBlog);

    newBlog = { ...updatedBlogResult.body };
  });

  it('should`nt update blog with incorrect data', async () => {
    const updatedBlog = BlogDataManager.createBlogFullOfIncorrectData();

    const expectedErrors = BlogDataManager.getResponseFullOfErrors();

    const blogResult = await request(app)
      .put(BlogPaths.blogWithId(newBlog?.id))
      .send(updatedBlog)
      .set('Authorization', authHeaderString);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);

    expect(blogResult.body.errorsMessages).toEqual(expectedErrors);
  });

  it('should not create post for newBlog without auth headers', async () => {
    const createdPost = PostDataManager.createCorrectPost();

    const result = await request(app)
      .post(BlogPaths.postWithBlogId(newBlog?.id))
      .send(createdPost);
    
    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should not create post for newBlog with incorrect blogId', async () => {
    const createdPost = PostDataManager.createCorrectPost();

    const result = await request(app)
      .post(BlogPaths.postWithBlogId('63189b06003380064c4193be'))
      .send(createdPost)
      .set('Authorization', authHeaderString);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it('should not create post for newBlog with incorrect data', async () => {
    const createdPost = PostDataManager.createPostFullOfIncorrectData();

    const result = await request(app)
      .post(BlogPaths.postWithBlogId(newBlog?.id))
      .send(createdPost)
      .set('Authorization', authHeaderString);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);

    expect(result.body.errorsMessages).toEqual(PostDataManager.getResponseFullOfErrors())
  });

  it('should create post for newBlog with correct data', async () => {
    const createdPost = PostDataManager.createCorrectPost();

    const result = await request(app)
      .post(BlogPaths.postWithBlogId(newBlog?.id))
      .send(createdPost)
      .set('Authorization', authHeaderString);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Created);
  });

  it('should not return posts for blog with incorrect id', async () => {
    const result = await request(app)
      .get(BlogPaths.postWithBlogId('63189b06003380064c4193be'))
    
    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it('should return new post for blog with correct data', async () => {
    const result = await request(app)
    .get(BlogPaths.postWithBlogId(newBlog?.id))
  
  expect(result.body.items.length).toBe(1);
  })

  it(`should'nt delete blog without auth header`, async () => {
    const blogResult = await request(app).delete(BlogPaths.blogWithId(newBlog?.id));

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);

    const unDeletedBlogResult = await request(app).get(BlogPaths.blogWithId(newBlog?.id));

    expect(unDeletedBlogResult.body).toEqual(newBlog);
  });

  it(`should'nt delete blog with incorrect id`, async () => {
    const blogResult = await request(app)
      .delete(BlogPaths.blogWithId('63189b06003380064c4193be'))
      .set('Authorization', authHeaderString);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NotFound);

    const unDeletedBlogResult = await request(app).get(BlogPaths.blogWithId(newBlog?.id));

    expect(unDeletedBlogResult.body).toEqual(newBlog);
  });

  it(`should delete blog with auth header`, async () => {
    const blogResult = await request(app)
      .delete(BlogPaths.blogWithId(newBlog?.id))
      .set('Authorization', authHeaderString);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NoContent);

    const deletedBlog = await request(app).get(BlogPaths.blogWithId(newBlog?.id));

    expect(deletedBlog.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });
});
