import type { ILoginData } from "~/types/login.type";
import type { IRegisterData } from "~/types/register.type";

export async function login(payload: ILoginData) {
  const config = useRuntimeConfig();

  return $fetch<{ access_token: string }>(
    `${config.public.apiUrl}/auth/login`,
    {
      method: "POST",
      body: payload,
      onResponseError: ({ response }) => {
        throw response._data.message;
      },
    }
  );
}

export async function register(payload: IRegisterData) {
  return useNuxtApp().$api(`/auth/register`, {
    method: "POST",
    body: payload,
  });
}

export async function loginGoogle(paylod: { email: string; name: string }) {
  return useNuxtApp().$api<{ access_token: string }>(`/auth/google`, {
    method: "POST",
    body: paylod,
  });
}
