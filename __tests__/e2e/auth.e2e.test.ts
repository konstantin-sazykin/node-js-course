import request from 'supertest';

import { closeDbConnection, launchDb } from '../../src/db/db';
import { TestingRepository } from '../../src/repositories/testing.repository';
import { app } from '../../src/settings';
import { AuthPaths } from './Routes/auth.paths';
import { AuthDataManger } from './dataManager/auth.data-manager';
import { ResponseStatusCodesEnum } from '../../src/utils/constants';
import { UserService } from '../../src/domain/user.service';
import { UserDataManager } from './dataManager/user.data-manager';

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

  it('should return status 204 for correct user', async () => {
    const correctRegUserData = UserDataManager.correctUser;
  
    await UserService.createUser(correctRegUserData.login, correctRegUserData.email, correctRegUserData.password);

    const authResult = await request(app)
      .post(AuthPaths.index)
      .send({ loginOrEmail: correctRegUserData.email, password: correctRegUserData.password });

    expect(authResult.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
  })
});
