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
    }
  }

  static get responseFullOfErrors() {
    return [
      { message: 'Invalid value', field: 'login' },
      { message: 'Invalid value', field: 'password' },
      { message: 'Invalid value', field: 'email' }
    ]
  }

  static get usersForTestingSearch() {
    const userA = {
      email: 'director1983@yandex.com',
      login: 'userA',
      password: 't3425trpe',
    }

    const userB = {
      email: 'userB@email.com',
      login: '_secretary',
      password: 'Passv0rd4545',
    }

    return {
      userA,
      userB,
    }
  }
}
