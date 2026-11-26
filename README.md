# Portfolio de Manitra Andriamparanimahefa

Trois parties, chacune dans son dossier :

| Dossier      | Rôle                                                        | Stack                                              |
|--------------|-------------------------------------------------------------|----------------------------------------------------|
| `portfolio/` | Le site public (manitra-portfolio.vercel.app)               | HTML, CSS, JavaScript (modules ES)                 |
| `api/`       | L’API qui stocke et sert le contenu du portfolio            | Java 21, Spring Boot 4, PostgreSQL, Flyway, JWT    |
| `admin/`     | La page d’administration pour gérer le contenu              | React 19, React-Admin 5, TypeScript, Vite          |

Le site public lit son contenu sur l’API (`GET /api/portfolio`). Si l’API ne répond pas, il garde
le contenu écrit dans `index.html` : le site n’est jamais vide.

## Lancer en local

Prérequis : Java 21, Node 18 ou plus, Docker Desktop démarré.

1. **API** (démarre aussi PostgreSQL dans Docker, puis applique les migrations Flyway) :

   ```powershell
   cd api
   .\mvnw spring-boot:run "-Dspring-boot.run.profiles=local"
   ```

   Le profil `local` lit `api/src/main/resources/application-local.yml` (identifiants admin de dev et
   secret JWT). Ce fichier n’est pas versionné ; `application-local.example.yml` montre son format.

2. **Admin** sur http://localhost:5173 :

   ```powershell
   cd admin
   npm install
   npm run dev
   ```

3. **Site public** sur http://127.0.0.1:5174 :

   ```powershell
   python -m http.server 5174 --bind 127.0.0.1 --directory portfolio
   ```

## Tests

```powershell
cd api; .\mvnw test          # 20 tests : unitaires + intégration sur un vrai PostgreSQL (Testcontainers)
cd admin; npm test           # 10 tests : session, authentification, en-têtes envoyés à l’API
cd portfolio; npm test       # 19 tests : rendu HTML, échappement, chargement du contenu
```

## API

| Méthode  | Route                    | Accès  | Rôle                                         |
|----------|--------------------------|--------|----------------------------------------------|
| `POST`   | `/api/auth/login`        | public | Renvoie un jeton JWT (8 h)                   |
| `GET`    | `/api/portfolio`         | public | Tout le contenu du site, dans l’ordre        |
| `GET`    | `/api/{ressource}`       | public | Liste (`_start`, `_end`, `_sort`, `_order`)  |
| `GET`    | `/api/{ressource}/{id}`  | public | Un élément                                   |
| `POST`   | `/api/{ressource}`       | admin  | Création                                     |
| `PUT`    | `/api/{ressource}/{id}`  | admin  | Modification                                 |
| `DELETE` | `/api/{ressource}/{id}`  | admin  | Suppression                                  |

Ressources : `projects`, `experiences`, `skills`, `educations`, `languages`, `interests`,
`licenses`, `key-figures`.

## Mise en forme des textes longs

Les champs « Détails », « Résumé » et « Description » acceptent une mise en forme légère :
`**gras**`, `## Sous-titre`, `- élément de liste`, et une ligne entière entre `_tirets bas_`
pour une note discrète. Le texte est toujours échappé : aucun HTML saisi dans l’admin n’est exécuté.

## Configuration en production

L’API lit ses secrets dans des variables d’environnement :

| Variable               | Exemple                                         |
|------------------------|-------------------------------------------------|
| `ADMIN_USERNAME`       | `admin`                                         |
| `ADMIN_PASSWORD_HASH`  | `{bcrypt}$2a$10$…`                              |
| `JWT_SECRET`           | au moins 32 caractères aléatoires               |
| `CORS_ALLOWED_ORIGINS` | `https://manitra-portfolio.vercel.app,https://…` |
| `SPRING_DATASOURCE_*`  | connexion PostgreSQL (URL, utilisateur, mot de passe) |

Une fois l’API hébergée, ajouter dans `portfolio/index.html` :
`<meta name="portfolio-api" content="https://votre-api/api">`, et définir `VITE_API_URL` pour l’admin.
