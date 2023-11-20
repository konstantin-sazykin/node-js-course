import { CreateBlogInputModel } from './../../src/types/blog/input';
import { CreatePostInputModel } from './../../src/types/post/input';
import { PostType } from './../../src/types/post/output';
import { BlogType } from './../../src/types/blog/output';
import request from 'supertest';

import { ResponseStatusCodesEnum, RoutesPathsEnum } from '../../src/utils/constants';
import { app } from '../../src/settings';

describe(RoutesPathsEnum.posts, () => {
  const authHeaderString = `Basic ${btoa('admin:qwerty')}`;
  let newBlog: BlogType | null = null;
  let newPost: PostType | null = null;

  beforeAll(async () => {
    request(app).delete(RoutesPathsEnum.testingAllData).expect(204);

    const createdBlog: CreateBlogInputModel = {
      name: 'New Blog',
      description: 'New Blog For Testing Posts',
      websiteUrl: 'https://test-com.lt',
    };

    const blogResult = await request(app)
      .post(RoutesPathsEnum.blogs)
      .send(createdBlog)
      .set('Authorization', authHeaderString);

    newBlog = blogResult.body;
  });

  it('should return empty posts array', async () => {
    const postResult = await request(app).get(RoutesPathsEnum.posts);

    expect(postResult.body).toEqual([]);
  });

  it(`should'nt return post with incorrect id`, async () => {
    const blogResult = await request(app).get(`${RoutesPathsEnum.posts}/4444-4444`);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it(`should'nt create post without auth header`, async () => {
    const createdPost: CreatePostInputModel = {
      title: 'Some title',
      content: 'Some content',
      blogId: newBlog!.id,
      shortDescription: 'Some short description',
    };

    const postResult = await request(app).post(RoutesPathsEnum.posts).send(createdPost);

    expect(postResult.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should create post with correct data', async () => {
    const createdPost: CreatePostInputModel = {
      title: 'Some title',
      content: 'Some content',
      blogId: newBlog!.id,
      shortDescription: 'Some short description',
    };

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

  it('should`nt update post with incorrect data', async () => {
    const updatedPost = {
      title: null,
      content: 123,
      blogId: newBlog!.id + 12,
      shortDescription: [],
    };

    const expectedErrors = [
      { message: 'Invalid value', field: 'title' },
      { message: 'Invalid value', field: 'shortDescription' },
      { message: 'Invalid value', field: 'content' },
      { message: 'Invalid blogId field', field: 'blogId' },
    ];

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
    const updatedPost = {
      title: 'Updated Title',
      content: 'New Content for this post',
      blogId: newBlog!.id,
      shortDescription: 'New short description',
    };

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

    const allPostssResult = await request(app).get(RoutesPathsEnum.posts);

    expect(allPostssResult.body).toEqual([]);
  });
});
