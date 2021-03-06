<template>
  <v-card
    outlined
    hover
    class="product-item-card"
    style="max-width: 980px; position: relative"
  >
    <v-card-text v-if="loading">
      <v-progress-circular
        indeterminate
        :size="18"
        :width="3"
        color="grey"
      ></v-progress-circular>
    </v-card-text>
    <v-alert v-else-if="error" outlined dense type="error" class="ma-2">{{
      error
    }}</v-alert>
    <v-container
      v-else-if="loaded"
      @click="$emit('expand')"
      style="cursor: default"
      fluid
      class=""
    >
      <v-row>
        <v-col order="1" cols="9" md="4">
          <div class="caption grey--text">Name</div>
          <div class="font-weight-bold primary--text">
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
              ></router-link>
            </span>
          </div>
        </v-col>
        <v-col order="3" cols="6" md="3">
          <div class="caption grey--text">Date produced</div>
          <div v-text="node.dateProduced"></div>
        </v-col>
        <v-col order="4" cols="6" md="2">
          <div class="caption grey--text">Produced by</div>
          <div v-text="node.producedBy"></div>
        </v-col>
        <v-col order="2" order-md="5" cols="3" align-self="center">
          <v-container fluid>
            <v-row justify="end">
              <v-col v-if="collapsible" style="flex: 0" class="pa-0">
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
                        {{ collapsed ? "mdi-chevron-down" : "mdi-chevron-up" }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ collapsed ? "Expand" : "Collapse" }}</span>
                </v-tooltip>
              </v-col>
              <v-col @click.stop style="flex: 0" class="pa-0">
                <v-menu
                  left
                  bottom
                  offset-y
                  v-model="menu"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on: menu }">
                    <v-btn icon v-on="{ ...menu }">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-dialog v-model="changeContactDialog" max-width="600">
                      <template v-slot:activator="{ on: changeContactDialog }">
                        <v-list-item
                          :disabled="disableEdit"
                          v-on="{ ...changeContactDialog }"
                        >
                          <v-list-item-icon>
                            <v-icon :disabled="disableEdit">mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              >Change contact</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <product-change-contact-form
                        :node="node"
                        @cancel="onChangeContactFormCancelled"
                        @finished="onChangeContactFormFinished"
                      ></product-change-contact-form>
                    </v-dialog>
                    <v-dialog v-model="updatePathsDialog" max-width="800">
                      <template v-slot:activator="{ on: updatePathsDialog }">
                        <v-list-item
                          :disabled="disableEdit"
                          v-on="{ ...updatePathsDialog }"
                        >
                          <v-list-item-icon>
                            <v-icon :disabled="disableEdit">mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              >Update paths</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <product-update-paths-form
                        :node="node"
                        @cancel="onUpdatePathsFormCancelled"
                        @finished="onUpdatePathsFormFinished"
                      ></product-update-paths-form>
                    </v-dialog>
                    <v-dialog v-model="updateRelationsDialog" max-width="800">
                      <template v-slot:activator="{ on: updateRelationsDialog }">
                        <v-list-item
                          :disabled="disableEdit"
                          v-on="{ ...updateRelationsDialog }"
                        >
                          <v-list-item-icon>
                            <v-icon :disabled="disableEdit">mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              >Update relations</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <product-update-relations-form
                        :node="node"
                        @cancel="onUpdatePathsFormCancelled"
                        @finished="onUpdatePathsFormFinished"
                      ></product-update-relations-form>
                    </v-dialog>
                    <v-dialog v-model="editNoteDialog" max-width="800">
                      <template v-slot:activator="{ on: editNoteDialog }">
                        <v-list-item
                          :disabled="disableEdit"
                          v-on="{ ...editNoteDialog }"
                        >
                          <v-list-item-icon>
                            <v-icon :disabled="disableEdit">mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              >Edit note</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <product-edit-note-form
                        :node="node"
                        @cancel="onEditNoteFormCancelled"
                        @finished="onEditNoteFormFinished"
                      ></product-edit-note-form>
                    </v-dialog>
                    <v-dialog v-model="deleteDialog" max-width="600">
                      <template v-slot:activator="{ on: deleteDialog }">
                        <v-list-item
                          :disabled="disableDelete"
                          v-on="{ ...deleteDialog }"
                        >
                          <v-list-item-icon>
                            <v-icon :disabled="disableDelete"
                              >mdi-delete</v-icon
                            >
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Delete</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <product-delete-form
                        :productId="node.productId"
                        @cancel="onDeleteFormCancelled"
                        @finished="onDeleteFormFinished"
                      ></product-delete-form>
                    </v-dialog>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
      <v-expand-transition>
        <div class="collapsible" v-show="!(collapsible && collapsed)">
          <v-row>
            <v-col cols="12" md="4" offset-md="4">
              <div class="caption grey--text">Contact</div>
              <div v-text="node.contact"></div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8" offset-md="4">
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
          </v-row>
          <v-row>
            <v-col cols="12" md="8" offset-md="4">
              <div class="caption grey--text">Relations</div>
              <div v-if="relations && Object.keys(relations).length > 0">
                <div v-for="(redges, typeId) in relations" :key="typeId">
                  <span class="capitalize subtitle-2 primary--text">
                    <span v-if="redges.length > 1">{{
                      redges[0].node.type_.plural
                    }}</span>
                    <span v-else>{{ redges[0].node.type_.singular }}</span
                    >:
                  </span>
                  <span v-for="(redge, index) in redges" :key="index">
                    <router-link
                      class="font-weight-bold primary--text"
                      :to="{
                        name: 'ProductItem',
                        params: {
                          productTypeName: redge.node.other.type_.name,
                          name: redge.node.other.name,
                        },
                      }"
                      v-text="redge.node.other.name"
                    ></router-link>
                    ({{ redge.node.other.type_.name }})<span
                      v-if="index != redges.length - 1"
                      >,
                    </span>
                  </span>
                </div>
              </div>
              <div v-else class="body-2 grey--text">None</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col order="1" cols="12" md="8" offset-md="4">
              <div class="caption grey--text">Note</div>
              <div v-if="note" class="markdown-body" v-html="note"></div>
              <div v-else class="body-2 grey--text">None</div>
            </v-col>
          </v-row>
          <v-row
            no-gutters
            align="end"
            justify="space-between"
            class="grey--text mt-3"
            style="font-size: 80%"
          >
            <div>
              <div v-if="timeUpdated || node.updatingGitHubUser">
                Updated
                <span v-if="timeUpdated">at {{ timeUpdated }}</span>
                <span v-if="node.updatingGitHubUser">
                  by {{ node.updatingGitHubUser.login }}</span
                >
              </div>
              <div v-if="timePosted || node.postingGitHubUser">
                Posted
                <span v-if="timePosted">at {{ timePosted }}</span>
                <span v-if="node.postingGitHubUser">
                  by {{ node.postingGitHubUser.login }}</span
                >
              </div>
            </div>
            <div>Data ID: {{ dataId }}</div>
          </v-row>
        </div>
      </v-expand-transition>
    </v-container>
    <v-card-text v-else-if="notFound">Not Found</v-card-text>
    <dev-tool-loading-state-overriding-menu
      @state="devtoolState = $event"
    ></dev-tool-loading-state-overriding-menu>
  </v-card>
</template>

<script>
import _ from "lodash";

import marked from "marked";

import { defaultDataIdFromObject } from "apollo-cache-inmemory";

import PRODUCT from "@/graphql/queries/Product.gql";

import ProductChangeContactForm from "@/components/product/ProductChangeContactForm";
import ProductUpdatePathsForm from "@/components/product/ProductUpdatePathsForm";
import ProductUpdateRelationsForm from "@/components/product/ProductUpdateRelationsForm";
import ProductEditNoteForm from "@/components/product/ProductEditNoteForm";
import ProductDeleteForm from "@/components/product/ProductDeleteForm";

import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu";

export default {
  name: "ProductItemCard",
  components: {
    ProductChangeContactForm,
    ProductUpdatePathsForm,
    ProductUpdateRelationsForm,
    ProductEditNoteForm,
    ProductDeleteForm,
    DevToolLoadingStateOverridingMenu,
  },
  props: {
    productId: { default: null }, // node.productId not node.id
    collapsed: { default: false },
    collapsible: { default: false },
    disableEdit: { default: false },
    disableDelete: { default: false },
  },
  data() {
    return {
      menu: false,
      changeContactDialog: false,
      updatePathsDialog: false,
      updateRelationsDialog: false,
      editNoteDialog: false,
      deleteDialog: false,
      init: true,
      node: null,
      error: null,
      devtoolState: null,
      State: State,
    };
  },
  computed: {
    state() {
      if (this.devtoolState) {
        return this.devtoolState;
      }
      
      if (this.$apollo.queries.node.loading) {
        return State.LOADING;
      } else if (this.error) {
        return State.ERROR;
      } else if (this.node) {
        return State.LOADED;
      } else if (this.init) {
        return State.INIT;
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.state == State.LOADING;
    },
    loaded() {
      return this.state == State.LOADED;
    },
    notFound() {
      return this.state == State.NONE;
    },
    dataId: function () {
      return defaultDataIdFromObject(this.node);
    },
    timePosted() {
      return this.node.timePosted
        ? this.formatDateTime(this.node.timePosted)
        : null;
    },
    timeUpdated() {
      return this.node.timeUpdated
        ? this.formatDateTime(this.node.timeUpdated)
        : null;
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
    },
  },
  watch: {
    devtoolState: function () {
      if (this.devtoolState) {
        this.init = this.devtoolState == State.INIT;
      }
      this.error =
        this.devtoolState == State.ERROR ? "Error from Dev Tools" : null;
    },
  },
  apollo: {
    node: {
      query: PRODUCT,
      variables() {
        return {
          productId: this.productId,
        };
      },
      update: (data) => data.product,
      result(result) {
        this.init = false;
        this.error = result.error ? result.error : null;
      },
    },
  },
  methods: {
    formatDateTime(dateTime) {
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
    },
    onChangeContactFormCancelled() {
      this.closeChangeContactForm();
    },
    onChangeContactFormFinished() {
      this.closeChangeContactForm();
    },
    closeChangeContactForm() {
      this.changeContactDialog = false;
      this.menu = false;
    },
    onUpdatePathsFormCancelled() {
      this.closeUpdatePathsForm();
    },
    onUpdatePathsFormFinished() {
      this.closeUpdatePathsForm();
    },
    closeUpdatePathsForm() {
      this.updatePathsDialog = false;
      this.menu = false;
    },
    onUpdateRelationsFormCancelled() {
      this.closeUpdateRelationsForm();
    },
    onUpdateRelationsFormFinished() {
      this.closeUpdateRelationsForm();
    },
    closeUpdateRelationsForm() {
      this.updateRelationsDialog = false;
      this.menu = false;
    },
    onEditNoteFormCancelled() {
      this.closeEditNoteForm();
    },
    onEditNoteFormFinished() {
      this.closeEditNoteForm();
    },
    closeEditNoteForm() {
      this.editNoteDialog = false;
      this.menu = false;
    },
    onDeleteFormCancelled() {
      this.closeDeleteForm();
    },
    onDeleteFormFinished() {
      this.closeDeleteForm();
      this.node = null;
      this.$emit("deleted");
    },
    closeDeleteForm() {
      this.deleteDialog = false;
      this.menu = false;
    },
  },
};
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
</style>
