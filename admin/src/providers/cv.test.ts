import { cvFileProblem, getCvInfo, MAX_CV_SIZE, uploadCv } from "./cv";
import { session } from "./session";

const INFO = { fileName: "CV.pdf", size: 1200, updatedAt: "2026-11-27T08:00:00Z" };

const respondWith = (status: number, body: unknown) => {
  const spy = vi.fn(async (_url: string, _init: RequestInit) => new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", spy);
  return spy;
};

const pdf = (size = 10, name = "CV.pdf", type = "application/pdf") =>
  new File([new Uint8Array(size)], name, { type });

describe("CV", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("reads the current CV", async () => {
    respondWith(200, INFO);

    expect(await getCvInfo()).toEqual(INFO);
  });

  it("reports that no CV was uploaded yet", async () => {
    respondWith(404, { detail: "No CV has been uploaded yet" });

    expect(await getCvInfo()).toBeNull();
  });

  it("uploads the file as a form, with the admin's token", async () => {
    session.save({ username: "admin", token: "jwt", expiresAt: "2999-01-01T00:00:00Z" });
    const spy = respondWith(200, INFO);
    const file = pdf();

    expect(await uploadCv(file)).toEqual(INFO);

    const [url, init] = spy.mock.calls[0];
    expect(url).toMatch(/\/cv$/);
    expect(init.method).toBe("PUT");
    expect((init.body as FormData).get("file")).toBeInstanceOf(File);
    const headers = new Headers(init.headers);
    expect(headers.get("Authorization")).toBe("Bearer jwt");
    expect(headers.has("Content-Type")).toBe(false); // the browser sets the multipart boundary
  });

  it("accepts only PDF files up to 5 MB", () => {
    expect(cvFileProblem(pdf())).toBeNull();
    expect(cvFileProblem(pdf(10, "CV.docx", "application/msword"))).toMatch(/PDF/);
    expect(cvFileProblem(pdf(MAX_CV_SIZE + 1))).toMatch(/5 Mo/);
  });
});
