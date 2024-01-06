import Handlebars from 'handlebars';

import { emails } from './email';

interface EmailType {
  template: string;
  subject: string;
};
export class EmailViewCreator {
  static confirmation(token: string): EmailType {
    const template = Handlebars.compile(emails.emailConfirmation.template);
    const subject = emails.emailConfirmation.subject;
    const result = template({ confirmationCode: token });

    return { template: result, subject };
  }
}
