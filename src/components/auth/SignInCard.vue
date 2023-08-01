<template>
  <v-progress-circular v-if="loading" indeterminate :size="18" :width="3"
    color="secondary"></v-progress-circular>
  <v-card flat v-else>
    <div class="text-center">
      <slot name="title"> <v-card-title> Sign In </v-card-title> </slot>
    </div>
    <v-card-actions>
      <v-btn block variant="outlined" @click="signIn" prepend-icon="mdi-github">
        Sign In with GitHub
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from "vue";
import { useRouter, RouteLocationRaw } from "vue-router";
import { useClientHandle } from "@urql/vue";
import { useAuthStore } from "@/stores/auth";

import {
  redirectToGitHubAuthURL,
  encodeAndStoreState,
  clearState,
  UnencodedState,
} from "@/utils/auth/oauth";

export default defineComponent({
  name: "SignInCard",
  props: {
    path: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      default: () => ({ name: "Dashboard" } as RouteLocationRaw),
    },
  },
  setup(prop) {
    const router = useRouter();
    const urqlClientHandle = useClientHandle();
    const authStore = useAuthStore();

    const loading = ref(false);

    const option = computed(() => {
      // https://stackoverflow.com/a/8084248/7309855
      const randomString = (Math.random() + 1).toString(36).substring(7);
      const rawOption = { path: prop.path, randomString };
      return JSON.stringify(rawOption);
    });

    const redirect = ref<RouteLocationRaw>({ name: "Auth" });

    const rawState = computed<UnencodedState>(() => ({
      redirect: redirect.value,
      option: option.value,
    }));

    const scope = ref(""); // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps

    async function signIn() {
      loading.value = true;
      try {
        authStore.clearAuthError();
        const state = encodeAndStoreState(rawState.value);
        await redirectToGitHubAuthURL(
          urqlClientHandle.client,
          scope.value,
          state
        );
      } catch (error) {
        clearState();
        router.push({ name: "SignInError" });
        loading.value = false;
      }
    }

    return {
      loading,
      option,
      redirect,
      rawState,
      scope,
      signIn,
    };
  },
});
</script>
