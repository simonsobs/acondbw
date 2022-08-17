import { AUTH_STATE, redirectToGitHubAuthURL } from "@/utils/auth";

describe("redirectToGitHubAuthURL", () => {
  const gitHubOAuthAppInfo = {
    clientId: "012345",
    redirectUri: "http://localhost:8081/oauth-redirect",
    authorizeUrl: "https://github.com/login/oauth/authorize",
  };
  const scope = "read:org";
  const state = "state-string";

  // https://stackoverflow.com/a/60697570/7309855
  const locationOrg = window.location;
  // @ts-ignore
  delete window.location;

  let apolloClient;

  beforeEach(() => {
    window.location = { ...locationOrg, assign: jest.fn() };
    apolloClient = { query: jest.fn() };
  });
  afterEach(() => {
    window.location = locationOrg;
  });

  it("success", async () => {
    apolloClient.query.mockResolvedValue({ data: { gitHubOAuthAppInfo } });
    await redirectToGitHubAuthURL(apolloClient, scope, state);
    expect(window.location.assign).toHaveBeenCalled();
    const lastCall = (window.location.assign as jest.Mock).mock.lastCall;
    const href = lastCall[0];
    const url = href.split("?")[0];
    const query: any = getJsonFromUrl(href);
    expect(url).toBe("https://github.com/login/oauth/authorize");
    const expected = {
      client_id: "012345",
      redirect_uri: "http://localhost:8081/oauth-redirect",
      response_type: "code",
      scope: "read:org",
      state: "state-string",
    };
    expect(query).toEqual(expected);
  });
});

// https://stackoverflow.com/a/8486188/7309855
function getJsonFromUrl(url) {
  var question = url.indexOf("?");
  var hash = url.indexOf("#");
  if (hash == -1 && question == -1) return {};
  if (hash == -1) hash = url.length;
  var query =
    question == -1 || hash == question + 1
      ? url.substring(hash)
      : url.substring(question + 1, hash);
  var result = {};
  query.split("&").forEach(function (part) {
    if (!part) return;
    part = part.split("+").join(" "); // replace every + with space, regexp-free version
    var eq = part.indexOf("=");
    var key = eq > -1 ? part.substr(0, eq) : part;
    var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
    var from = key.indexOf("[");
    if (from == -1) result[decodeURIComponent(key)] = val;
    else {
      var to = key.indexOf("]", from);
      var index = decodeURIComponent(key.substring(from + 1, to));
      key = decodeURIComponent(key.substring(0, from));
      if (!result[key]) result[key] = [];
      if (!index) result[key].push(val);
      else result[key][index] = val;
    }
  });
  return result;
}
