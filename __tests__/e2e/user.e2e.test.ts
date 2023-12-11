import request from 'supertest';

import { closeDbConnection, launchDb } from '../../src/db/db';
import { TestingRepository } from '../../src/repositories/testing.repository';
import { app } from '../../src/settings';
import { ResponseStatusCodesEnum, RoutesPathsEnum } from '../../src/utils/constants';
import { UserDataManager } from './dataManager/user.data-manager';
import { QueryUserOutputType } from '../../src/types/user/output';
import { UserPaths } from './Routes/user.paths';

describe('/user', () => {
  const authHeaderString = `Basic ${btoa('admin:qwerty')}`;

  let newUser: QueryUserOutputType | null = null;

  beforeAll(async () => {
    await launchDb();

    await TestingRepository.clearAllData();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  it('should not create user without auth header', async () => {
    const result = await request(app).post(RoutesPathsEnum.user).send(UserDataManager.correctUser);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should not create user with incorrect data', async () => {
    const result = await request(app)
      .post(RoutesPathsEnum.user)
      .send(UserDataManager.incorrectUser)
      .set('Authorization', authHeaderString);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);

    expect(result.body.errorsMessages).toEqual(UserDataManager.responseFullOfErrors);
  });

  it('should create user with correct data', async () => {
    const result = await request(app)
      .post(RoutesPathsEnum.user)
      .send(UserDataManager.correctUser)
      .set('Authorization', authHeaderString);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Created);

    newUser = { ...result.body };
  });

  it('should not delete user without auth header', async () => {
    const result = await request(app).delete(UserPaths.userById(newUser?.id));

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should not delete user with incorrect id', async () => {
    const result = await request(app)
      .delete(UserPaths.userByIncorrectId)
      .set('Authorization', authHeaderString);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NotFound);
  });

  it('should delete user with correct id', async () => {
    const result = await request(app)
      .delete(UserPaths.userById(newUser?.id))
      .set('Authorization', authHeaderString);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
  });
});
