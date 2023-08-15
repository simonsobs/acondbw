<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" variant="plain" icon>
        <v-icon icon="mdi-dots-vertical"></v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-dialog v-model="editDialog" max-width="800" persistent>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :disabled="disableEdit"
            prepend-icon="mdi-pencil"
            title="Edit"
          >
          </v-list-item>
        </template>
        <product-edit-form
          v-if="editDialog && attributes"
          :node="node"
          :attributes="attributes"
          @cancel="onEditFormCancelled"
          @finished="onEditFormFinished($event)"
        ></product-edit-form>
      </v-dialog>
      <v-dialog v-model="updateRelationsDialog" max-width="800" persistent>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :disabled="disableEdit"
            prepend-icon="mdi-relation-many-to-many"
            title="Update relations"
          >
          </v-list-item>
        </template>
        <product-update-relations-form
          v-if="updateRelationsDialog"
          :node="node"
          @cancel="onUpdateRelationsFormCancelled"
          @finished="onUpdateRelationsFormFinished"
        ></product-update-relations-form>
      </v-dialog>
      <v-dialog v-model="convertTypeDialog" max-width="800" persistent>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :disabled="disableEdit"
            prepend-icon="mdi-drawing"
            title="Convert type"
          >
          </v-list-item>
        </template>
        <product-convert-type-form
          v-if="convertTypeDialog"
          :node="node"
          @cancel="onConvertTypeFormCancelled"
          @finished="onConvertTypeFormFinished($event)"
        ></product-convert-type-form>
      </v-dialog>
      <v-dialog v-model="deleteDialog" max-width="600">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :disabled="disableDelete"
            prepend-icon="mdi-delete"
            title="Delete"
          >
          </v-list-item>
        </template>
        <product-delete-form
          v-if="deleteDialog"
          :productId="Number(node.productId)"
          @cancel="onDeleteFormCancelled"
          @finished="onDeleteFormFinished"
        ></product-delete-form>
      </v-dialog>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useConfigStore } from "@/stores/config";

import ProductEditForm, {
  Product,
  Attributes,
} from "@/components/product/form/ProductEditForm.vue";
import ProductUpdateRelationsForm from "@/components/product/form/ProductUpdateRelationsForm.vue";
import ProductConvertTypeForm from "@/components/product/form/ProductConvertTypeForm.vue";
import ProductDeleteForm from "@/components/product/form/ProductDeleteForm.vue";

interface Props {
  node: Product;
  attributes: Attributes;
}

interface Emits {
  (event: "nameChanged", name: string): boolean;
  (event: "typeChanged", type: string): boolean;
  (event: "deleted"): boolean;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const configStore = useConfigStore();
const disableEdit = computed(() => !configStore.config.productUpdateDialog);
const disableDelete = computed(() => !configStore.config.productDeletionDialog);

const menu = ref(false);
const editDialog = ref(false);
function onEditFormCancelled() {
  closeEditForm();
}
function onEditFormFinished(event: string | undefined) {
  closeEditForm();
  if (event) emit("nameChanged", event);
}
function closeEditForm() {
  editDialog.value = false;
  menu.value = false;
}
const updateRelationsDialog = ref(false);
function onUpdateRelationsFormCancelled() {
  closeUpdateRelationsForm();
}
function onUpdateRelationsFormFinished() {
  closeUpdateRelationsForm();
}
function closeUpdateRelationsForm() {
  updateRelationsDialog.value = false;
  menu.value = false;
}
const convertTypeDialog = ref(false);
function onConvertTypeFormCancelled() {
  closeConvertTypeForm();
}
function onConvertTypeFormFinished(event: string) {
  closeConvertTypeForm();
  if (event) emit("typeChanged", event);
}
function closeConvertTypeForm() {
  convertTypeDialog.value = false;
  menu.value = false;
}
const deleteDialog = ref(false);
function onDeleteFormCancelled() {
  closeDeleteForm();
}
function onDeleteFormFinished() {
  closeDeleteForm();
  emit("deleted");
}
function closeDeleteForm() {
  deleteDialog.value = false;
  menu.value = false;
}
</script>
