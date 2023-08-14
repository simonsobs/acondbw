<template>
  <div style="block-size: 100%; position: relative">
    <div v-if="notFound" class="not-found">
      <span class="text-h1 text-center"> Not Found (404) </span>
    </div>
    <v-progress-linear v-else-if="loading" indeterminate color="primary">
    </v-progress-linear>
    <div v-else-if="error" class="pa-5">
      <v-alert
        type="error"
        variant="tonal"
        :text="error"
        class="mx-auto"
        max-width="960px"
      >
      </v-alert>
    </div>
    <div
      v-else-if="loaded && node"
      class="pt-5 px-5"
      style="max-width: 960px; margin: auto"
    >
      <div class="top-bar text-h4 text-primary">
        <span>
          <v-icon
            large
            class="me-3"
            :icon="node.icon"
            v-if="node.icon"
          ></v-icon>
          <router-link
            :to="{
              name: 'ProductList',
              params: { productTypeName: node.name },
            }"
            class="capitalize"
            style="text-decoration: none; color: inherit"
          >
            {{ node.plural }}
          </router-link>
          <span v-if="itemName">
            <v-icon large color="primary">mdi-chevron-right</v-icon>
            {{ itemName }}
          </span>
        </span>
        <span v-if="!itemName">
          <v-tooltip left open-delay="800">
            <template v-slot:activator="{ props: tooltip }">
              <v-dialog persistent v-model="editDialog" max-width="800">
                <template v-slot:activator="{ props: editDialog }">
                  <v-btn
                    v-bind="{ ...tooltip, ...editDialog }"
                    variant="plain"
                    icon
                    class="button-mdi-cog"
                  >
                    <v-icon size="x-small" icon="mdi-cog"></v-icon>
                  </v-btn>
                </template>
                <product-type-edit-form
                  v-if="editDialog"
                  :node="node"
                  @cancel="onEditFormCancelled"
                  @finished="onEditFormFinished($event)"
                ></product-type-edit-form>
              </v-dialog>
            </template>
            <span>
              Settings:
              <span class="capitalize font-italic">
                {{ node.plural }}
              </span>
            </span>
          </v-tooltip>
        </span>
      </div>
      <router-view
        :key="route.fullPath"
        :productTypeId="node ? Number(node.typeId) : null"
        v-slot="{ Component }"
      >
        <transition :name="transitionName" :mode="transitionMode">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <dev-tool-loading-state-menu top="10px" right="10px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteUpdate,
  onBeforeRouteLeave,
} from "vue-router";

import { useProductTypeByNameQuery } from "@/generated/graphql";

import ProductTypeEditForm from "@/components/product-type/ProductTypeEditForm.vue";

import { useQueryState } from "@/utils/query-state";

const route = useRoute();
const router = useRouter();

const productTypeName = ref<string | null>(null);
const itemName = ref<string | null>(null);
onMounted(() => {
  productTypeName.value = route.params.productTypeName as string;
  itemName.value = (route.params.name || null) as string | null;
});

const query = useProductTypeByNameQuery({
  // @ts-ignore
  variables: { name: productTypeName },
  pause: !productTypeName,
});

const node = computed(() => query.data?.value?.productType);
const editDialog = ref(false);
function onEditFormCancelled() {
  closeEditForm();
}
function closeEditForm() {
  editDialog.value = false;
}
function onEditFormFinished(event: string) {
  closeEditForm();
  if (event) onNameChanged(event);
}
function onNameChanged(event: string) {
  router.push({
    name: "ProductList",
    params: {
      productTypeName: event,
    },
  });
}
const transitionName = ref("fade-product-top-leave");
const transitionMode = ref<"out-in">("out-in");
onBeforeRouteUpdate((to, from, next) => {
  transitionName.value = "fade-product-top-update";
  transitionMode.value = "out-in";
  next();
});
onBeforeRouteLeave((to, from, next) => {
  transitionName.value = "fade-product-top-leave";
  transitionMode.value = "out-in";
  next();
});

const { loading, loaded, notFound, error, devtoolState } = useQueryState(
  query,
  { isNull: () => node.value === null }
);
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}

.fade-product-top-update-enter-active {
  transition: opacity 0.8s;
}

.fade-product-top-update-leave-active {
  transition: opacity 0s;
}

.fade-product-top-update-enter,
.fade-product-top-update-leave-to {
  opacity: 0;
}

.fade-product-top-leave-enter-active {
  transition: opacity 0s;
}

.fade-product-top-leave-leave-active {
  transition: opacity 0s;
}

.fade-product-top-leave-enter {
  opacity: 1;
}

.fade-product-top-leave-leave-to {
  opacity: 1;
}

.not-found {
  display: grid;
  block-size: 100%;
  place-items: center;
}

.top-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 1rem;
}

.button-mdi-cog {
  align-items: start;
}
</style>
