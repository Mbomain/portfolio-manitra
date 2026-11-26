import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fetchPortfolio, fillSections, resolveApiUrl } from "../content.js";

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
