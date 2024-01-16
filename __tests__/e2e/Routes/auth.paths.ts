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

  static get resendEmail() {
    return `${RoutesPathsEnum.auth}/registration-email-resending`;
  }

  static get refreshToken() {
    return `${RoutesPathsEnum.auth}/refresh-token`;
  }

  static get logout() {
    return `${RoutesPathsEnum.auth}/logout`;
  }

  static get passwordRecovery() {
    return `${RoutesPathsEnum.auth}/password-recovery`;
  }

  static get newPassword() {
    return `${RoutesPathsEnum.auth}/new-password`;
  }
}
