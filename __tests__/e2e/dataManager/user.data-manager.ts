export class UserDataManager {
  static get correctUser() {
    return {
      login: 'login',
      email: 'email@email.com',
      password: '3333333333',
    };
  }

  static get incorrectUser() {
    return {
      login: 'ab',
      email: 'email',
      passord: 123456,
    };
  }

  static get responseFullOfErrors() {
    return [
      { message: 'Invalid value', field: 'login' },
      { message: 'Invalid value', field: 'password' },
      { message: 'Invalid value', field: 'email' },
    ];
  }

  static get usersForTestingSearch() {
    const userA = {
      email: 'director1983@yandex.com',
      login: 'userA',
      password: 't3425trpe',
    };

    const userB = {
      email: 'userB@email.com',
      login: '_secretary',
      password: 'Passv0rd4545',
    };

    return {
      userA,
      userB,
    };
  }

  static get wrongAuthHeader() {
    return 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2VjMjUwODU1YzYyNjllNzk5YmMwOCIsImlhdCI6MTcwMjgwNjEwMSwiZXhwIjoxNzAzMTA2MTAxfQ.z3FUx7T8aJ3GrbQKnt-WtBVEzy0zybYNYUbQSq3ortY';
  }

  static getCorrectAuthHeader(token: string) {
    return `Bearer ${token}`;
  }
}
