<template>
  <div ref="div" class="markdown-body" v-html="html"></div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { useMarkdown } from "@/utils/markdown";
import { useEditHtml } from "./edit-html";
import { useMathJax } from "./mathjax";
interface Props {
  markdown: string;
}
const prop = defineProps<Props>();
const div = ref<HTMLDivElement>();
const { markdown } = toRefs(prop);
const { html: _html } = useMarkdown(markdown);
const html = useEditHtml(_html);
useMathJax(div);
</script>
