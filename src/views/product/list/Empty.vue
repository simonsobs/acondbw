<template>
  <div class="empty">
    <div class="text-body-1 font-weight-medium">
      Empty. No {{ productType.plural }} are found.
    </div>
    <v-btn
      depressed
      variant="flat"
      :to="{
        name: 'ProductAdd',
        params: { productTypeName: productType.name },
      }"
      prepend-icon="mdi-plus-thick"
      text="Add the first entry"
    >
    </v-btn>
    <v-dialog v-model="deleteDialog" max-width="400">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="outlined"
          color="secondary"
          :disabled="disableDelete"
          prepend-icon="mdi-delete"
          text="Delete this product type"
        >
        </v-btn>
      </template>
      <product-type-delete-form
        v-if="deleteDialog"
        :node="node"
        @cancel="onDeleteFormCancelled"
        @finished="onDeleteFormFinished"
      ></product-type-delete-form>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useConfigStore } from "@/plugins/pinia/stores/config";
import { QueryForProductListQuery } from "@/generated/graphql";
import ProductTypeDeleteForm from "@/components/product-type/ProductTypeDeleteForm.vue";

type ProductType = NonNullable<QueryForProductListQuery["productType"]>;

interface Props {
  productType: ProductType;
}

const prop = defineProps<Props>();

const node = computed(() => ({
  typeId: Number(prop.productType.typeId),
  plural: prop.productType.plural ?? prop.productType.name,
}));

const router = useRouter();

const configStore = useConfigStore();
const disableDelete = computed(() => !configStore.config.productDeletionDialog);

const deleteDialog = ref(false);

function onDeleteFormCancelled() {
  closeDeleteForm();
}

function onDeleteFormFinished() {
  closeDeleteForm();
  onDeleted();
}

function closeDeleteForm() {
  deleteDialog.value = false;
}

function onDeleted() {
  router.push({ name: "Dashboard" });
}
</script>

<style scoped>
.empty {
  margin-top: 16px;
  display: grid;
  block-size: 100%;
  place-items: center;
  gap: 24px;
}
</style>
