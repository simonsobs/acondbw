<template>
  <v-progress-circular
    v-if="loading"
    indeterminate
    :size="18"
    :width="3"
    color="secondary"
  ></v-progress-circular>
  <v-card flat v-else>
    <v-card-title>Admin App</v-card-title>
    <v-card-actions>
      <v-btn block outlined @click="requestAuth">
        <v-icon left>mdi-github</v-icon>Store Admin App Token
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router/composables";
import { useClientHandle } from "@urql/vue";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/stores/auth";

import {
  redirectToGitHubAuthURL,
  encodeAndStoreState,
  clearState,
  UnencodedState,
} from "@/utils/auth/oauth";

export default defineComponent({
  name: "AdminAppTokenCard",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const urqlClientHandle = useClientHandle();
    const urqlClient = urqlClientHandle.client;

    const loading = ref(false);

    async function requestAuth() {
      loading.value = true;
      try {
        authStore.clearAuthError();
        const callbackRoute = { name: "AdminAppAuth" };
        const scope = "read:org"; // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
        const rawState: UnencodedState = {
          redirect: callbackRoute,
          option: uuidv4(),
        };
        const state = encodeAndStoreState(rawState);
        await redirectToGitHubAuthURL(urqlClient, scope, state);
      } catch (error) {
        clearState();
        router.push({ name: "AdminAppTokenError" });
        loading.value = false;
      }
    }

    return {
      loading,
      requestAuth,
    };
  },
  // data: () => ({
  //   loading: false,
  // }),
  // methods: {
  //   async requestAuth() {
  //     this.loading = true;
  //     try {
  //       this.clearAuthError();
  //       const callbackRoute = { name: "AdminAppAuth" };
  //       const scope = "read:org"; // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
  //       const rawState: UnencodedState = {
  //         redirect: callbackRoute,
  //         option: uuidv4(),
  //       };
  //       const state = encodeAndStoreState(rawState);
  //       await redirectToGitHubAuthURL(client, scope, state);
  //     } catch (error) {
  //       clearState();
  //       this.$router.push({ name: "AdminAppTokenError" });
  //       this.loading = false;
  //     }
  //   },
  //   ...mapActions(useAuthStore, { clearAuthError: "clearAuthError" }),
  // },
});
</script>
