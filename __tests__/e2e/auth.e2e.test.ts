import request, { Test } from 'supertest';

import { closeDbConnection, launchDb } from '../../src/db/db';
import { TestingRepository } from '../../src/repositories/testing.repository';
import { app } from '../../src/settings';
import { AuthPaths } from './Routes/auth.paths';
import { AuthDataManger } from './dataManager/auth.data-manager';
import { ResponseStatusCodesEnum, RoutesPathsEnum } from '../../src/utils/constants';
import { UserDataManager } from './dataManager/user.data-manager';
import { QueryUserOutputType } from '../../src/types/user/output';
import { cookieParse } from './../../src/utils/cookie-parse';
import { JWTService } from '../../src/application/jwt.service';
import { RateLimitService } from '../../src/domain/rateLimit.service';

const sendMailMock = jest.fn(() => ({ accepted: [UserDataManager.realEmail] }));

jest.mock('nodemailer');

const nodemailer = require('nodemailer');

nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

describe('/auth', () => {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  const authHeaderString = `Basic ${btoa('admin:qwerty')}`;

  let createdByAdminUser: QueryUserOutputType | null = null;

  let createdBySelfUser: QueryUserOutputType | null = null;

  beforeAll(async () => {
    await launchDb();

    await TestingRepository.clearAllData();

    const userData = await request(app)
      .post(RoutesPathsEnum.user)
      .send(UserDataManager.correctUser)
      .set('Authorization', authHeaderString);

    createdByAdminUser = { ...userData.body };
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
    if (!createdByAdminUser) {
      throw new Error('Can not testing registration without new user data');
    }

    const result = await request(app).post(AuthPaths.registration).send({
      email: createdByAdminUser.email,
      login: UserDataManager.usersForTestingSearch.userB.login,
      password: UserDataManager.correctUser.password,
    });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should not try to create new user with existing login', async () => {
    if (!createdByAdminUser) {
      throw new Error('Can not testing registration without new user data');
    }

    const result = await request(app).post(AuthPaths.registration).send({
      email: UserDataManager.usersForTestingSearch.userB.email,
      login: createdByAdminUser.login,
      password: UserDataManager.correctUser.password,
    });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should not try to create new user with incorrect password', async () => {
    const result = await request(app).post(AuthPaths.registration).send({
      email: UserDataManager.usersForTestingSearch.userA.email,
      login: UserDataManager.usersForTestingSearch.userA.email,
      password: UserDataManager.tooLongPassword,
    });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should try to create new user with real data', async () => {
    const result = await request(app).post(AuthPaths.registration).send({
      email: UserDataManager.realEmail,
      login: UserDataManager.realLogin,
      password: UserDataManager.correctUser.password,
    });

    if (result.body) {
      createdBySelfUser = {
        email: UserDataManager.realEmail,
        login: UserDataManager.realLogin,
        id: '',
        createdAt: '',
      };
    }
    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
  });

  it('should return status 200 for correct user', async () => {
    const correctRegUserData = UserDataManager.correctUser;

    const authResult = await request(app)
      .post(AuthPaths.index)
      .send({ loginOrEmail: correctRegUserData.email, password: correctRegUserData.password });

    accessToken = authResult.body.accessToken;

    const cookies = cookieParse(authResult.get('Set-Cookie'));
    
    refreshToken = cookies.refreshToken;

    expect(refreshToken).toBeDefined();
  });

  it('should not return user data with incorrect JWT token', async () => {
    const wrongHeader = UserDataManager.wrongAuthHeader;

    const result = await request(app).get(AuthPaths.me).set('Authorization', wrongHeader);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should return user data with correct JWT token', async () => {
    const authHeader = UserDataManager.getCorrectAuthHeader(accessToken!);
    const result = await request(app).get(AuthPaths.me).set('Authorization', authHeader);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Ok);
    expect(result.body.email).toEqual(UserDataManager.correctUser.email);
    expect(result.body.login).toEqual(UserDataManager.correctUser.login);
    expect(result.body.userId).toEqual(expect.any(String));
  });

  it('should return status 400 with incorrect email', async () => {
    const email = UserDataManager.incorrectEmail;

    const result = await request(app).post(AuthPaths.resendEmail).send({ email: email });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should return status 400 with already confirmed email', async () => {
    if (!createdByAdminUser) {
      throw new Error('Can not testing confirmation without new user');
    }

    const email = createdByAdminUser.email;

    const result = await request(app).post(AuthPaths.resendEmail).send({ email: email });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should return status 204 with non confirmed email', async () => {
    if (!createdBySelfUser) {
      throw new Error('Can not testing confirmation without new user');
    }

    const email = createdBySelfUser.email;

    const result = await request(app).post(AuthPaths.resendEmail).send({ email: email });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
  });

  it('should not confirm email with incorrect form code', async () => {
    const token: [] = [];

    const result = await request(app).post(AuthPaths.confirmRegistration).send({ code: token });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should not confirm email with incorrect form code', async () => {
    const token: string = AuthDataManger.incorrectConfirmCode;

    const result = await request(app).post(AuthPaths.confirmRegistration).send({ code: token });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should not confirm email with expired code', async () => {
    const token = AuthDataManger.correctLikeConfirmCode;

    const result = await request(app).post(AuthPaths.confirmRegistration).send({ code: token });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should  not confirm email with correct code but for confirmed user email', async () => {
    if (!createdByAdminUser) {
      throw new Error('Can not testing confirmation without new user');
    }
    const token = JWTService.generateToken({ email: createdByAdminUser.email});

    const result = await request(app).post(AuthPaths.confirmRegistration).send({ code: token });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
  });

  it('should confirm email with correct code for new user', async () => {
    if (!createdBySelfUser) {
      throw new Error('Can not testing confirmation without new user');
    }

    const token = JWTService.generateToken({ email: createdBySelfUser.email });

    const result = await request(app).post(AuthPaths.confirmRegistration).send({ code: token });

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
  });

  it('should return valid refresh token in cookies', async () => {
    if (!accessToken) {
      throw Error('Can not test refresh token without JWT token')
    }

    const result = await request(app).post(AuthPaths.refreshToken).set('Cookie', [`refreshToken=${refreshToken}`]);
    
    const cookies = cookieParse(result.get('Set-Cookie'));
    
    refreshToken = cookies.refreshToken;

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Ok);
    expect(result.body.accessToken).toBeDefined();
  });

  it('should return 204 status code after logout', async () => {
    if (!refreshToken) {
      throw Error('Can not test logout without refresh token')
    }

    const result = await request(app).post(AuthPaths.logout).set('Cookie', [`refreshToken=${refreshToken}`]);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
  });

  it('should return 401 status code for refresh request after logout', async () => {
    if (!refreshToken) {
      throw Error('Can not test logout without refresh token')
    }

    const result = await request(app).post(AuthPaths.refreshToken).set('Cookie', [`refreshToken=${refreshToken}`]);

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.Unathorized);
  });

  it('should return 204 status after trying password recovery', async () => {
    const result = await request(app).post(AuthPaths.passwordRecovery).send({ email: UserDataManager.realEmail })

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.NoContent);
    
  });

  it('should return 400 status after trying password recovery with incorrect email', async () => {
    const result = await request(app).post(AuthPaths.passwordRecovery).send({ email: UserDataManager.incorrectEmail })

    expect(result.statusCode).toBe(ResponseStatusCodesEnum.BadRequest);
    
  });

  it('should return 429 status after 5 attempts during 10 seconds', async () => {
    // @ts-ignore
    RateLimitService.checkLimit.mockRestore();
    const promises: Promise<Test>[] = [];

    new Array(6).fill('').forEach((_, index) => {
      // @ts-ignore
      promises.push(request(app).post(AuthPaths.index).send({ loginOrEmail: UserDataManager.correctUser.login, password: UserDataManager.usersForTestingSearch.userA.password }));
    });

    const results = await Promise.all(promises);

    const lastResult = results[results.length - 1];
    
    expect(lastResult.statusCode).toBe(ResponseStatusCodesEnum.TooManyRequests);
  });

  it('should return 429 status after 5 attempts to try restore password', async () => {
    const promises: Promise<Test>[] = [];

    new Array(6).fill('').forEach((_, index) => {
      // @ts-ignore
      promises.push(request(app).post(AuthPaths.passwordRecovery).send({ email: UserDataManager.correctUser.email }));
    });

    const results = await Promise.all(promises);

    const lastResult = results[results.length - 1];
    
    expect(lastResult.statusCode).toBe(ResponseStatusCodesEnum.TooManyRequests);
  });
});
