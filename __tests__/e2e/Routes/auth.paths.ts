import { RoutesPathsEnum } from '../../../src/utils/constants';

export class AuthPaths {
  static get index() {
    return `${RoutesPathsEnum.auth}/login`;
  }

  static get me() {
    return `${RoutesPathsEnum.auth}/me`;
  }

  static get registration() {
    return `${RoutesPathsEnum.auth}/registration`;
  }

  static get confirmRegistration() {
    return `${RoutesPathsEnum.auth}/registration-confirmation`;
  }
}
