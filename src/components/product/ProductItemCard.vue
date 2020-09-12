<template>
  <div class="product-item-card" style="position: relative;">
    <v-card outlined hover style="max-width: 980px;">
      <div v-if="state == State.LOADING" class="mx-4 py-2">
        <v-progress-circular indeterminate :size="18" :width="3" color="grey"></v-progress-circular>
      </div>
      <v-alert v-else-if="state == State.ERROR" outlined dense type="error" class="ma-2">{{ error }}</v-alert>
      <div v-else-if="state == State.LOADED" @click="$emit('expand')" style="cursor: default;">
        <v-container fluid class="pa-0">
          <v-row class="ma-0 px-0">
            <v-col order="1" cols="9" md="4" class="py-2">
              <div class="caption grey--text">Name</div>
              <div class="font-weight-bold primary--text">
                <span @click.stop>
                  <router-link
                    :to="{ name: 'ProductItem', params: { productTypeName: node.type_.name, name: node.name } }"
                    v-text="node.name"
                  ></router-link>
                </span>
              </div>
            </v-col>
            <v-col order="3" cols="6" md="3" class="py-2">
              <div class="caption grey--text">Date produced</div>
              <div v-text="node.dateProduced"></div>
            </v-col>
            <v-col order="4" cols="6" md="2" class="py-2">
              <div class="caption grey--text">Produced by</div>
              <div v-text="node.producedBy"></div>
            </v-col>
            <v-col order="2" order-md="5" cols="3" align-self="center" class="py-2">
              <v-row align="start" justify="end" class="px-1 py-0">
                <div v-if="collapsible">
                  <v-tooltip bottom open-delay="800">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        @click.stop="
                      collapsed ? $emit('expand') : $emit('collapse')
                    "
                        v-on="on"
                      >
                        <v-icon>
                          {{
                          collapsed ? "mdi-chevron-down" : "mdi-chevron-up"
                          }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>{{ collapsed ? "Expand" : "Collapse" }}</span>
                  </v-tooltip>
                </div>
                <span @click.stop>
                  <v-menu left bottom offset-y v-model="menu" :close-on-content-click="false">
                    <template v-slot:activator="{ on: menu }">
                      <v-btn icon v-on="{ ...menu }">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-dialog
                        v-model="editDialog"
                        persistent
                        fullscreen
                        transition="dialog-bottom-transition"
                      >
                        <template v-slot:activator="{ on: editDialog }">
                          <v-list-item :disabled="disableEdit" v-on="{ ...editDialog }">
                            <v-list-item-icon>
                              <v-icon :disabled="disableEdit">mdi-pencil</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Update</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                        <v-card>
                          <v-app-bar
                            dense
                            color="secondary"
                            style="position: sticky; top: 0; z-index: 999;"
                          >
                            <v-btn icon dark @click=" menu = false; editDialog = false">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </v-app-bar>
                          <ProductEditForm
                            :productId="node.productId"
                            v-on:finished="menu = false; editDialog = false"
                          ></ProductEditForm>
                        </v-card>
                      </v-dialog>
                      <v-dialog v-model="deleteDialog" max-width="600">
                        <template v-slot:activator="{ on: deleteDialog }">
                          <v-list-item :disabled="disableDelete" v-on="{ ...deleteDialog }">
                            <v-list-item-icon>
                              <v-icon :disabled="disableDelete">mdi-delete</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Delete</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                        <ProductDeleteForm
                          :productId="node.productId"
                          v-on:finished="deleteDialog = false; menu = false"
                          v-on:deleted="deleteDialog = false; menu = false; node = null; $emit('deleted')"
                        ></ProductDeleteForm>
                      </v-dialog>
                    </v-list>
                  </v-menu>
                </span>
              </v-row>
            </v-col>
          </v-row>
          <v-expand-transition>
            <v-row class="mx-0 px-0 collapsible" v-show="!(collapsible && collapsed)">
              <v-col cols="12" md="4" class="py-2">
                <div class="caption grey--text">Contact</div>
                <div v-text="node.contact"></div>
              </v-col>
              <v-col cols="6" md="3" class="py-2">
                <div class="caption grey--text">Date posted</div>
                <div v-text="node.datePosted"></div>
              </v-col>
              <v-col cols="6" md="5" class="py-2">
                <div class="caption grey--text">Posted by</div>
                <div v-text="node.postedBy"></div>
              </v-col>
              <v-col cols="6" md="3" offset-md="4" class="py-2">
                <div class="caption grey--text">Date updated</div>
                <div v-if="node.dateUpdated" v-text="node.dateUpdated"></div>
                <div v-else class="body-2 grey--text">N/A</div>
              </v-col>
              <v-col cols="6" md="5" class="py-2">
                <div class="caption grey--text">Updated by</div>
                <div v-if="node.updatedBy" v-text="node.updatedBy"></div>
                <div v-else class="body-2 grey--text">N/A</div>
              </v-col>
              <v-col cols="12" md="8" offset-md="4" class="py-2">
                <div class="caption grey--text">Paths</div>
                <ul v-if="node.paths && node.paths.edges.length > 0">
                  <li
                    v-for="(edgep, index) in node.paths.edges"
                    :key="index"
                    v-text="edgep.node.path"
                  ></li>
                </ul>
                <div v-else class="body-2 grey--text">None</div>
              </v-col>
              <v-col cols="12" md="8" offset-md="4" class="py-2">
                <div class="caption grey--text">Relations</div>
                <div v-if="relations && Object.keys(relations).length > 0">
                  <div v-for="(redges, typeId) in relations" :key="typeId">
                    <span class="capitalize subtitle-2 primary--text">
                      <span v-if="redges.length > 1">{{ redges[0].node.type_.plural }}</span>
                      <span v-else>{{ redges[0].node.type_.singular }}</span>:
                    </span>
                    <span v-for="(redge, index) in redges" :key="index">
                      <router-link
                        class="font-weight-bold primary--text"
                        :to="'/' + redge.node.other.type_.name + '/item/' + redge.node.other.name"
                        v-text="redge.node.other.name"
                      ></router-link>
                      ({{ redge.node.other.type_.name }})<span v-if="index != redges.length - 1">, </span>
                    </span>
                  </div>
                </div>
                <div v-else class="body-2 grey--text">None</div>
              </v-col>
              <v-col cols="12" class="py-2">
                <v-row>
                  <v-col order="2" order-md="0" cols="12" md="4" align-self="end" class="py-0">
                    <span class="grey--text" style="font-size: 65%;">Data ID: {{ dataId }}</span>
                  </v-col>
                  <v-col order="1" cols="12" md="8" class="py-0">
                    <div class="caption grey--text">Note</div>
                    <div v-if="note" v-html="note"></div>
                    <div v-else class="body-2 grey--text">None</div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expand-transition>
        </v-container>
      </div>
      <v-card-text v-else>Nothing to show here.</v-card-text>
    </v-card>
    <dev-tool-loading-state-overriding-menu @state="devtoolState = $event"></dev-tool-loading-state-overriding-menu>
  </div>
</template>

<script>
import _ from "lodash";

import marked from "marked";

import { defaultDataIdFromObject } from "apollo-cache-inmemory";

import PRODUCT from "@/graphql/product/Product.gql";

import ProductEditForm from "@/components/product/ProductEditForm";
import ProductDeleteForm from "@/components/product/ProductDeleteForm";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu";

export default {
  name: "ProductItemCard",
  components: {
    ProductEditForm,
    ProductDeleteForm,
    DevToolLoadingStateOverridingMenu
  },
  props: {
    productId: { default: null }, // node.productId not node.id
    collapsed: { default: false },
    collapsible: { default: false },
    disableEdit: { default: false },
    disableDelete: { default: false }
  },
  data() {
    return {
      menu: false,
      editDialog: false,
      deleteDialog: false,
      node: null,
      error: null,
      devtoolState: null,
      State: State
    };
  },
  computed: {
    state() {
      if (this.devtoolState) {
        return this.devtoolState;
      }

      if (this.loading) {
        return State.LOADING;
      } else if (this.error) {
        return State.ERROR;
      } else if (this.node) {
        return State.LOADED;
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.$apollo.queries.node.loading;
    },
    dataId: function() {
      return defaultDataIdFromObject(this.node);
    },
    note() {
      return this.node.note ? marked(this.node.note) : null;
    },
    relations() {
      if (this.node && this.node.relations.edges.length > 0) {
        return _.groupBy(this.node.relations.edges, "node.type_.typeId");
      } else {
        return null;
      }
    }
  },
  apollo: {
    node: {
      query: PRODUCT,
      variables() {
        return {
          productId: this.productId
        };
      },
      update: data => data.product,
      result(result) {
        this.error = result.error ? result.error : null;
      }
    }
  }
};
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
</style>