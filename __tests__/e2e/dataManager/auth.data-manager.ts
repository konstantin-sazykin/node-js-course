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
        { message: 'password is required', field: 'password' },
      ],
    };
  }

  static createLikeCorrectUserData() {
    return {
      loginOrEmail: 'test@login.com',
      password: '1231231231313',
    };
  }
}
