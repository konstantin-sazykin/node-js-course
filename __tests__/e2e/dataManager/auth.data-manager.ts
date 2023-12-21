export class AuthDataManger {
  static createIncorrectUserDate() {
    return {
      loginOrEmail: 100000,
      password: [1, 2, 3, 4],
    };
  }

  static getResponseFullOfErrors() {
    return {
      errorsMessages: [
        { message: 'Invalid value', field: 'loginOrEmail' },
        { message: 'Invalid value', field: 'password' },
      ],
    };
  }

  static createLikeCorrectUserData() {
    return {
      loginOrEmail: 'test@login.com',
      password: '1231231231313',
    };
  }

  static get incorrectConfirmCode() {
    return 'pe4l9aw125mnf';
  }

  static get correctLikeConfirmCode() {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imt2c2F6eWtpbkBnbWFpbC5jb20iLCJpYXQiOjE3MDMxNzQwOTksImV4cCI6MTcwMzE3NDE1OX0.TkfrZGBRrWEfABzOM8q8v6rg1gHpThm43WVYa-EHIXk';
  }
}
