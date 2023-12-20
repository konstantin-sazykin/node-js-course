import { CreateBlogInputModel } from './../../src/types/blog/input';
import { CreatePostWithBlogIdInputModel } from './../../src/types/post/input';
import { QueryPostOutputModel } from './../../src/types/post/output';
import { QueryBlogOutputModel } from './../../src/types/blog/output';
import request from 'supertest';

import { ResponseStatusCodesEnum, RoutesPathsEnum } from '../../src/utils/constants';
import { app } from '../../src/settings';
import { closeDbConnection, launchDb } from '../../src/db/db';
import { BlogRepository } from '../../src/repositories/blog/blog.repository';
import { TestingRepository } from '../../src/repositories/testing.repository';
import { PostDataManager } from './dataManager/post.data-manager';
import { BlogDataManager } from './dataManager/blog.data-manager';

describe(RoutesPathsEnum.posts, () => {
  const authHeaderString = `Basic ${btoa('admin:qwerty')}`;
  let newPost: QueryPostOutputModel | null = null;
  let newBlog: QueryBlogOutputModel;

  beforeAll(async () => {
    await launchDb();
    
    await TestingRepository.clearAllData();

    const createdBlog: CreateBlogInputModel = BlogDataManager.createCorrectBlog();

    const blogResult = await BlogRepository.createBlog(createdBlog);

    if (blogResult) {
      newBlog = { ...blogResult };
    } else {
      throw new Error('Can`t create new Blog for testing posts')
    }

    request(app).delete(RoutesPathsEnum.testingAllData).expect(204);
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  it('should return empty posts array', async () => {
    const postResult = await request(app).get(RoutesPathsEnum.posts);

    expect(postResult.body.items).toEqual([]);
  });

  it(`should'nt return post with incorrect id`, async () => {
    const blogResult = await request(app).get(`${RoutesPathsEnum.posts}/4444-4444`);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it(`should'nt create post without auth header`, async () => {
    const incorrectPost: CreatePostWithBlogIdInputModel = PostDataManager.createWithIncorrectBlogIdPost();

    const postResult = await request(app).post(RoutesPathsEnum.posts).send(incorrectPost);

    expect(postResult.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should create post with correct data', async () => {
    const createdPost: CreatePostWithBlogIdInputModel = PostDataManager.createCorrectPostWithBlogId(newBlog.id);

    const postResult = await request(app)
      .post(RoutesPathsEnum.posts)
      .send(createdPost)
      .set('Authorization', authHeaderString);

    newPost = postResult.body;

    expect(postResult.statusCode).toBe(ResponseStatusCodesEnum.Created);

    expect({
      title: postResult.body.title,
      content: postResult.body.content,
      blogId: postResult.body.blogId,
      shortDescription: postResult.body.shortDescription,
    }).toEqual(createdPost);
  });

  it('should return empty list if incorrect page', async () => {
    const result = await request(app).get(`${RoutesPathsEnum.posts}?pageSize=10&pageNumber=2`)
    
    expect(result.body?.items).toEqual([]);
  });

  it('should return list with new post', async () => {
    const result = await request(app).get(`${RoutesPathsEnum.posts}?pageSize=10&pageNumber=1`)

    expect(result.body?.items[0]).toEqual(newPost);
  });

  it('should`nt update post with incorrect data', async () => {
    const updatedPost = PostDataManager.createPostFullOfIncorrectDataWithId();

    const expectedErrors = PostDataManager.getResponseFullOfErrorsWithBlogId();

    const postResult = await request(app)
      .put(`${RoutesPathsEnum.posts}/${newPost?.id}`)
      .send(updatedPost)
      .set('Authorization', authHeaderString);

    expect(postResult.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);

    expect(postResult.body.errorsMessages).toEqual(expectedErrors);
  });

  it(`should return post with correct id`, async () => {
    const blogResult = await request(app).get(`${RoutesPathsEnum.posts}/${newPost?.id}`);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.Ok);

    expect(blogResult.body).toEqual(newPost);
  });

  it('should update post with correct data', async () => {
    const updatedPost = PostDataManager.createUpdatedCorrectPost(newBlog.id);

    const postResult = await request(app)
      .put(`${RoutesPathsEnum.posts}/${newPost?.id}`)
      .send(updatedPost)
      .set('Authorization', authHeaderString);

    expect(postResult.statusCode).toBe(ResponseStatusCodesEnum.NoContent);

    const updatedBlogResult = await request(app).get(`${RoutesPathsEnum.posts}/${newPost?.id}`);

    expect({
      title: updatedBlogResult.body.title,
      content: updatedBlogResult.body.content,
      blogId: updatedBlogResult.body.blogId,
      shortDescription: updatedBlogResult.body.shortDescription,
    }).toEqual(updatedPost);

    newPost = { ...updatedBlogResult.body };
  });

  it('should`nt update post with incorrect id', async () => {
    const updatedPost = PostDataManager.createWithIncorrectBlogIdPost();

    const postResult = await request(app)
      .put(`${RoutesPathsEnum.posts}/'1233123-53453512-3445`)
      .send(updatedPost)
      .set('Authorization', authHeaderString);

    expect(postResult.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it('shoul`nt update post with incorrect auth header', async () => {
    const updatedPost = PostDataManager.createPostFullOfIncorrectDataWithId();
    const postResult = await request(app)
      .put(`${RoutesPathsEnum.posts}/'1233123-53453512-3445`)
      .send(updatedPost)
      .set('Authorization', 'Basic admin:qwerty');

    expect(postResult.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it(`should'nt delete post without auth header`, async () => {
    const postResult = await request(app).delete(`${RoutesPathsEnum.posts}/${newPost?.id}`);

    expect(postResult.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);

    const unDeletedPostResult = await request(app).get(`${RoutesPathsEnum.posts}/${newPost?.id}`);

    expect(unDeletedPostResult.body).toEqual(newPost);
  });

  it(`should'nt delete post with incorrect id`, async () => {
    const postResult = await request(app)
      .delete(`${RoutesPathsEnum.posts}/tpgldfserq-112dfd-4412113`)
      .set('Authorization', authHeaderString);

    expect(postResult.statusCode).toBe(ResponseStatusCodesEnum.NotFound);

    const unDeletedPostResult = await request(app).get(`${RoutesPathsEnum.posts}/${newPost?.id}`);

    expect(unDeletedPostResult.body).toEqual(newPost);
  });

  it(`should delete blog with auth header`, async () => {
    const postResult = await request(app)
      .delete(`${RoutesPathsEnum.posts}/${newPost?.id}`)
      .set('Authorization', authHeaderString);

    expect(postResult.statusCode).toBe(ResponseStatusCodesEnum.NoContent);

    const deletedPost = await request(app).get(`${RoutesPathsEnum.posts}/${newPost?.id}`);

    expect(deletedPost.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

});
