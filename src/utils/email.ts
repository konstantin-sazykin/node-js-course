export const emails = {
  emailConfirmation: {
    template: `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
      <a href='https://somesite.com/confirm-email?code={{confirmationCode}}'>complete registration</a>
    </p>`,
    subject: 'Konstantin <lebowskibar24@gmail.com>',
  },
  passwordRecovery: {
    template: `<h1>Password recovery</h1>
    <p>To finish password recovery please follow the link below:
      <a href='https://somesite.com/confirm-email?recoveryCode={{recoveryCode}}'>recovery password</a>
    </p>`,
    subject: 'Konstantin <lebowskibar24@gmail.com>',
  },
};
