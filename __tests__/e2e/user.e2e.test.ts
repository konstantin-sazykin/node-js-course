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

  it('should not return users list with newUser', async () => {
    const result = await request(app).get(RoutesPathsEnum.user);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should return users list with newUser', async () => {
    const result = await request(app)
      .get(RoutesPathsEnum.user)
      .set('Authorization', authHeaderString);

    expect(result.body.items[0]).toEqual(newUser);
  });

  it('should return users list with new users from search terms', async () => {
    const userA = await request(app)
      .post(RoutesPathsEnum.user)
      .send(UserDataManager.usersForTestingSearch.userA)
      .set('Authorization', authHeaderString);

    const userB = await request(app)
      .post(RoutesPathsEnum.user)
      .send(UserDataManager.usersForTestingSearch.userB)
      .set('Authorization', authHeaderString);

    const result = await request(app)
      .get(RoutesPathsEnum.user)
      .query({
        searchEmailTerm: 'director',
        searchLoginTerm: 'secret',
        sortBy: 'email',
        sortDirection: 'desc',
      })
      .set('Authorization', authHeaderString);

    expect(result.body.items[0]).toEqual(userB.body);
    expect(result.body.items[1]).toEqual(userA.body);
  });

  it('should return emty items list with too big page number', async () => {
    const result = await request(app)
      .get(RoutesPathsEnum.user)
      .query({
        pageNumber: 5,
        pageSize: 10,
      })
      .set('Authorization', authHeaderString);

    expect(result.body.items).toEqual([]);
  });

  it('should return userB with sort by email, page number 3 and page size 1', async () => {
    const result = await request(app)
      .get(RoutesPathsEnum.user)
      .query({
        sortBy: 'email',
        pageNumber: 3,
        pageSize: 1,
      })
      .set('Authorization', authHeaderString);

    expect(result.body.items[0].email).toBe(UserDataManager.usersForTestingSearch.userB.email);
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
