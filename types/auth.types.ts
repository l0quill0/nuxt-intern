export interface IUser {
  id: number;
  name: string;
  role: string;
  email: string;
  createdAt: string;
  authMethod: { name: string }[];
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
