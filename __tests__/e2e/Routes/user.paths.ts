import { RoutesPathsEnum } from '../../../src/utils/constants';

export class UserPaths {
  static userById(id?: string) {
    return `${RoutesPathsEnum.user}/${id}`;
  }

  static get userByIncorrectId() {
    const id = '6576ed4ef8c19e36be268f13';

    return `${RoutesPathsEnum.user}/${id}`;
  }
}
