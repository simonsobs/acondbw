<template>
  <v-container
    :fill-height="notFound"
    class="product-top"
    style="position: relative"
  >
    <v-row v-if="notFound" align="center" justify="center">
      <v-col class="text-h1 text-center">Not Found (404)</v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-progress-circular
          v-if="loading"
          indeterminate
          :size="18"
          :width="3"
          color="secondary"
        ></v-progress-circular>
        <v-alert v-else-if="error" type="error">{{ error }}</v-alert>
        <v-card flat v-if="loaded && node">
          <v-card-title class="text-h4 primary--text justify-space-between">
            <span>
              <v-icon large class="me-3" v-text="node.icon"></v-icon>
              <router-link
                :to="{
                  name: 'ProductList',
                  params: { productTypeName: node.name },
                }"
                v-text="node.plural"
                class="capitalize"
                style="text-decoration: none; color: inherit"
              ></router-link>
              <span v-if="itemName">
                <v-icon large color="primary">mdi-chevron-right</v-icon>
                {{ itemName }}
              </span>
            </span>
            <span v-if="!itemName">
              <v-tooltip left open-delay="800">
                <template v-slot:activator="{ on: tooltip }">
                  <v-dialog persistent v-model="editDialog" max-width="800">
                    <template v-slot:activator="{ on: editDialog }">
                      <v-btn icon v-on="{ ...tooltip, ...editDialog }">
                        <v-icon small>mdi-cog</v-icon>
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
          </v-card-title>
          <transition :name="transitionName" :mode="transitionMode">
            <keep-alive>
              <router-view
                :key="$route.fullPath"
                :productTypeId="node ? node.typeId : null"
                :disableAdd="disableAdd"
                :disableEdit="disableEdit"
                :disableDelete="disableDelete"
              ></router-view>
            </keep-alive>
          </transition>
        </v-card>
      </v-col>
    </v-row>
    <dev-tool-loading-state-overriding-menu
      v-model="devtoolState"
    ></dev-tool-loading-state-overriding-menu>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from "vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteUpdate,
  onBeforeRouteLeave,
} from "vue-router/composables";
import { useStore } from "@/stores/main";

import PRODUCT_TYPE_BY_NAME from "@/graphql/queries/ProductTypeByName.gql";
import { ProductTypeByNameQuery } from "@/generated/graphql";

import State from "@/utils/LoadingState";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu.vue";

import ProductTypeEditForm from "@/components/product-type/ProductTypeEditForm.vue";
import { useQuery } from "@urql/vue";

export default defineComponent({
  name: "ProductTop",
  components: {
    DevToolLoadingStateOverridingMenu,
    ProductTypeEditForm,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const init = ref(true);
    const error = ref(null as any);
    const refreshing = ref(false);
    const devtoolState = ref<number | null>(null);
    const productTypeName = ref<string | null>(null);
    const itemName = ref<string | null>(null);
    onMounted(() => {
      productTypeName.value = route.params.productTypeName;
      itemName.value = route.params.name;
    });
    const query = useQuery<ProductTypeByNameQuery>({
      query: PRODUCT_TYPE_BY_NAME,
      variables: { name: productTypeName },
      pause: !productTypeName,
    });
    const node = computed(() => query.data?.value?.productType);
    watch(query.data, (data) => {
      if (data) init.value = false;
    });
    watch(query.error, (e) => {
      init.value = false;
      error.value = e || null;
    });
    watch(
      () => store.nApolloMutations,
      () => {
        query.executeQuery({ requestPolicy: "network-only" });
      }
    );
    watch(devtoolState, (val) => {
      if (val) init.value = val === State.INIT;
      error.value = val === State.ERROR ? "Error from Dev Tools" : null;
    });
    const state = computed(() => {
      if (devtoolState.value !== null) return devtoolState.value;
      if (refreshing.value) return State.LOADING;
      if (query.fetching.value) return State.LOADING;
      if (error.value) return State.ERROR;
      if (node.value) return State.LOADED;
      if (init.value) return State.INIT;
      return State.NONE;
    });
    const loading = computed(() => state.value === State.LOADING);
    const loaded = computed(() => state.value === State.LOADED);
    const notFound = computed(() => state.value === State.NONE);
    const disableAdd = computed(() => !store.webConfig.productCreationDialog);
    const disableEdit = computed(() => !store.webConfig.productUpdateDialog);
    const disableDelete = computed(
      () => !store.webConfig.productDeletionDialog
    );
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
    async function refresh() {
      refreshing.value = true;
      const wait = new Promise((resolve) => setTimeout(resolve, 500));
      await query.executeQuery({ requestPolicy: "network-only" });
      await wait; // wait until 0.5 sec passes since starting refetch
      // because the progress circular is too flickering if
      // the refetch finishes too quickly
      refreshing.value = false;
    }
    const transitionName = ref("fade-product-top-leave");
    const transitionMode = ref("out-in");
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
    return {
      init,
      error,
      refreshing,
      devtoolState,
      State,
      query,
      productTypeName,
      itemName,
      node,
      state,
      loading,
      loaded,
      notFound,
      disableAdd,
      disableEdit,
      disableDelete,
      editDialog,
      onEditFormCancelled,
      closeEditForm,
      onEditFormFinished,
      onNameChanged,
      refresh,
      transitionName,
      transitionMode,
    };
  },
});
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
</style>
