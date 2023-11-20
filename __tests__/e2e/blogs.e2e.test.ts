import { BlogType } from './../../src/types/blog/output';
import request from 'supertest';

import { ResponseStatusCodesEnum, RoutesPathsEnum } from '../../src/utils/constants';
import { app } from '../../src/settings';

describe('/blogs', () => {
  const authHeaderString = `Basic ${btoa('admin:qwerty')}`;
  let newBlog: BlogType | null = null;

  beforeAll(() => {
    request(app).delete(RoutesPathsEnum.testingAllData).expect(204);
  });

  it('should return empty blog array', async () => {
    const blogResult = await request(app).get(RoutesPathsEnum.blogs);

    expect(blogResult.body).toEqual([]);
  });

  it(`should'nt return blog with incorrect id`, async () => {
    const blogResult = await request(app).get(`${RoutesPathsEnum.blogs}/4444-4444`);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it(`should'nt create blog without auth header`, async () => {
    const createdBlog = {
      name: 'Test',
      description: 'Some Blog Description',
      websiteUrl: 'https://some-url.com',
    };

    const blogResult = await request(app).post(RoutesPathsEnum.blogs).send(createdBlog);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should create blog with correct data', async () => {
    const createdBlog = {
      name: 'Test',
      description: 'Some Blog Description',
      websiteUrl: 'https://some-url.com',
    };

    const blogResult = await request(app)
      .post(RoutesPathsEnum.blogs)
      .send(createdBlog)
      .set('Authorization', authHeaderString);

    newBlog = blogResult.body;

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.Created);

    expect({
      name: blogResult.body.name,
      description: blogResult.body.description,
      websiteUrl: blogResult.body.websiteUrl,
    }).toEqual(createdBlog);
  });

  it('should`nt return new blog', async () => {
    const blogReqult = await request(app).get(`${RoutesPathsEnum.blogs}/${newBlog?.id}`);

    expect(blogReqult.body).toEqual(newBlog);
  });

  it('should update blog with correct data', async () => {
    const updatedBlog = {
      name: 'New name',
      description: 'Changed Blog Description',
      websiteUrl: 'https://updated-url.com',
    };

    const blogResult = await request(app)
      .put(`${RoutesPathsEnum.blogs}/${newBlog?.id}`)
      .send(updatedBlog)
      .set('Authorization', authHeaderString);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NoContent);

    const updatedBlogResult = await request(app).get(`${RoutesPathsEnum.blogs}/${newBlog?.id}`);

    expect({
      name: updatedBlogResult.body.name,
      description: updatedBlogResult.body.description,
      websiteUrl: updatedBlogResult.body.websiteUrl,
    }).toEqual(updatedBlog);

    newBlog = { ...updatedBlogResult.body };
  });

  it('should`nt update blog with incorrect data', async () => {
    const updatedBlog = {
      name: null,
      description: [1, 2, 3],
      websiteUrl: 'google',
    };

    const expectedErrors = [
      { message: 'Invalid value', field: 'name' },
      { message: 'Invalid value', field: 'description' },
      { message: 'Invalid websiteUrl field', field: 'websiteUrl' },
    ];

    const blogResult = await request(app)
      .put(`${RoutesPathsEnum.blogs}/${newBlog?.id}`)
      .send(updatedBlog)
      .set('Authorization', authHeaderString);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);

    expect(blogResult.body.errorsMessages).toEqual(expectedErrors);
  });

  it(`should'nt delete blog without auth header`, async () => {
    const blogResult = await request(app).delete(`${RoutesPathsEnum.blogs}/${newBlog?.id}`);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);

    const unDeletedPostResult = await request(app).get(`${RoutesPathsEnum.blogs}/${newBlog?.id}`);

    expect(unDeletedPostResult.body).toEqual(newBlog);
  });

  it(`should'nt delete blog with incorrect id`, async () => {
    const blogResult = await request(app)
      .delete(`${RoutesPathsEnum.blogs}/tpgldfserq-112dfd-4412113`)
      .set('Authorization', authHeaderString);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NotFound);

    const unDeletedPostResult = await request(app).get(`${RoutesPathsEnum.blogs}/${newBlog?.id}`);

    expect(unDeletedPostResult.body).toEqual(newBlog);
  });

  it(`should delete blog with auth header`, async () => {
    const blogResult = await request(app)
      .delete(`${RoutesPathsEnum.blogs}/${newBlog?.id}`)
      .set('Authorization', authHeaderString);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NoContent);

    const allBlogsResult = await request(app).get(RoutesPathsEnum.blogs);

    expect(allBlogsResult.body).toEqual([]);
  });
});
