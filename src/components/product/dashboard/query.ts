import { computed, ref } from "vue";
import type { Ref } from "vue";
import { useAllProductTypesQuery } from "@/graphql/codegen/generated";
import { refThrottled } from "@vueuse/core";

import type { Connection } from "./type";

export function useQuery() {
  const query = useAllProductTypesQuery();
  const connection = computed(() => query.data?.value?.allProductTypes);

  const { refresh, refreshing } = useRefresh(query);

  const loading = computed(() => query.fetching.value || refreshing.value);
  const error = ref(query.error);

  const { notFound, edges, nodes, empty } = useConnection(connection);

  return {
    query,
    connection,
    edges,
    nodes,
    notFound,
    empty,
    loading,
    error,
    refresh,
  };
}

function useRefresh(query: {
  executeQuery: (ops?: { requestPolicy?: "network-only" }) => PromiseLike<any>;
}) {
  const _refreshing = ref(false);

  // Throttle so as to avoid flickering
  const refreshing = refThrottled(_refreshing, 300);

  const refresh = async () => {
    _refreshing.value = true;
    await query.executeQuery({ requestPolicy: "network-only" });
    _refreshing.value = false;
  };
  return { refresh, refreshing };
}

function useConnection<Node>(
  connection: Ref<Connection<Node> | null | undefined>
) {
  const notFound = computed(() => connection.value === null);
  const edges = computed(
    () => connection.value?.edges.flatMap((e) => (e ? [e] : [])) || []
  );
  const nodes = computed<Node[]>(() =>
    edges.value.flatMap((e) => e.node || [])
  );
  const empty = computed(() => nodes.value.length === 0);

  return { notFound, edges, nodes, empty };
}
