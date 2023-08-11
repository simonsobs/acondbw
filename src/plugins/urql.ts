import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  makeOperation,
} from "@urql/vue";
// import { cacheExchange } from "@urql/exchange-graphcache";
// import { relayPagination } from "@urql/exchange-graphcache/extras";
import { authExchange } from "@urql/exchange-auth";
import { devtoolsExchange } from "@urql/devtools";

import { AUTH_TOKEN } from "@/utils/auth";

// https://formidable.com/open-source/urql/docs/api/auth-exchange/
// https://formidable.com/open-source/urql/docs/advanced/authentication/

function readTokenFromLocalStorage() {
  const tokenJson = localStorage.getItem(AUTH_TOKEN);
  return tokenJson && (JSON.parse(tokenJson) as string);
}

const getAuth = async ({ authState }) => {
  if (!authState) {
    const token = readTokenFromLocalStorage();
    if (token) {
      return { token };
    }
    return null;
  }

  return null;
};

const addAuthToOperation = ({ authState, operation }) => {
  //   if (!authState || !authState.token) {
  //     return operation;
  //   }

  // NOTE: Getting the token from localStorage every time for now because it is
  // not clear how to correctly set up willAuthError() or didAuthError() such
  // that getAuth() is called after singed in.
  // https://stackoverflow.com/a/68299597/7309855
  // An alternative solution is to create a new client when the user signs in.
  // https://github.com/FormidableLabs/urql/discussions/2246
  const token = readTokenFromLocalStorage();
  if (!token) return operation;

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
        Authorization: `Bearer "${token}"`,
      },
    },
  });
};

function createUrqlClient(url: string) {
  return createClient({
    url,
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      cacheExchange, // default document cache
      // cacheExchange({ // for graphcache, not clear how to initialize it
      //   resolvers: {
      //     productType: { products: relayPagination() },
      //   },
      // }),
      authExchange({ getAuth, addAuthToOperation }),
      fetchExchange,
    ],
  });
}

export { createUrqlClient };
