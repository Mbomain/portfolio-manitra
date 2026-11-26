import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  escapeHtml,
  formatInline,
  formatRichText,
  groupSkills,
  renderExperiences,
  renderKeyFigures,
  renderLanguages,
  renderProjects,
  renderSkillLevels,
} from "../render.js";

describe("escapeHtml", () => {
  it("neutralises markup typed in the admin", () => {
    assert.equal(escapeHtml(`<script>alert("x")</script>`), "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });
});

describe("formatInline", () => {
  it("turns **text** into bold", () => {
    assert.equal(formatInline("Mention **Bien**."), "Mention <strong>Bien</strong>.");
  });

  it("escapes before formatting", () => {
    assert.equal(formatInline("**<b>**"), "<strong>&lt;b&gt;</strong>");
  });
});

describe("formatRichText", () => {
  it("renders headings, paragraphs and lists in their written order", () => {
    const html = formatRichText("## Le projet\nUne API.\n\n## Technique\n- Java\n- React\nFin.");

    assert.equal(
      html,
      "<h4>Le projet</h4><p>Une API.</p><h4>Technique</h4><ul><li>Java</li><li>React</li></ul><p>Fin.</p>",
    );
  });

  it("renders a whole-line _note_ as a discreet note", () => {
    assert.equal(formatRichText("_Code pas encore publié._"), '<p class="modal__note">Code pas encore publié.</p>');
  });

  it("renders nothing for empty details", () => {
    assert.equal(formatRichText(""), "");
  });
});

describe("renderProjects", () => {
  const project = {
    title: "HEI Admin",
    category: "Professionnel",
    period: "2025 — 2026",
    summary: "Plateforme de gestion.",
    details: "## Le projet\nTexte.",
    featured: true,
    technologies: ["Spring Boot"],
    links: [
      { label: "GitHub", url: "https://github.com/Mbomain" },
      { label: "Piège", url: "javascript:alert(1)" },
    ],
  };

  it("marks a featured project and keeps its details for the modal", () => {
    const html = renderProjects([project]);

    assert.match(html, /class="project project--feature reveal"/);
    assert.match(html, /<template class="project__details"><h4>Le projet<\/h4><p>Texte.<\/p>/);
  });

  it("only links to http(s) addresses", () => {
    const html = renderProjects([project]);

    assert.match(html, /href="https:\/\/github.com\/Mbomain"/);
    assert.doesNotMatch(html, /javascript:/);
  });
});

describe("renderExperiences", () => {
  it("omits the optional parts that are empty", () => {
    const html = renderExperiences([{ role: "Chef de projet", organization: "Agri", period: "2023", highlights: ["Pilotage"] }]);

    assert.doesNotMatch(html, /tl__tag/);
    assert.doesNotMatch(html, /class="chips"/);
    assert.match(html, /<li>Pilotage<\/li>/);
  });
});

describe("skills", () => {
  const skills = [
    { name: "Java", category: "Langages", level: "ADVANCED" },
    { name: "Spring Boot", category: "Frameworks", level: "ADVANCED" },
    { name: "Python", category: "Langages", level: null },
    { name: "Monitoring", category: null, level: "INTERMEDIATE" },
  ];

  it("groups skills by category in order of first appearance", () => {
    assert.deepEqual([...groupSkills(skills)], [
      ["Langages", ["Java", "Python"]],
      ["Frameworks", ["Spring Boot"]],
    ]);
  });

  it("lists advanced then intermediate skills, including uncategorised ones", () => {
    const html = renderSkillLevels(skills);

    assert.match(html, /<span>Java · Spring Boot<\/span><b class="lvl lvl--adv">Avancé<\/b>/);
    assert.match(html, /<span>Monitoring<\/span><b class="lvl">Intermédiaire<\/b>/);
  });
});

describe("renderKeyFigures", () => {
  it("prepares figures for the count-up animation", () => {
    assert.equal(
      renderKeyFigures([{ value: 150, suffix: "+", label: "personnes encadrées" }]),
      '<div><dt data-count="150" data-suffix="+">150+</dt><dd>personnes encadrées</dd></div>',
    );
  });
});

describe("renderLanguages", () => {
  it("keeps the proficiency bar between 0 and 100%", () => {
    assert.match(renderLanguages([{ name: "Malgache", level: "Maternelle", proficiency: 140 }]), /--w:100%/);
  });
});
