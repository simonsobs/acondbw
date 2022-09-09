<template>
  <v-progress-circular
    v-if="loading"
    indeterminate
    :size="18"
    :width="3"
    color="secondary"
  ></v-progress-circular>
  <v-card flat v-else>
    <slot name="title"> <v-card-title>Sign In</v-card-title> </slot>
    <v-card-actions>
      <v-btn block outlined @click="signIn">
        <v-icon left>mdi-github</v-icon>Sign In with GitHub
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Location, RawLocation } from "vue-router";
import { mapActions } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { client } from "@/plugins/urql";

import {
  redirectToGitHubAuthURL,
  encodeAndStoreState,
  clearState,
  UnencodedState,
} from "@/utils/auth/oauth";

export default Vue.extend({
  name: "SignInCard",
  props: {
    path: {
      type: [String, Object] as PropType<RawLocation>,
      default: () => ({ name: "Dashboard" } as RawLocation),
    },
  },
  data() {
    return {
      loading: false,
      redirect: { name: "Auth" } as Location,
      scope: "", // (no scope) https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
    };
  },
  computed: {
    option(): string {
      // https://stackoverflow.com/a/8084248/7309855
      const randomString = (Math.random() + 1).toString(36).substring(7);
      const rawOption = { path: this.path, randomString };
      return JSON.stringify(rawOption);
    },
    rawState(): UnencodedState {
      return {
        redirect: this.redirect,
        option: this.option,
      };
    },
  },
  methods: {
    async signIn() {
      this.loading = true;
      try {
        this.clearAuthError();
        const state = encodeAndStoreState(this.rawState);
        await redirectToGitHubAuthURL(client, this.scope, state);
      } catch (error) {
        clearState();
        this.$router.push({ name: "SignInError" });
        this.loading = false;
      }
    },
    ...mapActions(useAuthStore, { clearAuthError: "clearAuthError" }),
  },
});
</script>
