<template>
  <div ref="div" class="markdown-body" v-html="html"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useParsed } from "./parse";
import { usePrism } from "./prism";
interface Props {
  markdown: string;
}
const prop = defineProps<Props>();
const div = ref<HTMLDivElement>();
const markdown = () => prop.markdown;
const { parsed: html } = useParsed(markdown);
usePrism(div);
</script>
