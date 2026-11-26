# Portfolio de Manitra Andriamparanimahefa

Trois parties, chacune dans son dossier :

| Dossier      | Rôle                                                        | Stack                                              |
|--------------|-------------------------------------------------------------|----------------------------------------------------|
| `portfolio/` | Le site public : https://manitra-portfolio.vercel.app       | HTML, CSS, JavaScript (modules ES)                 |
| `api/`       | L’API : https://manitra-portfolio-api.onrender.com/api      | Java 21, Spring Boot 4, PostgreSQL, Flyway, JWT    |
| `admin/`     | L’administration : https://manitra-portfolio-admin.vercel.app | React 19, React-Admin 5, TypeScript, Vite        |

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
cd portfolio; npm test       # 20 tests : rendu HTML, échappement, chargement du contenu
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

## Hébergement

| Partie | Hébergeur | Détails |
|--------|-----------|---------|
| Site public | Vercel | `cd portfolio; npx vercel deploy --prod` |
| Admin | Vercel | `cd admin; npx vercel deploy --prod --build-env VITE_API_URL=https://manitra-portfolio-api.onrender.com/api` |
| API | Render (Docker, gratuit, Frankfurt) | Décrite par `render.yaml`, redéployée à chaque push sur `main` |
| Base | Neon (PostgreSQL, Frankfurt) | Projet `portfolio`, schéma géré par Flyway |

L’offre gratuite de Render met l’API en veille après 15 minutes sans visite ; le réveil prend environ
une minute. Le site affiche son contenu intégré pendant ce temps, puis le remplace par celui de l’API.

### Variables d’environnement de l’API (Render)

| Variable               | Rôle                                                   |
|------------------------|--------------------------------------------------------|
| `SPRING_DATASOURCE_URL`, `_USERNAME`, `_PASSWORD` | connexion directe (sans pooling) à Neon |
| `ADMIN_USERNAME`       | `admin`                                                |
| `ADMIN_PASSWORD_HASH`  | `{bcrypt}…`, généré par l’outil ci-dessous             |
| `JWT_SECRET`           | généré par Render                                      |
| `CORS_ALLOWED_ORIGINS` | adresses du site et de l’admin                         |

Pour changer le mot de passe admin, générer un nouveau hachage puis le coller dans Render
(Environment → `ADMIN_PASSWORD_HASH`) :

```powershell
cd api; .\mvnw -q compile exec:java "-Dexec.mainClass=mg.manitra.portfolio.auth.PasswordHasher"
```
