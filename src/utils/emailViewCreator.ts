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

  static recovery(token: string): EmailType {
    const template = Handlebars.compile(emails.passwordRecovery.template);
    const subject = emails.passwordRecovery.subject;
    const result = template({ recoveryCode: token });

    return { template: result, subject };
  }
}
