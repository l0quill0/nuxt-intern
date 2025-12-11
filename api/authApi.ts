import type { ILoginData } from "~/Types/login.type";
import type { IRegisterData } from "~/Types/register.type";

export async function login(payload: ILoginData) {
  return useNuxtApp().$api<{ access_token: string }>(`auth/login`, {
    method: "POST",
    body: payload,
  });
}

export async function register(payload: IRegisterData) {
  return useNuxtApp().$api(`auth/register`, {
    method: "POST",
    body: payload,
  });
}
