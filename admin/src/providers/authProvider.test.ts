import { authProvider } from "./authProvider";
import { session } from "./session";

const IN_ONE_HOUR = () => new Date(Date.now() + 3_600_000).toISOString();

const respondWith = (status: number, body: unknown = {}) =>
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(body), { status })));

describe("authProvider", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("opens a session with the token issued by the API", async () => {
    respondWith(200, { token: "jwt", expiresAt: IN_ONE_HOUR() });

    await authProvider.login({ username: "admin", password: "secret" });

    expect(session.current()?.token).toBe("jwt");
    await expect(authProvider.checkAuth({})).resolves.toBeUndefined();
  });

  it("explains a refused login in French", async () => {
    respondWith(401);

    await expect(authProvider.login({ username: "admin", password: "wrong" })).rejects.toThrow(
      "Identifiant ou mot de passe incorrect",
    );
    expect(session.current()).toBeNull();
  });

  it("asks to sign in again when the API rejects the token", async () => {
    session.save({ username: "admin", token: "jwt", expiresAt: IN_ONE_HOUR() });

    await expect(authProvider.checkError({ status: 401 })).rejects.toThrow();
    expect(session.current()).toBeNull();
  });

  it("keeps the session on other errors", async () => {
    session.save({ username: "admin", token: "jwt", expiresAt: IN_ONE_HOUR() });

    await expect(authProvider.checkError({ status: 500 })).resolves.toBeUndefined();
    expect(session.current()).not.toBeNull();
  });

  it("identifies the signed-in admin", async () => {
    session.save({ username: "admin", token: "jwt", expiresAt: IN_ONE_HOUR() });

    await expect(authProvider.getIdentity!()).resolves.toEqual({ id: "admin", fullName: "admin" });
  });
});
