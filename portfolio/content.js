import { SECTIONS } from "./render.js";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const LOCAL_API_URL = "http://localhost:8080/api";
// The free Render instance sleeps when idle and takes up to a minute to wake up.
// The built-in content stays on screen meanwhile, so waiting costs the visitor nothing.
const REQUEST_TIMEOUT_MS = 60_000;

/**
 * Where the content API lives: the local API during development, otherwise the one declared with
 * <meta name="portfolio-api" content="https://…/api">. Without either, the site keeps its built-in content.
 */
export const resolveApiUrl = (doc, hostname) =>
  LOCAL_HOSTS.has(hostname) ? LOCAL_API_URL : doc.querySelector('meta[name="portfolio-api"]')?.content || null;

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

/** The CV uploaded from the admin, or null to keep the one shipped with the site. */
export const cvUrl = (apiUrl, content) =>
  content?.cv ? `${apiUrl}/cv?v=${encodeURIComponent(content.cv.updatedAt)}` : null;

/** Points every [data-cv] link at the given CV. */
export const pointCvLinks = (root, url) => {
  if (!url) return;
  root.querySelectorAll("[data-cv]").forEach((link) => link.setAttribute("href", url));
};
