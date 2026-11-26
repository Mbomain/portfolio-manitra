insert into key_figure (position, value, suffix, label) values
  (1, 3,   ' ans', 'de formation en développement logiciel'),
  (2, 150, '+',    'personnes encadrées : équipes scoutes et étudiants de L1 et L2'),
  (3, 6,   '',     'projets réalisés, du desktop au full-stack');

insert into experience (position, role, organization, period, tag, summary, highlights, technologies) values
  (1, 'Développeur Full-Stack', 'Numer Madagascar', 'Sept. 2025 — Oct. 2026', 'Alternance',
   'Responsable de la fiabilité et de l’évolution de **HEI Admin**, plateforme de gestion administrative utilisée chaque jour par les étudiants, les parents, les enseignants et l’administration de HEI.',
   array['Contribution au développement et à l’exploitation du projet',
         'Développement back-end en Java (Spring Boot), migrations de base de données avec Flyway',
         'Développement front-end en React-Admin et TypeScript, base PostgreSQL hébergée sur Neon'],
   array['Java', 'Spring Boot', 'React-Admin', 'TypeScript', 'PostgreSQL', 'Flyway']),
  (2, 'Responsable relation client', 'Numer Madagascar', 'Sept. 2025 — Oct. 2026', null,
   'Interlocuteur principal des utilisateurs de HEI Admin.',
   array['Recueil et suivi des besoins des utilisateurs',
         'Réponse aux questions et accompagnement au quotidien',
         'Remontée des retours à l’équipe de développement pour améliorer la plateforme'],
   '{}'),
  (3, 'Professeur assistant — Développement web', 'Haute École d’Informatique (HEI) Madagascar', 'Mai 2026 — Oct. 2026', 'Enseignement',
   'Enseignement du développement web aux étudiants de L1 et L2.',
   array['Accompagnement dans la création d’applications web modernes',
         'Front-end : React et React-Admin · Back-end : Node.js et Express',
         'Accent sur les bonnes pratiques, l’architecture logicielle et l’expérience utilisateur'],
   array['React', 'React-Admin', 'Node.js', 'Express.js']),
  (4, 'Responsabilités de clubs', 'HEI Music Club · Uni’Zik Club', '2024 — 2026', 'Vie associative', null,
   array['HEI Music Club : conseiller du club',
         'HEI Music Club : responsable communication',
         'Uni’Zik Club : responsable trésorerie'],
   '{}'),
  (5, 'Team Leader — Chef d’unité', 'Tily Eto Madagasikara (Scoutisme) · Antananarivo, Ambohipanja', 'Mars 2022 — Nov. 2025', 'Leadership', null,
   array['**Coordination :** gestion des tâches, du planning et des absences pour assurer la qualité de service',
         '**Encadrement :** supervision et accompagnement de plus de 25 collaborateurs',
         '**Communication interne :** animation des réunions pour renforcer la cohésion et l’efficacité'],
   '{}'),
  (6, 'Chef de projet', 'Aménagement des terres et appui aux acteurs agricoles', '2023', 'Projet', null,
   array['Pilotage de la conception de barrages pour la riziculture en montagne',
         'Intégration de technologies embarquées pour une gestion optimisée des ressources en eau'],
   '{}');

insert into project (position, title, category, period, summary, details, featured, technologies) values
  (1, 'HEI Admin', 'Professionnel', '2025 — 2026',
   'Plateforme de gestion administrative de la Haute École d’Informatique : étudiants, parents, enseignants et administration y gèrent la scolarité au quotidien. J’y ai contribué sur l’API comme sur l’interface.',
   E'## Le projet\nHEI Admin est la plateforme de gestion administrative de la Haute École d’Informatique de Madagascar. Elle est utilisée au quotidien par les étudiants, les parents, les enseignants et l’administration.\n\n## Mon rôle\n- Développeur Full-Stack en alternance chez Numer Madagascar (sept. 2025 — oct. 2026)\n- J’ai contribué au développement et à l’exploitation de la plateforme, pour qu’elle reste fiable et simple à faire évoluer\n- J’ai aussi été responsable relation client : j’ai recueilli les besoins des utilisateurs et fait remonter leurs retours à l’équipe\n\n## Technique\n- API en Java avec Spring Boot\n- Interface en React-Admin et TypeScript\n- Base PostgreSQL hébergée sur Neon, migrations avec Flyway',
   true, array['Spring Boot', 'React-Admin', 'TypeScript', 'PostgreSQL · Neon', 'Flyway']),
  (2, 'Students API', 'Enseignement', '2026',
   'API REST de gestion d’étudiants créée pour mon cours avec les L1 : architecture en couches, authentification JWT, migrations PostgreSQL.',
   E'## Le projet\nUne API REST de gestion d’étudiants que j’ai construite comme support pour mon cours de développement web avec les L1 à HEI.\n\n## Ce qu’elle montre\n- Une architecture en couches claire : contrôleurs, services, repositories et modèles\n- Une authentification par jeton JWT, avec des mots de passe hachés (bcrypt)\n- Des migrations SQL pour PostgreSQL et un script pour créer un administrateur\n- Un fichier d’exemples de requêtes pour tester l’API facilement\n\n## Technique\n- Node.js, Express et TypeScript\n- PostgreSQL',
   false, array['Express', 'TypeScript', 'PostgreSQL', 'JWT']),
  (3, 'Gestion de patrimoine', 'Full-Stack', '2024',
   'Projet d’école full-stack de gestion de patrimoine : API Node.js et interface React.',
   E'## Le projet\nUn projet d’école réalisé à HEI pour gérer et suivre un patrimoine, de l’API jusqu’à l’interface.\n\n## Technique\n- API en Node.js\n- Interface en React, construite avec Vite',
   false, array['Node.js', 'React']),
  (4, 'Gastronomie & Ticket place', 'Back-end', '2023 — 2025',
   'Deux projets d’école en Java : un back-end pour la gestion de la gastronomie et un autre pour la gestion de tickets de places.',
   E'## Les projets\n- **Gastronomie :** un back-end Java pour la gestion de la gastronomie\n- **Ticket place :** un back-end Java pour la gestion de tickets de places\n\nDeux projets d’école réalisés à HEI pour travailler la conception de back-ends en Java.',
   false, array['Java']),
  (5, 'Mbala sy Kitro', 'Desktop', '2025',
   'Application desktop de gestion de stock développée en Python.',
   E'## Le projet\nUne application de bureau pour gérer un stock, que j’ai développée en Python en 2025.\n\n_Le code n’est pas encore publié sur GitHub._',
   false, array['Python']),
  (6, 'Irrigation en montagne', 'Systèmes embarqués', '2023',
   'Barrages et riziculture de montagne pilotés par des technologies embarquées pour optimiser l’usage de l’eau.',
   E'## Le projet\nUn projet d’aménagement des terres et d’appui aux acteurs agricoles, dont j’étais chef de projet en 2023.\n\n## Ce que j’ai fait\n- J’ai piloté la conception de barrages pour la riziculture en montagne\n- Le projet intégrait des technologies embarquées pour mieux gérer les ressources en eau',
   false, array['Gestion de projet', 'Embarqué']);

insert into project_link (project_id, position, label, url)
select p.id, l.position, l.label, l.url
from project p
join (values
  ('HEI Admin',                  0, 'API sur GitHub',         'https://github.com/hei-school/hei-admin-api'),
  ('HEI Admin',                  1, 'Interface sur GitHub',   'https://github.com/Mbomain/hei-admin-ui'),
  ('Students API',               0, 'Voir sur GitHub',        'https://github.com/Mbomain/ExpressJs_Student_L1'),
  ('Gestion de patrimoine',      0, 'Voir sur GitHub',        'https://github.com/Mbomain/Patrimoin-STD23072'),
  ('Gastronomie & Ticket place', 0, 'Gastronomie sur GitHub', 'https://github.com/Mbomain/Gastronomie')
) as l (title, position, label, url) on l.title = p.title;

insert into skill (position, name, category, level) values
  (1,  'Java',                              'Langages',           'ADVANCED'),
  (2,  'TypeScript',                        'Langages',           'ADVANCED'),
  (3,  'JavaScript',                        'Langages',           null),
  (4,  'Python',                            'Langages',           null),
  (5,  'Spring Boot',                       'Frameworks',         'ADVANCED'),
  (6,  'React',                             'Frameworks',         'ADVANCED'),
  (7,  'React-Admin',                       'Frameworks',         null),
  (8,  'Node.js',                           'Frameworks',         'ADVANCED'),
  (9,  'Express.js',                        'Frameworks',         'ADVANCED'),
  (10, 'PostgreSQL',                        'Données & outils',   'ADVANCED'),
  (11, 'Neon',                              'Données & outils',   null),
  (12, 'Flyway',                            'Données & outils',   null),
  (13, 'Git',                               'Données & outils',   'ADVANCED'),
  (14, 'GitHub',                            'Données & outils',   null),
  (15, 'Postman',                           'Données & outils',   null),
  (16, 'Docker',                            'Données & outils',   'INTERMEDIATE'),
  (17, 'Leadership & management',           'Humain',             null),
  (18, 'Gestion d’équipe',                  'Humain',             null),
  (19, 'Gestion de crise',                  'Humain',             null),
  (20, 'Relation client',                   'Humain',             'INTERMEDIATE'),
  (21, 'Monitoring et performance du cloud', null,                'INTERMEDIATE');

insert into education (position, degree, school, period, description) values
  (1, 'Licence en Écosystème Logiciel (EL)', 'Haute École d’Informatique de Madagascar', 'Oct. 2023 — Oct. 2026',
   'Spécialisation en développement d’applications, de la L1 à la L3. Mention **Bien**.'),
  (2, 'Baccalauréat série S', 'Lycée Jules Ferry Faravohitra', '2022 — 2023', '**Major de promotion.**');

insert into spoken_language (position, name, level, proficiency) values
  (1, 'Malgache', 'Maternelle', 100),
  (2, 'Français', 'B2',         75),
  (3, 'Anglais',  'B1',         55);

insert into interest (position, label, emoji) values
  (1, 'Musique',         '🎵'),
  (2, 'Natation',        '🏊'),
  (3, 'Musculation',     '🏋️'),
  (4, 'Cinéma',          '🎬'),
  (5, 'Randonnée',       '🥾'),
  (6, 'Sports extrêmes', '🪂');

insert into driving_license (position, label, emoji) values
  (1, 'Permis A (moto)',    '🏍️'),
  (2, 'Permis B (voiture)', '🚗');
