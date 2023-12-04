import { BlogType, QueryBlogOutputModel } from './../../src/types/blog/output';
import request from 'supertest';

import { ResponseStatusCodesEnum, RoutesPathsEnum } from '../../src/utils/constants';
import { app } from '../../src/settings';
import { closeDbConnection, launchDb } from '../../src/db/db';
import { TestingRepository } from '../../src/repositories/testing.repository';
import { BlogDataManager } from './dataManager/blog.data-manager';
import { CreateBlogInputModel } from '../../src/types/blog/input';

describe('/blogs', () => {
  const authHeaderString = `Basic ${btoa('admin:qwerty')}`;
  let newBlog: QueryBlogOutputModel | null = null;

  beforeAll( async () => {
    await launchDb();
    
    await TestingRepository.clearAllData();

    request(app).delete(RoutesPathsEnum.testingAllData).expect(204);
  });
  
  afterAll(async () => {
    await closeDbConnection();
  });

  it('should return empty blog array', async () => {
    const blogResult = await request(app).get(RoutesPathsEnum.blogs);

    expect(blogResult.body.items).toEqual([]);
  });

  it(`should'nt return blog with incorrect id`, async () => {
    const blogResult = await request(app).get(`${RoutesPathsEnum.blogs}/4444-4444`);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it(`should'nt create blog without auth header`, async () => {
    const createdBlog: CreateBlogInputModel = BlogDataManager.createCorrectBlog();

    const blogResult = await request(app).post(RoutesPathsEnum.blogs).send(createdBlog);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should create blog with correct data', async () => {
    const createdBlog: CreateBlogInputModel = BlogDataManager.createCorrectBlog();

    const blogResult = await request(app)
      .post(RoutesPathsEnum.blogs)
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

  it('should return new blog', async () => {
    const blogReqult = await request(app).get(`${RoutesPathsEnum.blogs}/${newBlog?.id}`);

    expect(blogReqult.body).toEqual(newBlog);
  });

  it('should update blog with correct data', async () => {
    const updatedBlog = BlogDataManager.createCorrectUpdatedBlog();
    
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
    const updatedBlog = BlogDataManager.createBlogFullOfIncorrectData();

    const expectedErrors = BlogDataManager.getResponseFullOfErrors();

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

    const unDeletedBlogResult = await request(app).get(`${RoutesPathsEnum.blogs}/${newBlog?.id}`);

    expect(unDeletedBlogResult.body).toEqual(newBlog);
  });

  it(`should'nt delete blog with incorrect id`, async () => {
    const blogResult = await request(app)
      .delete(`${RoutesPathsEnum.blogs}/63189b06003380064c4193be`)
      .set('Authorization', authHeaderString);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NotFound);

    const unDeletedBlogResult = await request(app).get(`${RoutesPathsEnum.blogs}/${newBlog?.id}`);

    expect(unDeletedBlogResult.body).toEqual(newBlog);
  });

  it(`should delete blog with auth header`, async () => {
    const blogResult = await request(app)
      .delete(`${RoutesPathsEnum.blogs}/${newBlog?.id}`)
      .set('Authorization', authHeaderString);

    expect(blogResult.statusCode).toBe(ResponseStatusCodesEnum.NoContent);

    const deletedBlog = await request(app).get(`${RoutesPathsEnum.blogs}/${newBlog?.id}`);

    expect(deletedBlog.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });
});
