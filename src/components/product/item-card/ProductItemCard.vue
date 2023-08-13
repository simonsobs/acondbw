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
      @click="$emit('expand')"
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
                  :collapsed="collapsed"
                  @expand="emit('expand')"
                  @collapse="emit('collapse')"
                >
                </toggle-collapse-button>
              </v-col>
              <v-col @click.stop style="flex: 0" class="pa-0">
                <dot-menu
                  :node="node"
                  :attributes="attributes"
                  :disable-edit="disableEdit"
                  :disable-delete="disableDelete"
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
              <ul v-if="node.paths && node.paths.edges.length > 0">
                <li
                  v-for="(edgep, index) in node.paths.edges"
                  :key="index"
                  v-text="edgep && edgep.node && edgep.node.path"
                ></li>
              </ul>
              <div v-else class="text-body-2">None</div>
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
          <v-row
            no-gutters
            align="end"
            justify="space-between"
            class="mt-3"
            style="font-size: 11px"
          >
            <div>
              <div v-if="timeUpdated || node.updatingGitHubUser">
                Updated
                <span v-if="timeUpdated"> at {{ timeUpdated }} </span>
                <span v-if="node.updatingGitHubUser">
                  by {{ node.updatingGitHubUser.login }}
                </span>
              </div>
              <div v-if="timePosted || node.postingGitHubUser">
                Posted
                <span v-if="timePosted"> at {{ timePosted }} </span>
                <span v-if="node.postingGitHubUser">
                  by {{ node.postingGitHubUser.login }}
                </span>
              </div>
            </div>
            <div>ID: {{ node.id }}</div>
          </v-row>
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

import { useProductQuery } from "@/generated/graphql";

import { useQueryState } from "@/utils/query-state";

import ToggleCollapseButton from "./ToggleCollapseButton.vue";
import DotMenu from "./DotMenu.vue";
import Relations from "./Relations.vue";
import Note from "./Note.vue";

interface Attribute {
  fieldId: number;
  name: string;
  value: unknown;
}

interface Attributes {
  [key: string]: Attribute;
}

const props = withDefaults(
  defineProps<{
    productId: number;
    collapsed?: boolean;
    collapsible?: boolean;
    disableEdit?: boolean;
    disableDelete?: boolean;
  }>(),
  {
    collapsed: false,
    collapsible: false,
    disableEdit: false,
    disableDelete: false,
  }
);

interface Emits {
  (e: "nameChanged", value: string | null): void;
  (e: "typeChanged", value: string | null): void;
  (e: "deleted", value: void): void;
  (e: "expand", value: void): void;
  (e: "collapse", value: void): void;
}

const emit = defineEmits<Emits>();

const query = useProductQuery({ variables: { productId: props.productId } });
const node = computed(() => query.data?.value?.product);
const timePosted = computed(() => formatDateTime(node.value?.timePosted));
const timeUpdated = computed(() => formatDateTime(node.value?.timeUpdated));

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
function formatDateTime(dateTime: string | undefined | null) {
  if (!dateTime) return null;
  const sinceEpoch = Date.parse(dateTime);
  const format = Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  return format.format(sinceEpoch);
}

const queryState = useQueryState(query, { isNull: () => node.value === null });
const { loading, loaded, notFound, error, devtoolState } = queryState;
</script>
