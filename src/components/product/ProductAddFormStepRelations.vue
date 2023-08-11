<template>
  <div>
    <v-card-text>
      <div class="text-caption">New {{ productType.singular }} name</div>
      <div v-text="name"></div>
    </v-card-text>
    <v-card-title class="text-h4 text-primary">
      <span>
        Add <span class="font-italic">relations</span> to other products
      </span>
    </v-card-title>
    <form-relations
      :model-value="modelValue"
      :name="name"
      @update:model-value="$emit('update:modelValue', $event)"
    ></form-relations>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" variant="text" @click="emit('cancel')">
        Cancel
      </v-btn>
      <v-btn color="secondary" variant="text" @click="emit('back')">
        Back
      </v-btn>
      <v-btn color="primary" variant="text" @click="emit('preview')">
        Preview
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup lang="ts">
import FormRelations from "./FormRelations.vue";

interface ProductType {
  singular: string;
}

export type Relations = NonNullable<
  InstanceType<typeof FormRelations>["modelValue"]
>;

interface Props {
  modelValue: Relations | null;
  productType: ProductType;
  name: string;
}

interface Emits {
  (event: "update:modelValue", value: Relations): boolean;
  (event: "cancel"): boolean;
  (event: "back"): boolean;
  (event: "preview"): boolean;
}

const prop = defineProps<Props>();
const emit = defineEmits<Emits>();

// export default defineComponent({
//   name: "ProductAddFormStepRelations",
//   components: {
//     FormRelations,
//   },
//   props: {
//     value: Array as PropType<Relations>,
//     productType: { type: Object as PropType<ProductType>, required: true },
//     name: String,
//   },
// });
</script>
