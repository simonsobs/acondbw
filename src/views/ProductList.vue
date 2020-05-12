<template>
  <div class="product-list" style="position: relative;">
    <DevToolLoadingStateOverridingMenu @state="devtoolState = $event"></DevToolLoadingStateOverridingMenu>
    <div v-if="state == State.LOADING" class="mx-2 pt-5">
      <v-progress-circular indeterminate :size="26" color="grey"></v-progress-circular>
    </div>
    <div v-else-if="state == State.ERROR" class="mx-2 pt-5">
      <v-card outlined style="max-width: 980px;">
        <v-card-text>Error: cannot load data</v-card-text>
      </v-card>
    </div>
    <div v-else-if="state == State.LOADED || state == State.EMPTY">
      <v-container fluid class="pa-0">
        <v-row align="start" justify="end" class="ma-0 px-0 pt-3 pb-1" style="max-width: 980px;">
          <v-tooltip bottom open-delay="800">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                @click="$apollo.queries.edges.refetch(); areAllCardsCollapsed = true"
                v-on="on"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Refresh</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-tooltip bottom open-delay="800">
            <template v-slot:activator="{ on }">
              <v-btn icon @click="areAllCardsCollapsed = !areAllCardsCollapsed" v-on="on">
                <v-icon>
                  {{
                  areAllCardsCollapsed
                  ? "mdi-unfold-more-horizontal"
                  : "mdi-unfold-less-horizontal"
                  }}
                </v-icon>
              </v-btn>
            </template>
            <span>
              {{
              areAllCardsCollapsed ? "Expand all" : "Collapse all"
              }}
            </span>
          </v-tooltip>
          <v-dialog v-model="dialog" persistent max-width="980">
            <template v-slot:activator="{ on: dialog }">
              <v-tooltip bottom open-delay="800">
                <template v-slot:activator="{ on: toolip }">
                  <v-btn :disabled="disableAdd" icon v-on="{ ...toolip, ...dialog }">
                    <v-icon>mdi-plus-thick</v-icon>
                  </v-btn>
                </template>
                <span>Add a new {{ productTypeNameSingular }}</span>
              </v-tooltip>
            </template>
            <component :is="productAddForm" v-on:finished="dialog = false"></component>
          </v-dialog>
        </v-row>
      </v-container>
      <div v-if="state == State.LOADED">
        <component
          :is="productItemCard"
          v-for="edge in edges"
          :key="edge.node.id"
          :productId="edge.node[productIdFieldName]"
          collapsible="true"
          :collapsed="isCardCollapsed[edge.node.id]"
          v-on:expand="isCardCollapsed[edge.node.id] = false"
          v-on:collapse="isCardCollapsed[edge.node.id] = true"
          class="my-1"
        ></component>
      </div>
      <div v-else>
        <v-card outlined style="max-width: 980px;">
          <v-card-text>Empty. No {{ productTypeNamePlural }} are found.</v-card-text>
        </v-card>
      </div>
    </div>
    <div v-else class="mx-2 pt-5">
      <v-card outlined style="max-width: 980px;">
        <v-card-text>Nothing to show here.</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import State from "@/utils/LoadingState.js";
import DevToolLoadingStateOverridingMenu from "@/components/DevToolLoadingStateOverridingMenu";

export default {
  name: "ProductList",
  components: {
    DevToolLoadingStateOverridingMenu
  },
  props: {
    productTypeNameSingular: { default: "product" },
    productTypeNamePlural: { default: "products" },
    query: { required: true },
    queryName: { required: true },
    productIdFieldName: { default: "productId" },
    productItemCard: { required: true },
    productAddForm: { required: true },
    disableAdd: { default: false }
  },
  data() {
    return {
      dialog: false,
      edges: null,
      isCardCollapsed: {},
      error: null,
      devtoolState: null,
      State: State
    };
  },
  apollo: {
    edges: {
      query: function() {
        return this.query;
      },
      update: function(data) {
        return data[this.queryName].edges;
      },
      result(result) {
        this.error = null;
        if (result.error) {
          this.error = true;
        }
      }
    }
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
      } else if (this.edges) {
        if (this.edges.length) {
          return State.LOADED;
        } else {
          return State.EMPTY;
        }
      } else {
        return State.NONE;
      }
    },
    loading() {
      return this.$apollo.queries.edges.loading;
    },
    areAllCardsCollapsed: {
      get: function() {
        return Object.keys(this.isCardCollapsed).every(
          i => this.isCardCollapsed[i]
        );
      },
      set: function(v) {
        for (const k in this.isCardCollapsed) {
          this.isCardCollapsed[k] = v;
        }
      }
    }
  },
  watch: {
    edges: function() {
      if (this.edges == undefined) {
        return;
      }
      for (const edge of this.edges) {
        const id = edge.node.id;
        if (!(id in this.isCardCollapsed)) {
          this.isCardCollapsed = {
            ...this.isCardCollapsed,
            [id]: true
          };
          // The above line of the code adds a new element {id: true} to
          // the object this.isCardCollapsed in the way that the new
          // element will be a reactive object of Vue. The commented out
          // code below is simpler but the new element won't be reactive.
          // this.isCardCollapsed[id] = true;
        }
      }
    }
  }
};
</script>
