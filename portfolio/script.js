import { fetchPortfolio, fillSections, resolveApiUrl } from "./content.js";

document.documentElement.classList.add("js");

const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canObserve = "IntersectionObserver" in window;

const setFooterYear = () => {
  document.getElementById("year").textContent = new Date().getFullYear();
};

const setUpMobileMenu = () => {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.getElementById("nav-links");
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    links.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  links.addEventListener("click", (event) => event.target.closest("a") && setOpen(false));
};

const setUpNavBorder = () => {
  const nav = document.querySelector(".nav");
  const update = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", update, { passive: true });
  update();
};

const setUpScrollSpy = () => {
  if (!canObserve) return;
  const navLinks = [...document.querySelectorAll(".nav__links a[href^='#']")];
  const highlight = (id) => navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === id));
  const spy = new IntersectionObserver(
    (entries) => entries.filter((entry) => entry.isIntersecting).forEach((entry) => highlight(`#${entry.target.id}`)),
    { rootMargin: "-45% 0px -50% 0px" },
  );
  navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean)
    .forEach((section) => spy.observe(section));
};

/** Runs `onVisible` once per element, the first time it scrolls into view. */
const whenVisible = (onVisible, options) => {
  if (!canObserve) return (elements) => elements.forEach(onVisible);
  const observer = new IntersectionObserver((entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry) => {
        onVisible(entry.target);
        observer.unobserve(entry.target);
      });
  }, options);
  return (elements) => elements.forEach((element) => observer.observe(element));
};

const revealAll = whenVisible((element) => element.classList.add("is-visible"), {
  threshold: 0.12,
  rootMargin: "0px 0px -40px 0px",
});

const countUp = (element) => {
  const end = Number(element.dataset.count);
  const suffix = element.dataset.suffix ?? "";
  const start = performance.now();
  const duration = 1400;
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    element.textContent = Math.round(end * eased) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const countAll = calm ? () => {} : whenVisible(countUp, { threshold: 0.6 });

const animate = (root) => {
  revealAll([...root.querySelectorAll(".reveal:not(.is-visible)")]);
  countAll([...root.querySelectorAll("[data-count]")]);
};

const startRotator = () => {
  const rotator = document.querySelector(".rotator");
  if (!rotator || calm) return;
  const words = rotator.dataset.words.split("|").map((word) => Array.from(word)); // keeps emojis whole
  let index = 0;
  let length = words[0].length;
  let deleting = true;
  const tick = () => {
    const word = words[index];
    length += deleting ? -1 : 1;
    rotator.textContent = word.slice(0, length).join("");
    if (deleting && length === 0) {
      deleting = false;
      index = (index + 1) % words.length;
      return setTimeout(tick, 300);
    }
    if (!deleting && length === words[index].length) {
      deleting = true;
      return setTimeout(tick, 2200);
    }
    return setTimeout(tick, deleting ? 35 : 70);
  };
  setTimeout(tick, 2600);
};

/** Project cards open a details window that grows out of the clicked card. */
const setUpProjectModal = () => {
  const modal = document.getElementById("project-modal");
  if (!modal || typeof modal.showModal !== "function") return;
  const inner = modal.querySelector(".modal__inner");
  const field = (selector) => modal.querySelector(selector);

  const growFrom = (card) => {
    const cardBox = card.getBoundingClientRect();
    const modalBox = modal.getBoundingClientRect(); // not affected by the zoom animation
    inner.style.setProperty("--ox", `${cardBox.left + cardBox.width / 2 - modalBox.left}px`);
    inner.style.setProperty("--oy", `${cardBox.top + cardBox.height / 2 - modalBox.top}px`);
  };

  const open = (card) => {
    const text = (selector) => card.querySelector(selector)?.textContent ?? "";
    field(".modal__meta").textContent = `${text(".project__type")} · ${text(".project__year")}`;
    field("#modal-title").textContent = text(".project__open");
    field(".modal__chips").innerHTML = card.querySelector(".chips")?.innerHTML ?? "";
    field(".modal__body").replaceChildren(card.querySelector(".project__details").content.cloneNode(true));
    modal.showModal();
    document.documentElement.classList.add("modal-open");
    inner.scrollTop = 0;
    growFrom(card);
  };

  const close = () => {
    if (!modal.open || modal.classList.contains("is-closing")) return;
    const finish = () => {
      modal.classList.remove("is-closing");
      modal.close();
      document.documentElement.classList.remove("modal-open");
    };
    if (calm) return finish();
    modal.classList.add("is-closing");
    setTimeout(finish, 220);
  };

  document.addEventListener("click", (event) => {
    const opener = event.target.closest(".project__open");
    if (opener) open(opener.closest(".project"));
  });
  field(".modal__close").addEventListener("click", close);
  modal.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  modal.addEventListener("click", (event) => event.target === modal && close());
};

/** Swaps the built-in content for the live one from the admin, when the API is reachable. */
const loadLiveContent = async () => {
  const apiUrl = resolveApiUrl(document, window.location.hostname);
  if (!apiUrl) return;
  try {
    const content = await fetchPortfolio(apiUrl);
    fillSections(document, content).forEach(animate);
  } catch (error) {
    console.info("Portfolio API unavailable, showing the built-in content.", error.message);
  }
};

setFooterYear();
setUpMobileMenu();
setUpNavBorder();
setUpScrollSpy();
startRotator();
setUpProjectModal();
animate(document);
loadLiveContent();
