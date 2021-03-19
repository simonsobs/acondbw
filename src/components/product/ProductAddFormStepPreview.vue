<template>
  <div>
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <v-card-text v-if="createProductInput">
      <div class="caption grey--text">Name</div>
      <div class="font-weight-bold">{{ createProductInput.name }}</div>
      <div class="caption grey--text">Date produced</div>
      <div v-text="createProductInput.dateProduced"></div>
      <div class="caption grey--text">Produced by</div>
      <div v-text="createProductInput.producedBy"></div>
      <div class="caption grey--text">Contact</div>
      <div v-text="createProductInput.contact"></div>
      <div class="caption grey--text">Paths</div>
      <ul
        v-if="createProductInput.paths && createProductInput.paths.length > 0"
      >
        <li
          v-for="(p, index) in createProductInput.paths"
          :key="index"
          v-text="p"
        ></li>
      </ul>
      <div v-else class="body-2 grey--text">None</div>
      <div class="caption grey--text">Note</div>
      <div v-if="notePreview" class="markdown-body" v-html="notePreview"></div>
      <div v-else class="body-2 grey--text">None</div>
      <div class="caption grey--text">Relations</div>
      <ul v-if="relationPreview && relationPreview.length > 0">
        <li v-for="(r, index) in relationPreview" :key="index">
          {{ r.relationTypeSingular }}: {{ r.productName }} ({{
            r.productTypeSingular
          }})
        </li>
      </ul>
      <div v-else class="body-2 grey--text">None</div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" text @click="$emit('cancel')">Cancel</v-btn>
      <v-btn color="secondary" text @click="$emit('back')">Back</v-btn>
      <v-btn color="primary" text @click="$emit('submit')">Submit</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import marked from "marked";

import gql from "graphql-tag";

export default {
  name: "ProductAddFormStepPreview",
  props: {
    createProductInput: Object,
  },
  data() {
    return {
      error: null,
      relationPreview: null,
      notePreview: null,
    };
  },
  watch: {
    async createProductInput() {
      this.error = null;
      this.relationPreview = null;
      this.notePreview = null;

      if (!this.createProductInput) {
        return;
      }

      try {
        this.relationPreview = await this.composeRelationPreview(
          this.createProductInput.relations
        );

        this.notePreview = this.createProductInput.note
          ? marked(this.createProductInput.note)
          : null;

      } catch (error) {
        this.error = error;
      }
    },
  },
  methods: {
    async composeRelationPreview(relations) {
      const QUERY_FOR_PRODUCT_ADD_FORM_PREVIEW = gql`
        query QueryForProductAddFormRelationsPreview(
          $productRelationTypeId: Int!
          $productId: Int!
        ) {
          productRelationType(typeId: $productRelationTypeId) {
            singular
          }
          product(productId: $productId) {
            name
            type_ {
              singular
            }
          }
        }
      `;

      // https://flaviocopes.com/javascript-async-await-array-map/
      const ret = await Promise.all(
        relations.map(async (r) => {
          const { data } = await this.$apollo.query({
            query: QUERY_FOR_PRODUCT_ADD_FORM_PREVIEW,
            variables: {
              productRelationTypeId: r.typeId,
              productId: r.productId,
            },
          });
          return {
            relationTypeSingular: data.productRelationType.singular,
            productTypeSingular: data.product.type_.singular,
            productName: data.product.name,
          };
        })
      );

      return ret;
    },
  },
};
</script>