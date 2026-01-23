import type {
  IGoogleAuth,
  ILoginData,
  IRegisterData,
} from "~/types/auth.types";

export function login(data: ILoginData) {
  const config = useRuntimeConfig();

  return $fetch<{ access_token: string }>(
    `${config.public.apiUrl}/auth/login`,
    {
      method: "POST",
      body: data,
      onResponseError: ({ response }) => {
        throw response._data.message;
      },
    },
  );
}

export function register(data: IRegisterData) {
  return useNuxtApp().$api(`/auth/register`, {
    method: "POST",
    body: data,
  });
}

export function loginGoogle(data: IGoogleAuth) {
  return useNuxtApp().$api<{ access_token: string }>(`/auth/google`, {
    method: "POST",
    body: data,
  });
}
