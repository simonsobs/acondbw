<template>
  <div>
    <v-card-text>
      <div class="text-caption grey--text">
        New {{ productType.singular }} name
      </div>
      <div class="grey--text text--darken-3" v-text="name"></div>
    </v-card-text>
    <v-card-title class="text-h4 primary--text">
      <span>
        Add <span class="font-italic">relations</span> to other products
      </span>
    </v-card-title>
    <form-relations
      :value="value"
      :name="name"
      @input="$emit('input', $event)"
    ></form-relations>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')">Cancel</v-btn>
      <v-btn color="secondary" text @click="$emit('back')">Back</v-btn>
      <v-btn color="primary" text @click="$emit('preview')">Preview</v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import FormRelations, { Relation } from "./FormRelations.vue";

interface ProductType {
  singular: string;
}

export { Relation };

export default defineComponent({
  name: "ProductAddFormStepRelations",
  components: {
    FormRelations,
  },
  props: {
    value: Array as PropType<Relation[]>,
    productType: { type: Object as PropType<ProductType>, required: true },
    name: String,
  },
});
</script>
