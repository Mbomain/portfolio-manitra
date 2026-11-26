import { authorizedFetch } from "./dataProvider";
import { session } from "./session";

const fetchSpy = () => {
  const spy = vi.fn(async (_url: string, _init: RequestInit) => new Response("[]", { status: 200 }));
  vi.stubGlobal("fetch", spy);
  return spy;
};

const sentHeaders = (spy: ReturnType<typeof fetchSpy>) => new Headers(spy.mock.calls[0][1].headers);

describe("authorizedFetch", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("sends the admin's token", async () => {
    session.save({ username: "admin", token: "jwt", expiresAt: "2999-01-01T00:00:00Z" });
    const spy = fetchSpy();

    await authorizedFetch("http://api.test/projects");

    expect(sentHeaders(spy).get("Authorization")).toBe("Bearer jwt");
  });

  it("sends no token when nobody is signed in", async () => {
    const spy = fetchSpy();

    await authorizedFetch("http://api.test/projects");

    expect(sentHeaders(spy).has("Authorization")).toBe(false);
  });
});
