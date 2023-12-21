import Handlebars from 'handlebars';
import { emails } from './email';

export class EmailViewCreator {
  static confirmation(token: string) {
    const template = Handlebars.compile(emails.emailConfirmation.template);
    const subject = emails.emailConfirmation.subject;
    const result = template({ confirmationCode: token });

    return { template: result, subject };
  }
}
