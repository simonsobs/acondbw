import { ref } from "vue";
import {
  createClient,
  provideClient,
  cacheExchange,
  fetchExchange,
} from "@urql/vue";
// import { cacheExchange } from "@urql/exchange-graphcache";
// import { relayPagination } from "@urql/exchange-graphcache/extras";
import { authExchange } from "@urql/exchange-auth";

import { readTokenFromLocalStorage } from "@/utils/auth";

function useCreateClient(url: string) {
  const authExchange_ = authExchange(async (utils) => {
    // https://www.npmjs.com/package/@urql/exchange-auth
    // https://formidable.com/open-source/urql/docs/api/auth-exchange/
    // https://formidable.com/open-source/urql/docs/advanced/authentication/

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

  return createClient({
    url,
    exchanges: [
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

function useProvideClient(url: string) {
  const client = ref(useCreateClient(url));
  provideClient(client);
}

export { useCreateClient, useProvideClient };
