-- Aligns the content with the corrected CV (Développeur Full-Stack & Testeur, November 2026).
-- Rows are matched on their text rather than their id, so content edited in the back office since is left alone.

update experience
set highlights   = highlights || array['Écriture de tests et suivi de l’intégration continue (CI/CD)'],
    technologies = technologies || array['CI/CD']
where role = 'Développeur Full-Stack' and organization = 'Numer Madagascar'
  and not 'CI/CD' = any (technologies);

update experience
set highlights = array['HEI Music Club : responsable communication, puis conseiller du club',
                       'Uni’Zik Club : responsable trésorerie']
where role = 'Responsabilités de clubs'
  and highlights = array['HEI Music Club : conseiller du club',
                         'HEI Music Club : responsable communication',
                         'Uni’Zik Club : responsable trésorerie'];

update project
set details = replace(details,
                      E'\n- J’ai aussi été responsable relation client',
                      E'\n- J’ai écrit des tests et suivi l’intégration continue (CI/CD)\n- J’ai aussi été responsable relation client')
where title = 'HEI Admin' and details not like '%CI/CD%';

update education
set description = 'Spécialisation en développement d’applications, de la L1 à la L3. Diplôme obtenu en 2026, mention **Bien**.'
where degree = 'Licence en Écosystème Logiciel (EL)'
  and description = 'Spécialisation en développement d’applications, de la L1 à la L3. Mention **Bien**.';

update skill set category = 'Tests & qualité' where name = 'Postman' and category = 'Données & outils';

insert into skill (name, category)
select s.name, s.category
from (values
  ('SQL',                'Langages'),
  ('Next.js',            'Frameworks'),
  ('JUnit',              'Tests & qualité'),
  ('Jest',               'Tests & qualité'),
  ('Tests manuels',      'Tests & qualité'),
  ('Cahiers de recette', 'Tests & qualité'),
  ('GitHub Actions',     'Données & outils'),
  ('Pédagogie',          'Humain')
) as s (name, category)
where not exists (select 1 from skill where skill.name = s.name);

-- Groups appear in the order of their first skill: Langages, Frameworks, Tests & qualité, Données & outils, Humain.
update skill
set position = o.position
from (values
  ('Java', 1), ('TypeScript', 2), ('JavaScript', 3), ('Python', 4), ('SQL', 5),
  ('Spring Boot', 6), ('React', 7), ('React-Admin', 8), ('Node.js', 9), ('Express.js', 10), ('Next.js', 11),
  ('JUnit', 12), ('Jest', 13), ('Postman', 14), ('Tests manuels', 15), ('Cahiers de recette', 16),
  ('PostgreSQL', 17), ('Neon', 18), ('Flyway', 19), ('Git', 20), ('GitHub', 21), ('GitHub Actions', 22), ('Docker', 23),
  ('Leadership & management', 24), ('Gestion d’équipe', 25), ('Pédagogie', 26), ('Gestion de crise', 27),
  ('Relation client', 28), ('Monitoring et performance du cloud', 29)
) as o (name, position)
where skill.name = o.name;
