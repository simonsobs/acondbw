<template>
  <div class="product-top">
    <v-container fluid>
      <v-row class="display-1 mx-1 mt-3 primary--text" style="max-width: 980px;">
        <v-col col="8" class="pa-0 ma-0">
          <span class="me-2">
            <v-icon>{{ icon }}</v-icon>
          </span>
          {{ title }}
          <span v-if="itemPage">
            <v-icon large color="primary">mdi-chevron-right</v-icon>
            {{ itemName }}
          </span>
        </v-col>
      </v-row>
      <transition :name="transitionName" :mode="transitionMode">
        <keep-alive>
          <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
      </transition>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Maps",
  props: {
    title: { default: "Product Type Name" },
    icon: { default: "mdi-nut" },
    itemPageName: { default: "ProductItemPageName" }
  },
  data: () => ({
    transitionName: "fade-product-top-leave",
    transitionMode: "out-in"
  }),
  computed: {
    itemPage() {
      return this.$route.name == this.itemPageName;
    },
    itemName() {
      return this.$route.params.name;
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.transitionName = "fade-product-top-update";
    this.transitionMode = "out-in";
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.transitionName = "fade-product-top-leave";
    this.transitionMode = "out-in";
    next();
  }
};
</script>

<style scoped>
.fade-product-top-update-enter-active {
  transition: opacity 0.2s;
}

.fade-product-top-update-leave-active {
  transition: opacity 0s;
}

.fade-product-top-update-enter,
.fade-product-top-update-leave-to {
  opacity: 0;
}

.fade-product-top-leave-enter-active {
  transition: opacity 0s;
}

.fade-product-top-leave-leave-active {
  transition: opacity 0s;
}

.fade-product-top-leave-enter {
  opacity: 1;
}

.fade-product-top-leave-leave-to {
  opacity: 1;
}
</style>
