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
import { defineComponent, ref, watch, PropType } from "vue";
import { useClientHandle } from "@urql/vue";
import { marked } from "marked";

import QUERY_FOR_PRODUCT_ADD_FORM_PREVIEW from "@/graphql/queries/QueryForProductAddFormRelationsPreview.gql";
import {
  QueryForProductAddFormQuery,
  QueryForProductAddFormRelationsPreviewQuery,
  CreateProductInput,
} from "@/generated/graphql";

interface AttributePreviewItem {
  field: string;
  value: any;
}

interface RelationPreviewItem {
  relationTypeSingular: string | undefined;
  productTypeSingular: string | undefined;
  productName: string | undefined;
}

export default defineComponent({
  name: "ProductAddFormStepPreview",
  props: {
    createProductInput: Object as PropType<CreateProductInput>,
    productType: Object as PropType<QueryForProductAddFormQuery["productType"]>,
  },
  setup(prop) {
    const urqlClientHandle = useClientHandle();
    const error = ref<any>(null);
    const attributePreview = ref<AttributePreviewItem[] | null>(null);
    const relationPreview = ref<RelationPreviewItem[] | null>(null);
    const notePreview = ref<string | null>(null);

    async function composeRelationPreview(
      relations: CreateProductInput["relations"]
    ): Promise<RelationPreviewItem[]> {
      // https://flaviocopes.com/javascript-async-await-array-map/
      const ret = relations
        ? await Promise.all(
            relations.map(async (r) => {
              const { error, data } = await urqlClientHandle.client
                .query<QueryForProductAddFormRelationsPreviewQuery>(
                  QUERY_FOR_PRODUCT_ADD_FORM_PREVIEW,
                  {
                    productRelationTypeId: r.typeId,
                    productId: r.productId,
                  }
                )
                .toPromise();
              return {
                relationTypeSingular:
                  data?.productRelationType?.singular || undefined,
                productTypeSingular:
                  data?.product?.type_?.singular || undefined,
                productName: data?.product?.name || undefined,
              };
            })
          )
        : [];
      return ret;
    }

    watch(
      () => prop.createProductInput,
      async (val) => {
        error.value = null;
        attributePreview.value = null;
        relationPreview.value = null;
        notePreview.value = null;

        if (!val) return;
        if (!prop.productType) return;

        try {
          const filedMap =
            prop.productType?.fields?.edges.reduce(
              (a, e) =>
                e?.node?.field
                  ? Object.assign(a, {
                      [e.node.fieldId]: e.node.field.name.replaceAll("_", " "),
                    })
                  : a,
              {} as { [key: number]: string }
            ) || {};

          const attributes = val.attributes;
          // @ts-ignore
          attributePreview.value = attributes
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

          relationPreview.value = await composeRelationPreview(val.relations);

          notePreview.value = val.note
            ? marked.parse(val.note)
            : null;
        } catch (e) {
          error.value = e;
        }
      }
    );

    return {
      error,
      attributePreview,
      relationPreview,
      notePreview,
      composeRelationPreview,
    };
  },
});
</script>
