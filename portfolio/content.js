import { SECTIONS } from "./render.js";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const LOCAL_API_URL = "http://localhost:8080/api";
const REQUEST_TIMEOUT_MS = 4000;

/**
 * Where the content API lives. Until the API is hosted, the online site keeps its built-in content.
 * Override with <meta name="portfolio-api" content="https://…/api">.
 */
export const resolveApiUrl = (doc, hostname) =>
  doc.querySelector('meta[name="portfolio-api"]')?.content || (LOCAL_HOSTS.has(hostname) ? LOCAL_API_URL : null);

export const fetchPortfolio = async (apiUrl, fetchImpl = fetch) => {
  const response = await fetchImpl(`${apiUrl}/portfolio`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!response.ok) {
    throw new Error(`Portfolio API answered ${response.status}`);
  }
  return response.json();
};

/** Replaces each [data-content] container with the API's version. Returns the updated containers. */
export const fillSections = (root, content) =>
  [...root.querySelectorAll("[data-content]")]
    .filter((container) => SECTIONS[container.dataset.content])
    .map((container) => {
      container.innerHTML = SECTIONS[container.dataset.content](content);
      return container;
    });
