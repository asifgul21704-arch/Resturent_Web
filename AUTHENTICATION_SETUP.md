# Foody authentication setup

The secure authentication branch introduces a MongoDB-backed account model and server-side session endpoints.

## Environment variables

Create a local `.env` file (never commit it) and set:

- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: random secret with at least 32 characters
- `ADMIN_EMAIL`: email for the first administrator
- `ADMIN_PASSWORD`: initial administrator password (at least 12 characters)
- `GEMINI_API_KEY`: optional Gemini API key
- `PORT`: optional server port; defaults to 3000

The first administrator is created once when the server connects to MongoDB. If that email already belongs to a customer account, bootstrap stops instead of silently elevating the account.

## Security notes

- Public registration always creates a customer account.
- Passwords are stored as bcrypt hashes.
- Sessions use an HttpOnly cookie.
- Authentication endpoints are rate limited.
- Never commit `.env`, database URLs, JWT secrets, or administrator passwords.
- Configure production secrets in the hosting provider's environment-variable settings.

## Current API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/admin/customers` (Admin only; returns customer profile fields, never passwords)

The signup/login UI now uses these session endpoints, and the Admin CRM requests the registered customer directory from the Admin-only endpoint. Build, runtime, database, and role-access tests still need to be run after you configure your Atlas and hosting environment variables.
