import { CommentPaths } from './Routes/comment.paths';
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
import { UserDataManager } from './dataManager/user.data-manager';
import { CommentOutputType } from '../../src/types/comment/output';
import { PostRepository } from '../../src/repositories/post/post.repository';

describe('/comments', () => {
  let newPost: QueryPostOutputModel | null = null;
  let newBlog: QueryBlogOutputModel;
  let newComment: CommentOutputType;

  const UserA = {
    login: '',
    password: '',
  };

  const UserB = {
    login: '',
    password: '',
  };

  let accessUserAToken: string;
  let accessUserBToken: string;

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
    
    newPost = await PostRepository.create({ ...createdPost, blogName: newBlog.name  });
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
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it('should not create comment with incorrect content', async () => {
    if (!newPost?.id) {
      throw Error('Can not test comment without post');
    }
    const result = await request(app)
      .post(PostRoutes.commentsForPost(newPost.id))
      .send(CommentDataManager.incorrectCommentData)
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should create comment with correct content', async () => {
    if (!newPost?.id) {
      throw Error('Can not test comment without post');
    }
    const result = await request(app)
      .post(PostRoutes.commentsForPost(newPost.id))
      .send(CommentDataManager.correctCommentData)
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Created);

    newComment = { ...result.body };
  });

  it('should not update comment with incorrect id', async () => {
    const result = await request(app)
      .put(CommentPaths.commentById(CommentDataManager.incorrectId))
      .send(CommentDataManager.correctCommentData)
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it('should not update comment with incorrect content', async () => {
    const result = await request(app)
      .put(CommentPaths.commentById(newComment.id))
      .send(CommentDataManager.incorrectCommentData)
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should not update someone`s else comment', async () => {
    const result = await request(app)
      .put(CommentPaths.commentById(newComment.id))
      .send(CommentDataManager.updatedCommentData)
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserBToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Forbidden);
  });

  it('should update comment', async () => {
    const result = await request(app)
      .put(CommentPaths.commentById(newComment.id))
      .send(CommentDataManager.updatedCommentData)
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    newComment.content = CommentDataManager.updatedCommentData.content;

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
  });

  it('should not return comment witn incorrect id', async () => {
    const result = await request(app)
      .get(CommentPaths.commentById(CommentDataManager.incorrectId))
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it('should return new comment', async () => {
    const result = await request(app)
      .get(CommentPaths.commentById(newComment.id))
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    expect(result.body).toEqual(newComment);
  });

  it('should not delete comment with incorrect id', async () => {
    const result = await request(app)
      .delete(CommentPaths.commentById(CommentDataManager.incorrectId))
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it('should not delete comment without auth header', async () => {
    const result = await request(app).delete(CommentPaths.commentById(newComment.id));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should not delete someone`s else comment ', async () => {
    const result = await request(app)
      .delete(CommentPaths.commentById(newComment.id))
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserBToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Forbidden);
  });

  it('should delete new comment ', async () => {
    const result = await request(app)
      .delete(CommentPaths.commentById(newComment.id))
      .set('Authorization', UserDataManager.getCorrectAuthHeader(accessUserAToken));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
  });
});
