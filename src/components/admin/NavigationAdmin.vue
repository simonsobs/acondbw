<template>
  <div class="navigation" style="position: relative">
    <v-list shaped>
      <v-list-item
        link
        router
        v-for="(link, index) in links"
        :key="index"
        :to="link.to"
      >
        <v-list-item-action>
          <v-icon v-text="link.icon"></v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title
            v-text="link.title"
            class="capitalize"
          ></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "NavigationAdmin",
  data: () => ({
    edges: null,
    links: [
      { title: "Settings", to: { name: "AdminScratch" }, icon: "mdi-cog" },
    ],
  }),
};
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
</style>
