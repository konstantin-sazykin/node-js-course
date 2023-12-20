import request from 'supertest';

import { closeDbConnection, launchDb } from '../../src/db/db';
import { TestingRepository } from '../../src/repositories/testing.repository';
import { app } from '../../src/settings';
import { AuthPaths } from './Routes/auth.paths';
import { AuthDataManger } from './dataManager/auth.data-manager';
import { ResponseStatusCodesEnum, RoutesPathsEnum } from '../../src/utils/constants';
import { UserDataManager } from './dataManager/user.data-manager';
import { QueryUserOutputType } from '../../src/types/user/output';

const sendMailMock = jest.fn(() => ({ accepted: [UserDataManager.realEmail] }));

jest.mock('nodemailer');

const nodemailer = require("nodemailer");

nodemailer.createTransport.mockReturnValue({ 'sendMail': sendMailMock });


describe('/auth', () => {
  let JWTToken: string | null = null;

  const authHeaderString = `Basic ${btoa('admin:qwerty')}`;

  let newUser: QueryUserOutputType | null = null;

  beforeAll(async () => {
    await launchDb();

    await TestingRepository.clearAllData();

    const userData = await request(app)
      .post(RoutesPathsEnum.user)
      .send(UserDataManager.correctUser)
      .set('Authorization', authHeaderString);

    newUser = { ...userData.body };
  });

  beforeEach(() => {
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
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

  it('should not try to create new user with incorrect email', async () => {
    const result = await request(app).post(AuthPaths.registration).send({
      email: UserDataManager.incorrectEmail,
      login: UserDataManager.usersForTestingSearch.userB.login,
      password: UserDataManager.correctUser.password,
    });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);

    expect(
      result.body?.errorsMessages?.some(
        (el: { message: string; field: string }) => el.field === 'email'
      )
    ).toBeTruthy();
  });

  it('should not try to create new user with incorrect login', async () => {
    const result = await request(app).post(AuthPaths.registration).send({
      email: UserDataManager.usersForTestingSearch.userA.email,
      login: UserDataManager.incorrectLogin,
      password: UserDataManager.correctUser.password,
    });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);

    expect(
      result.body?.errorsMessages?.some(
        (el: { message: string; field: string }) => el.field === 'login'
      )
    ).toBeTruthy();
  });

  it('should not try to create new user with existing email', async () => {
    if (!newUser) {
      throw new Error('Can not testing registration without new user data');
    }

    const result = await request(app).post(AuthPaths.registration).send({
      email: newUser.email,
      login: UserDataManager.usersForTestingSearch.userB.login,
      password: UserDataManager.correctUser.password,
    });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should not try to create new user with existing login', async () => {
    if (!newUser) {
      throw new Error('Can not testing registration without new user data');
    }

    const result = await request(app).post(AuthPaths.registration).send({
      email: UserDataManager.usersForTestingSearch.userA.email,
      login: newUser.login,
      password: UserDataManager.correctUser.password,
    });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should try to create new user with real data', async () => {
    const result = await request(app).post(AuthPaths.registration).send({
      email: UserDataManager.realEmail,
      login: UserDataManager.realLogin,
      password: UserDataManager.correctUser.password,
    });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
  });

  it('should return status 200 for correct user', async () => {
    const correctRegUserData = UserDataManager.correctUser;

    const authResult = await request(app)
      .post(AuthPaths.index)
      .send({ loginOrEmail: correctRegUserData.email, password: correctRegUserData.password });

    JWTToken = authResult.body.accessToken;

    expect(authResult.statusCode).toBe(ResponseStatusCodesEnum.Ok);
  });

  it('should not return user data with incorrect JWT token', async () => {
    const wrongHeader = UserDataManager.wrongAuthHeader;

    const result = await request(app).get(AuthPaths.me).set('Authorization', wrongHeader);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should return user data with correct JWT token', async () => {
    const authHeader = UserDataManager.getCorrectAuthHeader(JWTToken!);
    const result = await request(app).get(AuthPaths.me).set('Authorization', authHeader);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Ok);
    expect(result.body.email).toEqual(UserDataManager.correctUser.email);
    expect(result.body.login).toEqual(UserDataManager.correctUser.login);
    expect(result.body.userId).toEqual(expect.any(String));
  });
});
