import { ref } from "vue";
import { useClientHandle } from "@urql/vue";
import { QueryProductNameInFormStartDocument } from "@/graphql/codegen/generated";

export function useIsNameAvailable() {
  const urqlClientHandle = useClientHandle();
  const error = ref<any>(null);

  async function isNameAvailable(name: string, productTypeId: number) {
    try {
      const { data } = await urqlClientHandle.client
        .query(
          QueryProductNameInFormStartDocument,
          {
            typeId: productTypeId,
            name: name,
          },
          { requestPolicy: "network-only" }
        )
        .toPromise();
      return !data.product;
    } catch (e) {
      error.value = e;
      return true;
    }
  }

  return { isNameAvailable, error };
}
