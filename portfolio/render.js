// Pure functions turning the API's portfolio content into the site's HTML.
// Every piece of text is escaped first, so content typed in the admin can never inject markup.

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

const LEVEL_LABELS = { ADVANCED: "Avancé", INTERMEDIATE: "Intermédiaire" };

export const escapeHtml = (text = "") => String(text).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

const isSafeUrl = (url) => /^https?:\/\//i.test(url);

/** **bold** and _italic_, on already escaped text. */
export const formatInline = (text) =>
  escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|\s)_(.+?)_(?=\s|$|[.,;:!?])/g, "$1<em>$2</em>");

const listOf = (items) => (items.length ? `<ul>${items.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>` : "");

const chipsOf = (labels, extraClass = "") =>
  labels?.length
    ? `<ul class="chips${extraClass}">${labels.map((label) => `<li>${escapeHtml(label)}</li>`).join("")}</ul>`
    : "";

const isNote = (line) => /^_.+_$/.test(line);

const renderParagraph = (line) =>
  isNote(line) ? `<p class="modal__note">${escapeHtml(line.slice(1, -1))}</p>` : `<p>${formatInline(line)}</p>`;

const RICH_TEXT_RENDERERS = {
  heading: ({ text }) => `<h4>${formatInline(text)}</h4>`,
  paragraph: ({ text }) => renderParagraph(text),
  list: ({ items }) => listOf(items),
};

const toNode = (line) =>
  line.startsWith("## ") ? { type: "heading", text: line.slice(3) } : { type: "paragraph", text: line };

/** Consecutive "- " lines become one list; every other line is a heading or a paragraph. */
const parseRichText = (lines) =>
  lines.reduce((nodes, line) => {
    const previous = nodes.at(-1);
    if (!line.startsWith("- ")) return [...nodes, toNode(line)];
    if (previous?.type === "list") return [...nodes.slice(0, -1), { ...previous, items: [...previous.items, line.slice(2)] }];
    return [...nodes, { type: "list", items: [line.slice(2)] }];
  }, []);

/** Light markdown: "## " headings, "- " bullets, **bold**, _italic_ and whole-line _notes_. */
export const formatRichText = (text = "") =>
  parseRichText(
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  )
    .map((node) => RICH_TEXT_RENDERERS[node.type](node))
    .join("");

export const renderKeyFigures = (figures) =>
  figures
    .map(({ value, suffix = "", label }) => {
      const end = escapeHtml(suffix ?? "");
      return `<div><dt data-count="${Number(value)}" data-suffix="${end}">${Number(value)}${end}</dt><dd>${escapeHtml(label)}</dd></div>`;
    })
    .join("");

export const renderExperiences = (experiences) =>
  experiences
    .map(
      ({ role, organization, period, tag, summary, highlights = [], technologies = [] }) => `
      <li class="tl reveal">
        <div class="tl__meta"><span class="tl__date">${escapeHtml(period)}</span>${tag ? `<span class="tl__tag">${escapeHtml(tag)}</span>` : ""}</div>
        <div class="tl__card">
          <h3>${escapeHtml(role)}</h3>
          <p class="tl__org">${escapeHtml(organization)}</p>
          ${summary ? `<p>${formatInline(summary)}</p>` : ""}
          ${listOf(highlights)}
          ${chipsOf(technologies)}
        </div>
      </li>`,
    )
    .join("");

const renderLinks = (links = []) => {
  const safeLinks = links.filter(({ url }) => isSafeUrl(url));
  return safeLinks.length
    ? `<div class="modal__links">${safeLinks
        .map(({ label, url }) => `<a class="btn btn--primary" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(label)} ↗</a>`)
        .join("")}</div>`
    : "";
};

export const renderProjects = (projects) =>
  projects
    .map(
      ({ title, category, period, summary, details, featured, technologies, links }) => `
      <article class="project${featured ? " project--feature" : ""} reveal">
        <div class="project__top"><span class="project__type">${escapeHtml(category)}</span><span class="project__year">${escapeHtml(period)}</span></div>
        <h3><button class="project__open" type="button" aria-haspopup="dialog">${escapeHtml(title)}</button></h3>
        <p>${formatInline(summary)}</p>
        ${chipsOf(technologies)}
        <span class="project__more" aria-hidden="true">Voir les détails <b>+</b></span>
        <template class="project__details">${formatRichText(details ?? "")}${renderLinks(links)}</template>
      </article>`,
    )
    .join("");

/** Skills grouped by category, groups in the order of their first skill. */
export const groupSkills = (skills) =>
  skills
    .filter(({ category }) => category)
    .reduce((groups, { name, category }) => groups.set(category, [...(groups.get(category) ?? []), name]), new Map());

export const renderSkillGroups = (skills) =>
  [...groupSkills(skills)]
    .map(
      ([category, names]) => `
      <div class="skill-group reveal">
        <h3>${escapeHtml(category)}</h3>
        ${chipsOf(names, " chips--lg")}
      </div>`,
    )
    .join("");

export const renderSkillLevels = (skills) =>
  Object.entries(LEVEL_LABELS)
    .map(([level, label]) => [level, label, skills.filter((skill) => skill.level === level).map(({ name }) => escapeHtml(name))])
    .filter(([, , names]) => names.length)
    .map(
      ([level, label, names]) =>
        `<li><span>${names.join(" · ")}</span><b class="lvl${level === "ADVANCED" ? " lvl--adv" : ""}">${label}</b></li>`,
    )
    .join("");

export const renderEducations = (educations) =>
  educations
    .map(
      ({ degree, school, period, description }) => `
      <article class="edu__item reveal">
        <span class="tl__date">${escapeHtml(period)}</span>
        <h3>${escapeHtml(degree)}</h3>
        <p class="tl__org">${escapeHtml(school)}</p>
        ${description ? `<p>${formatInline(description)}</p>` : ""}
      </article>`,
    )
    .join("");

const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0));

export const renderLanguages = (languages) =>
  languages
    .map(
      ({ name, level, proficiency }) =>
        `<li><span>${escapeHtml(name)}</span><span class="bar"><i style="--w:${clampPercent(proficiency)}%"></i></span><small>${escapeHtml(level)}</small></li>`,
    )
    .join("");

export const renderInterests = (interests) =>
  interests
    .map(({ emoji, label }) => `<li>${emoji ? `<i aria-hidden="true">${escapeHtml(emoji)}</i>` : ""}${escapeHtml(label)}</li>`)
    .join("");

export const renderLicenses = (licenses) =>
  licenses.map(({ emoji, label }) => `<li>${emoji ? `${escapeHtml(emoji)} ` : ""}${escapeHtml(label)}</li>`).join("");

/** Which container receives which rendering, keyed by the data-content attribute in index.html. */
export const SECTIONS = {
  "key-figures": ({ keyFigures }) => renderKeyFigures(keyFigures),
  experiences: ({ experiences }) => renderExperiences(experiences),
  projects: ({ projects }) => renderProjects(projects),
  "skill-groups": ({ skills }) => renderSkillGroups(skills),
  "skill-levels": ({ skills }) => renderSkillLevels(skills),
  educations: ({ educations }) => renderEducations(educations),
  languages: ({ languages }) => renderLanguages(languages),
  interests: ({ interests }) => renderInterests(interests),
  licenses: ({ licenses }) => renderLicenses(licenses),
};
