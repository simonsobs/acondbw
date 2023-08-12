<template>
  <router-view name="frame"></router-view>
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
  height: calc(100% - 64px); /* 64px: the height of the app bar */
  overflow-y: scroll;
}

/* v-main__wrap probably doesn't exit in Vuetify 3 */
.v-main__wrap {
  height: 100%;
}
</style>
