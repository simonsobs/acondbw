<template>
  <div ref="div" class="markdown-body" v-html="html"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useParsed } from "./parse";
import { useMathJax } from "./mathjax";
interface Props {
  markdown: string;
}
const prop = defineProps<Props>();
const div = ref<HTMLDivElement>();
const markdown = () => prop.markdown;
const { parsed: html } = useParsed(markdown);
useMathJax(div);
</script>
