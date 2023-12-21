export type AuthCreateUserInputType = {
  login: string;
  password: string;
  email: string;
};


export type AuthConfirmEmailInputType = {
  code: string;
}