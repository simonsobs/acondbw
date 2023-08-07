<template>
  <v-card>
    <v-card-title>Add a GitHub organization</v-card-title>
    <v-card-text>
      <v-alert
        v-if="error"
        variant="tonal"
        type="error"
        :text="error"
      ></v-alert>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="GitHub organization account name"
              v-model="login"
              :error-messages="loginErrors"
              @input="v$.login.$touch()"
              @blur="v$.login.$touch()"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" variant="text" @click="cancel">Cancel</v-btn>
      <v-btn color="secondary" variant="text" @click="reset">Reset</v-btn>
      <v-btn
        color="primary"
        :disabled="v$.$invalid"
        variant="text"
        @click="add"
      >
        Add
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from "vue";
import { useStore } from "@/stores/main";

import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import { useAddGitHubOrgMutation } from "@/generated/graphql";

const emit = defineEmits(["cancel", "finished"]);

const store = useStore();
const error = ref<any>(null);
const login = ref<string>("");

const rules = computed(() => ({
  login: { required },
}));

const v$ = useVuelidate(rules, { login });

const loginErrors = computed(() => {
  const errors: string[] = [];
  const field = v$.value.login;
  if (!field.$dirty) return errors;
  field.required.$invalid && errors.push("This field is required");
  return errors;
});

function cancel() {
  emit("cancel");
  delayedReset();
}
function delayedReset() {
  // reset 0.5 sec after so that the reset form won't be shown.
  setTimeout(() => {
    reset();
  }, 500);
}
function reset() {
  login.value = "";
  v$.value.$reset();
  error.value = null;
}

const { executeMutation } = useAddGitHubOrgMutation();
async function add() {
  try {
    const { error } = await executeMutation({
      login: login.value,
    });
    if (error) throw error;
    store.apolloMutationCalled();
    store.setSnackbarMessage("Added");
    emit("finished");
    delayedReset();
  } catch (e) {
    // @ts-ignore
    error.value = e.message;
  }
}
</script>
