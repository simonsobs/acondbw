<template>
  <v-card
    variant="outlined"
    hover
    class="product-item-card"
    style="position: relative"
  >
    <v-card-text v-if="loading">
      <v-progress-circular
        indeterminate
        :size="18"
        :width="3"
        color="secondary"
      >
      </v-progress-circular>
    </v-card-text>
    <v-alert v-else-if="error" variant="tonal" type="error" :text="error">
    </v-alert>
    <v-container
      v-else-if="loaded && node"
      @click="emit('update:collapsed', false)"
      style="cursor: default"
    >
      <v-row>
        <v-col order="1" cols="9" md="4">
          <div class="text-h5 font-weight-medium text-primary">
            <span @click.stop>
              <router-link
                :to="{
                  name: 'ProductItem',
                  params: {
                    productTypeName: node.type_.name,
                    name: node.name,
                  },
                }"
                v-text="node.name"
                v-if="node.type_"
                class="text-decoration-none"
                style="color: inherit"
              >
              </router-link>
            </span>
          </div>
        </v-col>
        <v-col order="3" cols="6" md="3">
          <div class="text-caption">Date produced</div>
          <div
            v-if="attributes"
            v-text="attributes['date_produced']['value']"
          ></div>
        </v-col>
        <v-col order="4" cols="6" md="2">
          <div class="text-caption">Produced by</div>
          <div
            v-if="attributes"
            v-text="attributes['produced_by']['value']"
          ></div>
        </v-col>
        <v-col order="2" order-md="5" cols="3" align-self="center">
          <v-container>
            <v-row justify="end">
              <v-col v-if="collapsible" style="flex: 0" class="pa-0">
                <toggle-collapse-button
                  :model-value="collapsed"
                  @update:model-value="emit('update:collapsed', $event)"
                >
                </toggle-collapse-button>
              </v-col>
              <v-col @click.stop style="flex: 0" class="pa-0">
                <dot-menu
                  :node="node"
                  :attributes="attributes"
                  @name-changed="emit('nameChanged', $event)"
                  @type-changed="emit('typeChanged', $event)"
                  @deleted="emit('deleted')"
                >
                </dot-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
      <v-expand-transition>
        <div class="collapsible" v-show="!(collapsible && collapsed)">
          <v-row>
            <v-col cols="12" md="4" offset-md="4">
              <div class="text-caption">Contact</div>
              <div
                v-if="attributes"
                v-text="attributes['contact']['value']"
              ></div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8" offset-md="4">
              <div class="text-caption">Paths</div>
              <paths :paths="node.paths" v-if="node.paths"></paths>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8" offset-md="4">
              <div class="text-caption">Relations</div>
              <relations
                :relations="node.relations"
                v-if="node.relations"
              ></relations>
            </v-col>
          </v-row>
          <v-row>
            <v-col order="1" cols="12" md="8" offset-md="4">
              <div class="text-caption">Note</div>
              <note :markdown="node.note" v-if="node.note"></note>
              <div v-else class="text-body-2">None</div>
            </v-col>
          </v-row>
          <bottom-row :node="node"></bottom-row>
        </div>
      </v-expand-transition>
    </v-container>
    <v-card-text v-else-if="notFound">Not Found</v-card-text>
    <dev-tool-loading-state-menu top="10px" right="10px" v-model="devtoolState">
    </dev-tool-loading-state-menu>
  </v-card>
</template>

<script setup lang="ts">
import { computed, withDefaults } from "vue";

import { useProductQuery } from "@/graphql/codegen/generated";

import { useQueryState } from "@/utils/query-state";

import ToggleCollapseButton from "./ToggleCollapseButton.vue";
import DotMenu from "./DotMenu.vue";
import Paths from "./Paths.vue";
import Relations from "./Relations.vue";
import Note from "./note/Note.vue";
import BottomRow from "./BottomRow.vue";

interface Attribute {
  fieldId: number;
  name: string;
  value: unknown;
}

interface Attributes {
  [key: string]: Attribute;
}

interface Props {
  productId: number;
  collapsed?: boolean;
  collapsible?: boolean;
}

interface Emits {
  (e: "nameChanged", value: string): void;
  (e: "typeChanged", value: string): void;
  (e: "deleted", value: void): void;
  (e: "update:collapsed", value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  collapsible: false,
});
const emit = defineEmits<Emits>();

const query = useProductQuery({ variables: { productId: props.productId } });
const node = computed(() => query.data?.value?.product);

const attributes = computed<Attributes>(() => {
  if (!node.value) return {};
  const thisNode = node.value;

  const keys = [
    "attributesUnicodeText",
    "attributesBoolean",
    "attributesInteger",
    "attributesFloat",
    "attributesDate",
    "attributesDateTime",
    "attributesTime",
  ].filter((k) => k in thisNode);

  const ret = keys.reduce(
    (a, key) => ({
      ...a,
      ...thisNode[key].edges.reduce(
        (r, { node }) => ({
          ...r,
          ...{
            [node.field.name]: {
              fieldId: node.fieldId,
              name: node.field.name,
              value: node.value,
            },
          },
        }),
        {}
      ),
    }),
    {} as Attributes
  );
  return ret;
});

const queryState = useQueryState(query, { isNull: () => node.value === null });
const { loading, loaded, notFound, error, devtoolState } = queryState;
</script>
