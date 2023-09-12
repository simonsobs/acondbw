import { defineComponent, ref, Ref } from "vue";
import { mount, createLocalVue } from "@vue/test-utils";
import { useQuery, CombinedError } from "@urql/vue";
import gql from "graphql-tag";
import { fromValue, never } from "wonka";

export const FooDocument = gql`
  query foo {
    foo
  }
`;

export type FooQuery = {
  __typename?: "Query";
  foo?: string | null;
};

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
  mount(dummyComponent, {
    localVue: createLocalVue(),
    provide: { $urql: client },
  });
  if (!ret) throw new Error("query is undefined");
  return ret;
}

describe("one", () => {
  it("fetching", () => {
    const executeQuery = () => never; // fetching
    const client = ref({ executeQuery });
    const query = createQueryResponse(client);
    expect(query.fetching.value).toBe(true);
  });

  it("data", () => {
    const executeQuery = () => fromValue({ data: { foo: "bar" } });
    const client = ref({ executeQuery });
    const query = createQueryResponse(client);
    expect(query.fetching.value).toBe(false);
    expect(query.data.value?.foo).toBe("bar");
  });

  it("error", () => {
    const executeQuery = () =>
      fromValue({
        error: new CombinedError({ networkError: new Error("baz") }),
      });
    const client = ref({ executeQuery });
    const query = createQueryResponse(client);
    expect(query.error.value?.message).toEqual(expect.stringContaining("baz"));
  });

  it("example - reactive", async () => {
    const executeQuery = () => never; // fetching
    const client = ref({ executeQuery });
    const query = createQueryResponse(client);

    // fetching initially
    expect(query.fetching.value).toBe(true);

    // provide data
    client.value.executeQuery = () => fromValue({ data: { foo: "bar" } });

    // use time out because not clear how to wait for data
    await new Promise((resolve) => setTimeout(resolve, 10));

    // not fetching anymore, data is available
    expect(query.fetching.value).toBe(false);
    expect(query.data.value?.foo).toBe("bar");
  });
});
