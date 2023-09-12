import { defineComponent, ref, Ref } from "vue";
import { mount, createLocalVue } from "@vue/test-utils";
import { PiniaVuePlugin } from "pinia";
import { useQuery, CombinedError } from "@urql/vue";
import { createTestingPinia } from "@pinia/testing";
import gql from "graphql-tag";
import { fromValue, never } from "wonka";

import { useStore } from "@/plugins/pinia/stores/main";
import { useQueryState } from "@/utils/query-state";

export const FooDocument = gql`
  query foo {
    foo
  }
`;

export type FooQuery = {
  __typename?: "Query";
  foo?: string | null;
};

describe("one", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let store: ReturnType<typeof useStore>;

  function createQueryResponse(client: Ref<{ executeQuery: () => unknown }>) {
    // queryResponse is the return value of useQuery, which needs to be called
    // inside of a component setup(). The useQuery() injects the urql client
    // with the key "$urql".
    let ret: ReturnType<typeof useQuery<FooQuery>> | undefined;
    const dummyComponent = defineComponent({
      setup() {
        ret = useQuery<FooQuery>({ query: FooDocument });
      },
      render() {},
    });
    const pinia = createTestingPinia();
    store = useStore(pinia);
    mount(dummyComponent, {
      localVue,
      pinia,  
      provide: { $urql: client },
    });
    if (!ret) throw new Error("query is undefined");
    return ret;
  }

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(PiniaVuePlugin);
  })

  it("loading", () => {
    const executeQuery = () => never; // fetching
    const client = ref({ executeQuery });
    const query = createQueryResponse(client);
    expect(query.fetching.value).toBe(true);
    const queryState = useQueryState(query);
    // console.log(queryState);
  });
});
