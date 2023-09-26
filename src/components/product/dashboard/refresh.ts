import { watch } from "vue";
import { useStore } from "@/plugins/pinia/stores/main";

export function useRefreshOnMutation(refresh: () => Promise<any>) {
  const store = useStore();
  watch(
    () => store.nApolloMutations,
    async () => {
      await refresh();
    }
  );
}
