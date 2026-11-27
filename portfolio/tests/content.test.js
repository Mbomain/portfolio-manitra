import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cvUrl, fetchPortfolio, fillSections, pointCvLinks, resolveApiUrl } from "../content.js";

const documentWith = ({ apiMeta = null, containers = [] } = {}) => ({
  querySelector: (selector) => (selector.includes("portfolio-api") && apiMeta ? { content: apiMeta } : null),
  querySelectorAll: () => containers,
});

const container = (name) => ({ dataset: { content: name }, innerHTML: "built-in" });

describe("resolveApiUrl", () => {
  it("talks to the local API during development", () => {
    assert.equal(resolveApiUrl(documentWith(), "127.0.0.1"), "http://localhost:8080/api");
  });

  it("keeps the built-in content online until an API is configured", () => {
    assert.equal(resolveApiUrl(documentWith(), "manitra-portfolio.vercel.app"), null);
  });

  it("prefers the local API during development, even when the page declares one", () => {
    const doc = documentWith({ apiMeta: "https://api.example.com/api" });

    assert.equal(resolveApiUrl(doc, "localhost"), "http://localhost:8080/api");
  });

  it("follows the API declared in the page", () => {
    const doc = documentWith({ apiMeta: "https://api.example.com/api" });

    assert.equal(resolveApiUrl(doc, "manitra-portfolio.vercel.app"), "https://api.example.com/api");
  });
});

describe("fetchPortfolio", () => {
  it("returns the portfolio content", async () => {
    const fakeFetch = async (url) => ({ ok: true, json: async () => ({ requested: url }) });

    assert.deepEqual(await fetchPortfolio("http://api.test", fakeFetch), { requested: "http://api.test/portfolio" });
  });

  it("fails loudly on an error status so the page keeps its built-in content", async () => {
    const fakeFetch = async () => ({ ok: false, status: 503 });

    await assert.rejects(fetchPortfolio("http://api.test", fakeFetch), /503/);
  });
});

describe("fillSections", () => {
  it("fills known sections and leaves unknown ones alone", () => {
    const languages = container("languages");
    const unknown = container("not-a-section");
    const content = { languages: [{ name: "Français", level: "B2", proficiency: 75 }] };

    const updated = fillSections(documentWith({ containers: [languages, unknown] }), content);

    assert.deepEqual(updated, [languages]);
    assert.match(languages.innerHTML, /Français/);
    assert.equal(unknown.innerHTML, "built-in");
  });
});

describe("cvUrl", () => {
  it("serves the CV uploaded from the admin, versioned so browsers never keep an old one", () => {
    const content = { cv: { fileName: "CV.pdf", updatedAt: "2026-11-27T08:00:00Z" } };

    assert.equal(cvUrl("https://api.test/api", content), "https://api.test/api/cv?v=2026-11-27T08%3A00%3A00Z");
  });

  it("keeps the built-in CV until one is uploaded", () => {
    assert.equal(cvUrl("https://api.test/api", { cv: null }), null);
  });
});

describe("pointCvLinks", () => {
  const link = () => ({ href: "assets/CV.pdf", setAttribute(name, value) { this[name] = value; } });

  it("points the CV links at the given URL", () => {
    const links = [link(), link()];

    pointCvLinks({ querySelectorAll: () => links }, "https://api.test/api/cv");

    assert.deepEqual(links.map(({ href }) => href), ["https://api.test/api/cv", "https://api.test/api/cv"]);
  });

  it("leaves them alone without a URL", () => {
    const links = [link()];

    pointCvLinks({ querySelectorAll: () => links }, null);

    assert.equal(links[0].href, "assets/CV.pdf");
  });
});
