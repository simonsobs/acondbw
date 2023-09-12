import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  makeOperation,
} from "@urql/core";
import { authExchange } from "@urql/exchange-auth";
import { pipe, fromValue, fromArray, subscribe } from "wonka";
import { gql } from "graphql-tag";

describe("one", () => {
  it("wonka test", async () => {
    pipe(
      fromArray([1, 2, 3]),
      subscribe((x) => console.log(x))
    );
  });

  it("one", async () => {
    const url = "http://localhost:5001/graphql";

    const getAuth = async ({ authState }) => {
      if (!authState) {
        const token = "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";
        // const token = "HV41CNl97jxwbDtQ";
        return { token };
      }
      return null;
    };

    const addAuthToOperation = ({ authState, operation }) => {
      if (!authState || !authState.token) {
        return operation;
      }

      const fetchOptions =
        typeof operation.context.fetchOptions === "function"
          ? operation.context.fetchOptions()
          : operation.context.fetchOptions || {};

      return makeOperation(operation.kind, operation, {
        ...operation.context,
        fetchOptions: {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer "${authState.token}"`,
          },
        },
      });
    };

    const client = createClient({
      url: url,
      exchanges: [
        // dedupExchange,
        // cacheExchange, // default document cache
        authExchange({ getAuth, addAuthToOperation }),
        fetchExchange,
      ],
    });

    // const executeQuery = () =>
    //   fromValue({
    //     data: { foo: "bar" },
    //   });

    const executeQuery = vi.fn().mockReturnValue(
      fromValue({
        data: { foo: "bar" },
      })
    );

    // @ts-ignore
    // client.executeQuery = executeQuery;

    console.log("subscribeToDebugTarget: ", client.subscribeToDebugTarget);
    const { unsubscribe } =
      client.subscribeToDebugTarget?.((event) => {
        // console.log(event);
        console.log(JSON.stringify(event, null, 2));
      }) || {};

    const spy = vi.spyOn(client, "query");

    const r = await client
      .query(
        gql`
          {
            version
          }
        `,
        {}
      )
      .toPromise();
    // console.log(r);
    // console.log(executeQuery.mock.calls);
    // console.log(JSON.stringify(executeQuery.mock.calls, null, 2));
    // console.log(spy.mock.calls);

    unsubscribe?.();
  });
});
