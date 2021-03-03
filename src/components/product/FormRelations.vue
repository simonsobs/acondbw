<template>
  <v-container fluid class="" style="position: relative">
    <v-row justify="end" class="">
      <v-col style="flex: 0">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ on }">
            <v-btn icon @click="refetch()" v-on="on">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Refresh</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <template v-if="loaded">
      <v-row class="" v-for="(r, i) in relations" :key="i">
        <v-col>
          <v-card outlined width="100%">
            <v-container class="">
              <v-row>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    label="Relation type"
                    :items="relationTypeItems"
                    clearable
                    v-model="r.typeId"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                    label="Product type"
                    :items="productTypeItems"
                    clearable
                    v-model="r.productTypeId"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    label="Product"
                    :items="productTypeMap[r.productTypeId]"
                    clearable
                    hide-no-data
                    v-model="r.productId"
                  ></v-autocomplete>
                </v-col>
                <v-col align-self="center" cols="1">
                  <v-container>
                    <v-row justify="end">
                      <v-col class="pa-0" style="flex: 0">
                        <v-tooltip bottom open-delay="800">
                          <template v-slot:activator="{ on }">
                            <v-btn icon @click="deleteField(i)" v-on="on">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </template>
                          <span>Delete the field</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col>
        <v-btn color="secondary" outlined text class="" @click="addField()"
          >Add a field</v-btn
        >
      </v-col>
    </v-row>
    <dev-tool-loading-state-overriding-menu
      @state="devtoolState = $event"
    ></dev-tool-loading-state-overriding-menu>
  </v-container>
</template>

<script>
import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/utils/DevToolLoadingStateOverridingMenu";

import QueryForFormRelations from "@/graphql/queries/QueryForFormRelations.gql";

const formRelationDefault = {
  typeId: null,
  productTypeId: null,
  productId: null,
};

export default {
  name: "FormRelations",
  components: {
    DevToolLoadingStateOverridingMenu,
  },
  props: ["relations"],
  data() {
    return {
      allProductRelationTypes: null,
      allProductTypes: null,
      init: true,
      queryError: null,
      devtoolState: null,
      State: State,
      relationTypeItems: null,
      productTypeMap: {},
      productTypeItems: null,
    };
  },
  computed: {
    state() {
      if (this.devtoolState) {
        return this.devtoolState;
      }

      if (this.$apollo.queries.allProductRelationTypes.loading) {
        return State.LOADING;
      } else if (this.queryError) {
        return State.ERROR;
      } else if (this.allProductRelationTypes) {
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
  },
  watch: {
    devtoolState: function () {
      if (this.devtoolState) {
        this.init = this.devtoolState == State.INIT;
      }
      this.queryError =
        this.devtoolState == State.ERROR ? "Error from Dev Tools" : null;
    },
  },
  apollo: {
    allProductRelationTypes: {
      query: QueryForFormRelations,
      result(result) {
        this.init = false;

        this.queryError = result.error ? result.error : null;
        if (this.queryError) {
          return;
        }

        this.allProductRelationTypes = result.data.allProductRelationTypes;
        this.allProductTypes = result.data.allProductTypes;

        this.relationTypeItems = this.allProductRelationTypes.edges.map(
          ({ node }) => ({
            text: node.singular,
            value: node.typeId,
          })
        );

        this.productTypeItems = this.allProductTypes.edges.map(({ node }) => ({
          text: node.singular,
          value: node.typeId,
        }));

        this.productTypeMap = this.allProductTypes.edges.reduce(
          (a, { node }) => ({
            ...a,
            [node.typeId]: node.products.edges.map(({ node }) => ({
              text: node.name,
              value: node.productId,
            })),
          }),
          {}
        );
      },
    },
  },
  methods: {
    addField() {
      this.relations.push({ ...formRelationDefault });
    },
    deleteField(i) {
      this.relations.splice(i, 1);
    },
    refetch() {
      Object.values(this.$apollo.queries).forEach((query) => query.refetch());
    },
  },
};
</script>
