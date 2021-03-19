<template>
  <div>
    <v-card-text>
      <div class="caption grey--text">New {{ productType.singular }} name</div>
      <div class="grey--text text--darken-2" v-text="name"></div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-title class="primary--text"
      >Add relations to other products</v-card-title
    >
    <form-relations :relations="relations"></form-relations>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')">Cancel</v-btn>
      <v-btn color="secondary" text @click="$emit('back')">Back</v-btn>
      <v-btn color="primary" text @click="$emit('preview')">Preview</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import FormRelations from "./FormRelations";

export default {
  name: "ProductAddFormStepRelations",
  components: {
    FormRelations,
  },
  props: {
    productType: Object,
    name: String,
    relations: Array,
  },
};
</script>
