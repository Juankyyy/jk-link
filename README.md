# JK-Link

Make your links shorter, cleaner, and easier to share.

JK-Link is a link-shortening platform designed for creators, brands, communities, and anyone who wants to share links with a more polished look.

## What the platform offers

- Memorable short links with custom names.
- Simple management via a clear and fast web interface.
- Edit and delete links in seconds.
- An optimized experience for organizing campaigns, content, and resources.

## Who it’s for

- Content creators who post on social media all the time.
- Communities that share resources, documents, or invitations.
- Businesses that want consistent links for marketing.
- Teams that need control over their links in one place.

## Use Cases

- Replace long URLs with short, professional links.
- Create links for temporary promotions.
- Update destinations without losing clarity in what you share.

## Why JK-Link

- Less visual clutter in every post.
- Better link recall.
- Fast workflow for creating and maintaining your active links.
- Solid foundation for continued growth with metrics, domains, and more integrations.

## Current Status

The current version already allows you to create, edit, list, and delete links from a web dashboard connected to a custom backend. (dev only)

## Stack

- Vue 3 + Vite
- Vue Router
- Pinia
- Tailwind CSS
- Bun

## Auth Contract (Frontend <-> Backend)

The admin frontend now uses backend authentication with cookies and role validation.

### Endpoints expected by the frontend

1. `POST /api/auth/login`
- Request body:
```json
{
	"username": "admin_user",
	"password": "plain-password"
}
```
- Success response (`200`):
```json
{
	"user": {
		"id": "uuid-or-number",
		"username": "admin_user",
		"role": "admin"
	}
}
```
- The backend must create/set the auth session cookie.

2. `GET /api/auth/me`
- Success response (`200`):
```json
{
	"user": {
		"id": "uuid-or-number",
		"username": "admin_user",
		"role": "admin"
	}
}
```
- If session is invalid/expired, return `401`.

3. `POST /api/auth/logout`
- Success response: `200` or `204`.
- The backend must clear the auth session cookie.

### Role requirement

- Admin panel access requires `role === "admin"`.
- Any authenticated user with another role must be rejected (`403`) for admin access.

## Users Table Proposal

Recommended fields:

- `id`
- `username` (unique)
- `password` (store bcrypt hash, never plain text)
- `role` (`user` | `admin`)
- `created_at`
- `updated_at`

<!-- ## Run the project locally

### Requirements

- Bun installed.
- Link shortener backend running (default at http://localhost:8787).

### Environment variables

Use the .env.example file as a basis:

```env
VITE_ADMIN_ACCESS_KEY=your-private-key
VITE_API_BASE_URL=http://localhost:8787
```

### Commands

```bash
bun install
bun run dev
```

Production build:

```bash
bun run build
bun run preview
``` -->