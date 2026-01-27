export interface IUser {
  name: string;
  role: string;
  email: string;
  authFlow: string[];
}

export interface IUpdateUser {
  name?: string;
  email?: string;
}

export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IUserSelectionCount {
  favCount: number;
  cartCount: number;
}

export interface IGoogleAuth {
  name: string;
  email: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData {
  email: string;
  name: string;
  password: string;
}
