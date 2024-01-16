export interface AuthCreateUserInputType {
  login: string;
  password: string;
  email: string;
}

export interface AuthConfirmEmailInputType {
  code: string;
};

export interface AuthResendEmailInputType {
  email: string;
}

export interface AuthRecoveryPasswordByEmailInputType {
  email: string;
}

export interface AuthCreateNewPasswordByRecoveryCodeInputType {
  newPassword: string;
  recoveryCode: string;
}
