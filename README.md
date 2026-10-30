# Portfolio API

TypeScript, Express, PostgreSQL, Prisma and Resend backend for a portfolio site.

## Requirements

- Node.js 20+
- PostgreSQL (Supabase or Neon are supported)
- A Resend API key and a verified sender address for production email
- A Gemini API key (the Gemini web-app subscription and Gemini API access/quotas are separate)

## Local setup

1. Install packages: `npm install`
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, Resend/email values, and `GEMINI_API_KEY`. Use a random JWT secret with at least 32 characters and an admin password with at least 12 characters. Get API access and an API key separately through Google's Gemini API/AI Studio; a Gemini student/Pro web subscription does not itself configure API access or guarantee free API quota. Add accurate portfolio facts to `AI_PORTFOLIO_CONTEXT` so replies don't guess about your work.
3. Generate Prisma Client and create/update the database schema:
   ```sh
   npm run db:generate
   npm run db:push
   ```
   `db:push` is intended for local prototyping. For shared/production databases, create and commit migrations with `npm run db:migrate` in development, then apply them in deployment with `npm run db:deploy`.
4. Create the initial admin account: `npm run db:seed`
5. Start the development server: `npm run dev`

The API listens on `http://localhost:3000` by default. `CORS_ORIGIN` accepts a comma-separated allowlist of frontend origins.

## Endpoints

| Method | Path | Access |
|---|---|---|
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/projects` | Public |
| `POST` | `/api/projects` | Bearer JWT |
| `PUT` | `/api/projects/:id` | Bearer JWT |
| `DELETE` | `/api/projects/:id` | Bearer JWT |
| `GET` | `/api/reviews` | Public (published reviews only) |
| `GET` | `/api/reviews/admin` | Bearer JWT |
| `POST` | `/api/reviews` | Bearer JWT |
| `PUT` | `/api/reviews/:id` | Bearer JWT |
| `DELETE` | `/api/reviews/:id` | Bearer JWT |
| `POST` | `/api/contact` | Public |
| `GET` | `/api/health` | Public |

Use the token returned by login as `Authorization: Bearer <token>` for protected project and review operations. Reviews are admin-managed; create them unpublished, then set `published: true` to make them visible publicly. Contact messages are stored before notification and auto-reply emails are attempted. Gemini drafts an automatic reply grounded in `AI_PORTFOLIO_CONTEXT`; if Gemini fails, a generic acknowledgement is emailed instead. Check `notificationSent`, `autoReplySent`, and `aiReplyGenerated` in the response. Contact text is sent to Google Gemini and Resend, so disclose this in the site's privacy notice.

## Build and run

```sh
npm run typecheck
npm run build
npm start
```

## Smoke test

Import `postman/Portfolio-API.postman_collection.json` into Postman. Set the collection variables `adminEmail` and `adminPassword`, then run **Admin → Login** before the protected project and review requests. **Create project** and **Create review** store their new IDs for update and delete.

With the server running, check the API and submit an invalid payload to verify Zod validation:

```sh
curl -i http://localhost:3000/api/health
curl -i -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  --data '{"name":"","email":"not-an-email","subject":"","message":""}'
```

Log in with the admin credentials from `.env` and copy the returned token:

```sh
curl -i -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  --data '{"email":"admin@example.com","password":"your-admin-password"}'
```

Use the token for project administration:

```sh
curl -i -X POST http://localhost:3000/api/projects \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_JWT' \
  --data '{"title":"Portfolio API","description":"A sample project.","techStack":["Node.js","TypeScript"],"featured":true}'
curl -i http://localhost:3000/api/projects
```

The contact request JSON is `{ "name": "...", "email": "...", "subject": "...", "message": "..." }`. Project create/update requests accept `title`, `description`, `techStack` (string array), optional `liveLink`, `githubLink`, `imageUrl`, and `featured`.
