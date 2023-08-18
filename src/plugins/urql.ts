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

import { readTokenFromLocalStorage } from "@/utils/auth";

// https://www.npmjs.com/package/@urql/exchange-auth
// https://formidable.com/open-source/urql/docs/api/auth-exchange/
// https://formidable.com/open-source/urql/docs/advanced/authentication/

const authExchange_ = authExchange(async (utils) => {
  // const token = readTokenFromLocalStorage();
  return {
    addAuthToOperation(operation) {
      // NOTE: Getting the token from localStorage every time for now because it is
      // not clear how to correctly set up willAuthError() or didAuthError() such
      // that getAuth() is called after singed in.
      // https://stackoverflow.com/a/68299597/7309855
      // An alternative solution is to create a new client when the user signs in.
      // https://github.com/FormidableLabs/urql/discussions/2246
      const token = readTokenFromLocalStorage();
      if (token) {
        return utils.appendHeaders(operation, {
          Authorization: `Bearer "${token}"`,
        });
      }
      return operation;
    },
    didAuthError(error, _operation) {
      return error.graphQLErrors.some(
        (e) => e.extensions?.code === "FORBIDDEN"
      );
    },
    async refreshAuth() {},
  };
});

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
      authExchange_,
      fetchExchange,
    ],
  });
}

export { createUrqlClient };
