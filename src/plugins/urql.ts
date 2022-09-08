import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  makeOperation,
} from "@urql/vue";
import { authExchange } from "@urql/exchange-auth";

import { AUTH_TOKEN } from "@/vue-apollo";

// https://formidable.com/open-source/urql/docs/api/auth-exchange/
// https://formidable.com/open-source/urql/docs/advanced/authentication/

const httpEndpoint =
  process.env.VUE_APP_GRAPHQL_HTTP || "http://localhost:4000/graphql";

const getAuth = async ({ authState }) => {
  if (!authState) {
    const tokenJson = localStorage.getItem(AUTH_TOKEN);
    const token = tokenJson && (JSON.parse(tokenJson) as string);
    if (token) {
      return { token };
    }
    return null;
  }

  return null;
};

const addAuthToOperation = ({ authState, operation }) => {
  console.log(authState);
  console.log(operation);
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
  url: httpEndpoint,
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({ getAuth, addAuthToOperation }),
    fetchExchange,
  ],
});

export { client };
