<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { marked } from "marked";

interface Props {
  markdown: string;
}

const prop = defineProps<Props>();

const html = computed(() => marked(prop.markdown));
</script>
