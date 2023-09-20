<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<script setup lang="ts">
import { useParsed } from "./parse";

interface Props {
  markdown: string;
}

const prop = defineProps<Props>();

const markdown = () => prop.markdown;

const { parsed: html } = useParsed(markdown);
</script>
