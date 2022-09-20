<template>
  <div>
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <v-card-text v-if="createProductInput">
      <div class="caption grey--text">Name</div>
      <div class="font-weight-bold">{{ createProductInput.name }}</div>
      <div v-for="(a, index) in attributePreview" :key="index">
        <div class="caption grey--text text-capitalize">{{ a.field }}</div>
        <div v-text="a.value"></div>
      </div>
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

<script lang="ts">
import { defineComponent, ref, computed, watch, PropType } from "vue";
import { marked } from "marked";

import QUERY_FOR_PRODUCT_ADD_FORM_PREVIEW from "@/graphql/queries/QueryForProductAddFormRelationsPreview.gql";
import {
  QueryForProductAddFormQuery,
  QueryForProductAddFormRelationsPreviewQuery,
  CreateProductInput,
} from "@/generated/graphql";

import { client } from "@/plugins/urql";

export default defineComponent({
  name: "ProductAddFormStepPreview",
  props: {
    createProductInput: Object as PropType<CreateProductInput>,
    productType: Object as PropType<QueryForProductAddFormQuery["productType"]>,
  },
  data() {
    return {
      error: null,
      attributePreview: null as { field: string; value: any }[] | null,
      relationPreview: null,
      notePreview: null,
    };
  },
  watch: {
    async createProductInput() {
      this.error = null;
      this.attributePreview = null;
      this.relationPreview = null;
      this.notePreview = null;

      if (!this.createProductInput) return;
      if (!this.productType) return;

      try {
        const filedMap =
          this.productType?.fields?.edges.reduce(
            (a, e) =>
              e?.node?.field
                ? Object.assign(a, {
                    [e.node.fieldId]: e.node.field.name.replaceAll("_", " "),
                  })
                : a,
            {} as { [key: number]: string }
          ) || {};

        interface AttributePreviewItem {
          field: string;
          value: any;
        }

        const attributes = this.createProductInput.attributes;
        // @ts-ignore
        this.attributePreview = attributes
          ? Object.values(attributes).reduce(
              // @ts-ignore
              (l, t: { fieldId: number; value: any }[]) => {
                if (t)
                  l.push(
                    ...t.map((p) => ({
                      field: filedMap[p.fieldId],
                      value: p.value,
                    }))
                  );
                return l;
              },
              [] as AttributePreviewItem[]
            )
          : [];

        this.relationPreview = await this.composeRelationPreview(
          this.createProductInput.relations
        );

        this.notePreview = this.createProductInput.note
          ? marked.parse(this.createProductInput.note)
          : null;
      } catch (error) {
        this.error = error;
      }
    },
  },
  methods: {
    async composeRelationPreview(relations: CreateProductInput["relations"]) {
      // https://flaviocopes.com/javascript-async-await-array-map/
      const ret = await Promise.all(
        relations.map(async (r) => {
          const { error, data } = await client
            .query<QueryForProductAddFormRelationsPreviewQuery>(
              QUERY_FOR_PRODUCT_ADD_FORM_PREVIEW,
              {
                productRelationTypeId: r.typeId,
                productId: r.productId,
              }
            )
            .toPromise();
          return {
            relationTypeSingular: data?.productRelationType?.singular,
            productTypeSingular: data?.product?.type_?.singular,
            productName: data?.product?.name,
          };
        })
      );
      return ret;
    },
  },
});
</script>
