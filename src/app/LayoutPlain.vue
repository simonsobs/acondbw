<template>
  <v-main>
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :key="route.path" :is="Component" />
      </keep-alive>
    </router-view>
  </v-main>
</template>

<script setup lang="ts"></script>

<style>
.v-main {
  height: 100%;
  overflow-y: scroll;
}

/* v-main__wrap probably doesn't exit in Vuetify 3 */
.v-main__wrap {
  height: 100%;
}
</style>
