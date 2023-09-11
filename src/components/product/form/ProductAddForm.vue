<template>
  <v-card
    outlined
    max-width="960px"
    class="product-add-form mx-auto"
    style="border: 0; position: relative"
  >
    <v-card-title v-if="loaded && productType" class="text-h3 text-primary">
      <span>
        Add {{ productType.indefArticle }}
        <span class="font-italic font-weight-light">
          {{ productType.singular }}
        </span>
      </span>
    </v-card-title>
    <v-alert v-if="formError" type="error">{{ formError }}</v-alert>
    <v-stepper
      v-if="loaded"
      v-model="stepper"
      :items="['Start', 'Relations', 'Preview']"
      hide-actions
    >
      <!-- <v-stepper-header>
        <v-stepper-item :complete="stepper > 1" value="1" title="Start">
        </v-stepper-item>
        <v-stepper-item :complete="stepper > 2" value="2" title="Relations">
        </v-stepper-item>
        <v-stepper-item :complete="stepper > 3" value="3" title="Preview">
        </v-stepper-item>
      </v-stepper-header> -->
      <template v-slot:item.1>
        <product-add-form-step-start
          v-model="formStepStart"
          :productType="productType"
          @cancel="close()"
          @next="stepper = 2"
        >
        </product-add-form-step-start>
      </template>
      <template v-slot:item.2>
        <!-- <v-stepper-items> -->
        <!-- <v-stepper-content step="2"> -->
        <product-add-form-step-relations
          v-model="formStepRelation"
          :name="formStepStart.name"
          :productType="productType"
          @cancel="close()"
          @back="stepper = 1"
          @preview="preview"
          v-if="formStepStart && productType"
        >
        </product-add-form-step-relations>
      </template>
      <template v-slot:item.3>
        <product-add-form-step-preview
          :createProductInput="createProductInput"
          :productType="productType"
          @cancel="close()"
          @back="stepper = 2"
          @submit="submit"
          v-if="createProductInput"
        >
        </product-add-form-step-preview>
      </template>
    </v-stepper>
    <div v-else>
      <v-card outlined>
        <div v-if="loading" class="mx-4 py-2">
          <v-progress-circular
            indeterminate
            :size="18"
            :width="3"
            color="secondary"
          ></v-progress-circular>
        </div>
        <v-alert v-else-if="error" outlined dense type="error" class="ma-2">
          {{ error }}
        </v-alert>
        <v-card-text v-else-if="notFound"> Not Found </v-card-text>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="text" @click="close()"> Close </v-btn>
      </v-card-actions>
    </div>
    <dev-tool-loading-state-menu top="10px" right="10px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/plugins/pinia/stores/main";

import _ from "lodash";
import { camelCase } from "camel-case";

import {
  QueryForProductAddFormQuery,
  useQueryForProductAddFormQuery,
  CreateProductInput,
  useCreateProductMutation,
} from "@/graphql/codegen/generated";

import ProductAddFormStepStart, {
  FormStepStart,
} from "./ProductAddFormStepStart.vue";
import ProductAddFormStepRelations, {
  Relations,
} from "./ProductAddFormStepRelations.vue";
import ProductAddFormStepPreview from "./ProductAddFormStepPreview.vue";

import { useQueryState } from "@/utils/query-state";

interface Fields {
  [key: string]: NonNullable<
    NonNullable<
      NonNullable<QueryForProductAddFormQuery["productType"]>["fields"]
    >["edges"][number]
  >["node"];
}

interface Props {
  productTypeId: number;
}

interface Emits {
  (event: "finished"): void;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

const store = useStore();
const formError = ref<string | null>(null);
const query = useQueryForProductAddFormQuery({
  variables: { typeId: prop.productTypeId },
});
const productType = computed(() => query.data?.value?.productType);
const fields = computed(() =>
  productType.value?.fields?.edges.reduce<Fields>(
    (a, e) =>
      e?.node?.field?.name
        ? {
            ...a,
            ...{ [camelCase(e.node.field.name)]: e.node },
          }
        : a,
    {}
  )
);
const stepper = ref(1);
const formStepStart = ref<FormStepStart | null>(null);
const formStepRelation = ref<Relations | null>(null);
const createProductInput = ref<CreateProductInput | null>(null);

function preview() {
  try {
    if (formStepStart.value === null) throw new Error("formStepStart is null");
    if (formStepRelation.value === null)
      throw new Error("formStepRelation is null");
    createProductInput.value = composeCreateProductInput(
      prop.productTypeId,
      formStepStart.value,
      formStepRelation.value
    );
  } catch (e: any) {
    formError.value = e;
  } finally {
    stepper.value = 3;
  }
}
function composeCreateProductInput(
  productTypeId: number,
  formStepStart: FormStepStart,
  formStepRelation: Relations
): CreateProductInput {
  const paths = formStepStart.paths
    .split("\n")
    .map((x) => x.trim()) // trim e.g., " /a/b/c " => "/a/b/c"
    .filter(Boolean) // remove empty strings
    .filter((v, i, a) => a.indexOf(v) === i); // unique

  // unique https://medium.com/coding-at-dawn/how-to-use-set-to-filter-unique-items-in-javascript-es6-196c55ce924b
  const relations: Relations = [
    ...new Set(formStepRelation.map((o) => JSON.stringify(o))),
  ].map((s) => JSON.parse(s));

  const keys = ["contact", "dateProduced", "producedBy"].filter(
    (k) => k in (fields.value || [])
  );
  const attributes = keys.reduce((a, k) => {
    const assoc = fields.value?.[k];
    if (!assoc) return a;
    if (!assoc.field?.type_) return a;
    const typeName = camelCase(assoc.field.type_);
    a[typeName] = a[typeName] ? a[typeName] : [];
    a[typeName].push({
      fieldId: assoc.fieldId,
      value: formStepStart[k],
    });
    return a;
  }, {} as NonNullable<CreateProductInput["attributes"]>);

  return {
    name: formStepStart.name,
    note: formStepStart.note,
    typeId: productTypeId,
    paths,
    relations,
    attributes,
  };
}

async function submit() {
  try {
    if (createProductInput.value === null)
      throw new Error("createProductInput is null");
    await addProduct(createProductInput.value);
  } catch (e: any) {
    formError.value = e;
    stepper.value = 1;
    return;
  }
  store.apolloMutationCalled();
  store.setSnackbarMessage("Added");
  close();
}

const { executeMutation } = useCreateProductMutation();

async function addProduct(createProductInput: CreateProductInput) {
  try {
    const { error } = await executeMutation({ input: createProductInput });
    if (error) throw error;
    // TODO: Might need to delete cache
  } catch (e: any) {}
}

function close() {
  emit("finished");
}

const { loaded, loading, error, notFound, devtoolState } = useQueryState(
  query,
  {
    isNull: () => productType.value === null,
  }
);
</script>
