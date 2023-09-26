import { computed } from "vue";
import { useAllProductTypesQuery } from "@/graphql/codegen/generated";

export function useQuery() {
  const query = useAllProductTypesQuery();
  const connection = computed(() => query.data?.value?.allProductTypes);
  const edges = computed(
    () => connection.value?.edges.flatMap((e) => (e ? [e] : [])) || []
  );
  const nodes = computed(() => edges.value.flatMap((e) => e.node || []));
  const isNull = computed(() => connection.value === null);
  const isEmpty = computed(() => nodes.value.length === 0);
  return {
    query,
    connection,
    edges,
    nodes,
    isNull,
    isEmpty,
  };
}
