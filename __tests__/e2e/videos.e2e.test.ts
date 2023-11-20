import request from 'supertest';

import { VideoType } from './../../src/types/video/output';
import { app } from '../../src/settings';

describe('/videos', () => {
  let newVideo: VideoType | null = null;

  beforeAll(() => {
    request(app).delete('/testing/all-data').expect(204);
  });

  it('should return empty array and status 200', async () => {
    await request(app).get('/videos').expect(200, []);
  });

  it('should`nt return video with unavailable id', async () => {
    await request(app).get('/videos/33').expect(404);
  });

  it('should`nt create new video with incorrect title', async () => {
    const createVideoResult = await request(app)
      .post('/videos')
      .send({
        title: 21,
        author: 'Some Correct Author',
        availableResolutions: ['P144'],
      });

    expect(createVideoResult.statusCode).toBe(400);

    expect(createVideoResult.body?.errorsMessages?.[0]?.field).toBe('title');

    request(app).get('/videos').expect(200, []);
  });

  it('should`nt create new video with incorrect author', async () => {
    const createVideoResult = await request(app)
      .post('/videos')
      .send({
        title: '21',
        author: '  ',
        availableResolutions: ['P144'],
      });

    expect(createVideoResult.statusCode).toBe(400);

    expect(createVideoResult.body?.errorsMessages?.[0]?.field).toBe('author');

    request(app).get('/videos').expect(200, []);
  });

  it('should`nt create new video with incorrect availableResolutions', async () => {
    const createVideoResult = await request(app)
      .post('/videos')
      .send({
        title: '21',
        author: 'Some Correct Author',
        availableResolutions: ['P14', 'P240', 'P360'],
      });

    expect(createVideoResult.statusCode).toBe(400);

    expect(createVideoResult.body?.errorsMessages?.[0]?.field).toBe('availableResolutions');

    request(app).get('/videos').expect(200, []);
  });

  it('should create new video with correct data', async () => {
    const creteVideoResult = await request(app)
      .post('/videos')
      .send({ title: 'New Video', author: 'New Video Author', availableResolutions: ['P144'] });

    newVideo = { ...creteVideoResult.body };

    expect(creteVideoResult.statusCode).toBe(201);

    await request(app).get('/videos').expect([newVideo]);
  });

  it('should return video with correct id', async () => {
    const fetchVideoResult = await request(app).get(`/videos/${newVideo?.id}`);

    expect(fetchVideoResult.body).toEqual(newVideo);
  });

  it('should`nt update video with incorrect id', async () => {
    const updateVideoResult = await request(app)
      .put('/videos/1')
      .send({
        title: 'New Video',
        author: 'New Video Author',
        availableResolutions: ['P144'],
        canBeDownloaded: true,
        minAgeRestriction: 14,
        publicationDate: '2023-11-14T08:53:40.781Z',
      });

    expect(updateVideoResult.statusCode).toBe(404);
  });

  it(`should'nt update with incorrect data`, async () => {
    const updateVideoResult = await request(app)
      .put(`/videos/${newVideo?.id}`)
      .send({
        title: { a: 'b' },
        author: ['test'],
        availableResolutions: ['P142'],
        canBeDownloaded: 'true',
        minAgeRestriction: 21,
        publicationDate: 'tomorrow',
      });

    const expectedErrors = [
      { message: 'Invalid title', field: 'title' },
      { message: 'Invalid author', field: 'author' },
      {
        message: 'Invalid available resolution',
        field: 'availableResolutions',
      },
      {
        field: 'canBeDownloaded',
        message: 'Invalid canBeDownloaded field',
      },
      {
        field: 'minAgeRestriction',
        message: 'Invalid minAgeRestriction field',
      },
      {
        field: 'publicationDate',
        message: 'Invalid publicationDate field',
      },
    ];

    expect(updateVideoResult.body.errorsMessages).toEqual(expectedErrors);
  });

  it(`should'nt delete video with incorrrect id`, async () => {
    const deleteVideoResult = await request(app).delete('/videos/121212');

    expect(deleteVideoResult.statusCode).toBe(404);
  });

  it('should delete video with correct id', async () => {
    const deleteVideoResult = await request(app).delete(`/videos/${newVideo?.id}`);

    expect(deleteVideoResult.statusCode).toBe(204);

    const allVideos = await request(app).get('/videos');

    expect(allVideos.body).toEqual([]);
  });
});
