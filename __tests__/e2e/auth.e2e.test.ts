import request from 'supertest';

import { closeDbConnection, launchDb } from '../../src/db/db';
import { TestingRepository } from '../../src/repositories/testing.repository';
import { app } from '../../src/settings';
import { AuthPaths } from './Routes/auth.paths';
import { AuthDataManger } from './dataManager/auth.data-manager';
import { ResponseStatusCodesEnum } from '../../src/utils/constants';

describe('/auth', () => {
  beforeAll(async () => {
    await launchDb();

    await TestingRepository.clearAllData();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  it('should return status 400 without request body', async () => {
    const result = await request(app).post(AuthPaths.index).send({});

    expect(result.statusCode).toBe(400);
  });

  it('should return status 400 with incorrect user data', async () => {
    const result = await request(app)
      .post(AuthPaths.index)
      .send(AuthDataManger.createIncorrectUserDate());

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);

    expect(result.body).toEqual(AuthDataManger.getResponseFullOfErrors());
  });

  it('should return status 401 with non-existent user data', async () => {
    const result = await request(app)
      .post(AuthPaths.index)
      .send(AuthDataManger.createLikeCorrectUserData());

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });
});
