export interface Config {
  graphqlHttp: string;
}

export const defaultConfig = {};

export function validateConfig(config: Config) {
  if (typeof config.graphqlHttp !== "string")
    throw Error("graphqlHttp is not string");
  if (config?.graphqlHttp === "") throw Error("apiHttp is empty");
}
