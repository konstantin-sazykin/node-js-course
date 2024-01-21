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
import { LikesInfoEnum } from '../../src/types/like/output';
import { UserDataManager } from './dataManager/user.data-manager';
import { AuthPaths } from './Routes/auth.paths';

describe(RoutesPathsEnum.posts, () => {
  const authHeaderString = `Basic ${btoa('admin:qwerty')}`;
  let newPost: QueryPostOutputModel | null = null;
  let newBlog: QueryBlogOutputModel;
  let accessUserAToken: string;
  let accessUserBToken: string;
  const UserA = {
    login: '',
    password: '',
  };

  const UserB = {
    login: '',
    password: '',
  };

  beforeAll(async () => {
    await launchDb();

    await TestingRepository.clearAllData();

    const createdBlog: CreateBlogInputModel = BlogDataManager.createCorrectBlog();

    const blogResult = await BlogRepository.createBlog(createdBlog);

    if (blogResult) {
      newBlog = { ...blogResult };
    } else {
      throw new Error('Can`t create new Blog for testing posts');
    }

    request(app).delete(RoutesPathsEnum.testingAllData).expect(204);

    const userAData = UserDataManager.usersForTestingSearch.userA;
    const userBData = UserDataManager.usersForTestingSearch.userB;

    const userAResult = await request(app)
      .post(RoutesPathsEnum.user)
      .send(UserDataManager.usersForTestingSearch.userA)
      .set(...UserDataManager.adminHeader);

    const userBResult = await request(app)
      .post(RoutesPathsEnum.user)
      .send(UserDataManager.usersForTestingSearch.userB)
      .set(...UserDataManager.adminHeader);

    if (userAResult && userBResult) {
      UserA.login = userAData.login;
      UserA.password = userAData.password;

      UserB.login = userBData.login;
      UserB.password = userBData.password;
    } else {
      throw new Error('Can`t create users for testing comments');
    }

    const authUserAResult = await request(app)
      .post(AuthPaths.index)
      .send({ loginOrEmail: UserA.login, password: UserA.password });

    const authUserBResult = await request(app)
      .post(AuthPaths.index)
      .send({ loginOrEmail: UserB.login, password: UserB.password });

    if (authUserAResult && authUserBResult) {
      accessUserAToken = authUserAResult.body.accessToken;
      accessUserBToken = authUserBResult.body.accessToken;
    } else {
      throw new Error('Can`t create new Blog for testing comments');
    }
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
    const incorrectPost: CreatePostWithBlogIdInputModel =
      PostDataManager.createWithIncorrectBlogIdPost();

    const postResult = await request(app).post(RoutesPathsEnum.posts).send(incorrectPost);

    expect(postResult.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should create post with correct data', async () => {
    const createdPost: CreatePostWithBlogIdInputModel = PostDataManager.createCorrectPostWithBlogId(
      newBlog.id
    );

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

  it(`should not create like for new post`, async () => {
    const blogResult = await request(app)
      .put(`${RoutesPathsEnum.posts}/${newPost?.id}/like-status`)
      .send({ likeStatus: [] })
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it(`should create dislike for new post`, async () => {
    const blogResult = await request(app)
      .put(`${RoutesPathsEnum.posts}/${newPost?.id}/like-status`)
      .send({ likeStatus: LikesInfoEnum.Dislike })
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
  });

  it(`should create like for new post`, async () => {
    const blogResult = await request(app)
      .put(`${RoutesPathsEnum.posts}/${newPost?.id}/like-status`)
      .send({ likeStatus: LikesInfoEnum.Like })
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserBToken));

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
  });

  it('should return empty list if incorrect page', async () => {
    const result = await request(app).get(`${RoutesPathsEnum.posts}?pageSize=10&pageNumber=2`);

    expect(result.body?.items).toEqual([]);
  });

  it('should return list with new post', async () => {
    const result = await request(app).get(`${RoutesPathsEnum.posts}?pageSize=10&pageNumber=1`);

    expect(result.body?.items[0].id).toBe(newPost?.id);
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
    const blogResult = await request(app)
      .get(`${RoutesPathsEnum.posts}/${newPost?.id}`)
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserBToken));

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.Ok);

    expect(blogResult.body.id).toEqual(newPost?.id);
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
