import { AuthDataManger } from './dataManager/auth.data-manager';
import { AuthPaths } from './Routes/auth.paths';
import request from 'supertest';
import { closeDbConnection, launchDb } from '../../src/db/db';
import { TestingRepository } from '../../src/repositories/testing.repository';
import { app } from '../../src/settings';
import { PostRoutes } from './Routes/post.paths';
import { ResponseStatusCodesEnum, RoutesPathsEnum } from '../../src/utils/constants';
import { QueryPostOutputModel } from '../../src/types/post/output';
import { CreateBlogInputModel } from '../../src/types/blog/input';
import { BlogDataManager } from './dataManager/blog.data-manager';
import { BlogRepository } from '../../src/repositories/blog/blog.repository';
import { QueryBlogOutputModel } from '../../src/types/blog/output';
import { PostDataManager } from './dataManager/post.data-manager';
import { CreatePostWithBlogIdInputModel } from '../../src/types/post/input';
import { CommentDataManager } from './dataManager/comment.data-manager';
import { UserService } from '../../src/domain/user.service';
import { UserDataManager } from './dataManager/user.data-manager';
import { CommentOutputType } from '../../src/types/comment/output';

describe('/comments', () => {
  let newPost: QueryPostOutputModel | null = null;
  let newBlog: QueryBlogOutputModel;
  let newComment: CommentOutputType;

  const newUser = {
    login: '',
    password: '',
  };

  let accessToken: string;

  const simpleAuthHeaderString = `Basic ${btoa('admin:qwerty')}`;

  beforeAll(async () => {
    await launchDb();

    await TestingRepository.clearAllData();

    const createdBlog: CreateBlogInputModel = BlogDataManager.createCorrectBlog();

    const blogResult = await BlogRepository.createBlog(createdBlog);

    if (blogResult) {
      newBlog = { ...blogResult };
    } else {
      throw new Error('Can`t create new Blog for testing comments');
    }

    const createdPost: CreatePostWithBlogIdInputModel = PostDataManager.createCorrectPostWithBlogId(
      newBlog.id
    );

    const postResult = await request(app)
      .post(RoutesPathsEnum.posts)
      .send(createdPost)
      .set('Authorization', simpleAuthHeaderString);

    if (postResult) {
      newPost = { ...postResult.body };
    } else {
      throw new Error('Can`t create new Post for testing comments');
    }

    const userData = UserDataManager.correctUser;
    const userResult = await UserService.createUser(
      userData.login,
      userData.email,
      userData.password
    );

    if (userResult) {
      newUser.login = userData.login;
      newUser.password = userData.password;
    } else {
      throw new Error('Can`t create new Blog for testing comments');
    }

    const authResult = await request(app)
      .post(AuthPaths.index)
      .send({ loginOrEmail: newUser.login, password: newUser.password });

    if (authResult) {
      accessToken = authResult.body.accessToken;
    } else {
      throw new Error('Can`t create new Blog for testing comments');
    }
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  it('should not return data with incorrect post id', async () => {
    const result = await request(app).get(PostRoutes.commentsForPost(PostRoutes.wrongPostId));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it('should return empty array for correct post without any comments', async () => {
    if (!newPost?.id) {
      throw Error('Can not test comment without post');
    }
    const result = await request(app).get(PostRoutes.commentsForPost(newPost.id));

    expect(result.body.items).toEqual([]);
  });

  it('should not create new comment without auth header', async () => {
    if (!newPost?.id) {
      throw Error('Can not test comment without post');
    }

    const result = await request(app)
      .post(PostRoutes.commentsForPost(newPost.id))
      .send(CommentDataManager.correctCommentData);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should not create new comment with incorrect post id', async () => {
    const result = await request(app)
      .post(PostRoutes.commentsForPost(PostDataManager.incorrectPostId))
      .send(CommentDataManager.correctCommentData)
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it('should not create comment with incorrect content', async () => {
    if (!newPost?.id) {
      throw Error('Can not test comment without post');
    }
    const result = await request(app)
      .post(PostRoutes.commentsForPost(newPost.id))
      .send(CommentDataManager.incorrectCommentData)
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should create comment with correct content', async () => {
    if (!newPost?.id) {
      throw Error('Can not test comment without post');
    }
    const result = await request(app)
      .post(PostRoutes.commentsForPost(newPost.id))
      .send(CommentDataManager.correctCommentData)
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Created);

    newComment = { ...result.body };
  });
  it('should return array with new comment', async () => {
    if (!newPost?.id) {
      throw Error('Can not test comment without post');
    }

    const result = await request(app).get(PostRoutes.commentsForPost(newPost.id));

    expect(result.body.items[0]).toEqual(newComment);
  });
  // it('should return empty array')
});
