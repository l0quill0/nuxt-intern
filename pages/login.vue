<script setup lang="ts">
import { loginGoogle } from "~/api/authApi";
import { PublicRoutes } from "~/enums/routes.enum";

const toast = useToast();
const tokenStore = useTokenStore();
const userStore = useUserStore();
const compStore = useCompStore();

const onVerified = async ({
  email,
  name,
}: {
  email?: string;
  name?: string;
  ok: boolean;
}) => {
  if (email && name) {
    try {
      const response = await loginGoogle({ email, name });
      tokenStore.setToken(response.access_token);
      await userStore.fetchUser();
      toast.add({ title: "Авторизація успішна", color: "success" });
      refreshNuxtData("count");
      compStore.clearAll();
      navigateTo(PublicRoutes.HOME);
    } catch (error) {
      toast.add({ title: error as string, color: "error" });
    }
  }
};
const onError = (err: any) => {
  console.error("error:", err);
};
</script>

<template>
  <div class="w-full h-full flex justify-center items-center flex-col">
    <LoginForm />
    <div
      class="mt-1 overflow-hidden flex justify-items-start items-start rounded-[4px]"
    >
      <GoogleLoginButton
        :verify-on-server="true"
        @verified="onVerified"
        @error="onError"
        :options="{
          theme: 'filled_black',
          size: 'medium',
          text: 'continue_with',
        }"
      />
    </div>
  </div>
</template>
