<template>
  <div v-if="count === 0" class="text-body-2">None</div>
  <div v-for="(r, key) in relations" :key="key">
    <span class="text-capitalize text-subtitle-2 ml-3">
      {{ r.relationType }}:
    </span>
    <div v-for="(t, key_) in r.types" :key="key_">
      <span class="text-capitalize text-subtitle-2 ml-6"> {{ t.type }}: </span>
      <span v-for="(n, i) in t.nodes" :key="i" class="text-primary">
        <router-link
          :to="n.to"
          v-text="n.name"
          class="font-weight-bold"
          style="color: inherit"
        ></router-link>
        <span v-if="i != t.nodes.length - 1">, </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ProductQuery } from "@/graphql/codegen/generated";

type Relations = NonNullable<NonNullable<ProductQuery["product"]>["relations"]>;

interface Props {
  relations: Relations;
}
const prop = defineProps<Props>();

const count = computed(() => prop.relations.edges.length);

const relations = computed(() =>
  prop.relations.edges.reduce((acc, cur) => {
    const relationType = cur?.node?.type_;
    if (!relationType) return acc;
    const other = cur?.node?.other;
    if (!other) return acc;
    if (!other.type_) return acc;
    if (acc === null) acc = {};
    if (!(relationType.typeId in acc)) {
      acc[relationType.typeId] = {
        relationType: relationType.singular || relationType.name,
        types: {},
      };
    } else {
      acc[relationType.typeId].relationType =
        relationType.plural || relationType.name;
    }
    if (!(other.typeId in acc[relationType.typeId].types)) {
      acc[relationType.typeId].types[other.typeId] = {
        type: other.type_.singular || other.type_.name,
        nodes: [],
      };
    } else {
      acc[relationType.typeId].types[other.typeId].type =
        other.type_.plural || other.type_.name;
    }
    const node = {
      name: other.name,
      to: {
        name: "ProductItem",
        params: {
          productTypeName: other.type_.name,
          name: other.name,
        },
      },
      type: other.type_.name,
    };
    acc[relationType.typeId].types[other.typeId].nodes.push(node);
    return acc;
  }, {} as { [key: string]: { relationType: string; types: { [key: string]: { type: string; nodes: { name: string; to: any }[] } } } })
);
</script>
