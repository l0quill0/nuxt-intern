import type {
  IGoogleAuth,
  ILoginData,
  ILoginReposnse,
  IRegisterData,
} from "~/types/auth.types";

export function login(data: ILoginData) {
  const config = useRuntimeConfig();

  return $fetch<ILoginReposnse>(`${config.public.apiUrl}/auth/login`, {
    method: "POST",
    body: data,
    onResponseError: ({ response }) => {
      throw response._data.message;
    },
  });
}

export function register(data: IRegisterData) {
  return useNuxtApp().$api(`/auth/register`, {
    method: "POST",
    body: data,
  });
}

export function loginGoogle(data: IGoogleAuth) {
  return useNuxtApp().$api<ILoginReposnse>(`/auth/google`, {
    method: "POST",
    body: data,
  });
}
