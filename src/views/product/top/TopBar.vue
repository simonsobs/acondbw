<template>
  <div class="top-bar text-h4 text-primary">
    <span>
      <v-icon large class="me-3" :icon="node.icon" v-if="node.icon"></v-icon>
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
      <v-tooltip>
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ProductTypeByNameQuery } from "@/generated/graphql";
import ProductTypeEditForm from "@/components/product-type/ProductTypeEditForm.vue";

type ProductType = NonNullable<ProductTypeByNameQuery["productType"]>;

interface Props {
  node: ProductType;
  itemName: string | null;
}
const prop = defineProps<Props>();

const router = useRouter();

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
</script>

<style scoped>
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
