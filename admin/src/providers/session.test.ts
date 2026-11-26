import { session } from "./session";

const activeSession = { username: "admin", token: "jwt", expiresAt: "2030-01-01T00:00:00Z" };

describe("session", () => {
  beforeEach(() => localStorage.clear());

  it("remembers the signed-in admin", () => {
    session.save(activeSession);

    expect(session.current(new Date("2029-12-31T23:59:59Z"))).toEqual(activeSession);
  });

  it("forgets a session once it has expired", () => {
    session.save(activeSession);

    expect(session.current(new Date("2030-01-01T00:00:00Z"))).toBeNull();
  });

  it("forgets everything on clear", () => {
    session.save(activeSession);
    session.clear();

    expect(session.current()).toBeNull();
  });
});
