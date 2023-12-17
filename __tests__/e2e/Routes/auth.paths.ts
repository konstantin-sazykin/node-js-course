import { RoutesPathsEnum } from '../../../src/utils/constants';

export class AuthPaths {
  static get index() {
    return `${RoutesPathsEnum.auth}/login`;
  }

  static get me() {
    return `${RoutesPathsEnum.auth}/me`;
  }
}
