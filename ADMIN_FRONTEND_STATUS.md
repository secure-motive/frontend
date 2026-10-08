# SecureXmotive Admin Portal

## Phase 2 Status

Backend Integration Complete

All Phase 1 approved Admin Portal UI views, layouts, and components are now directly integrated with the existing SecureXmotive Express + Prisma (PostgreSQL) backend.

## Integrated Features

- **Admin Login**: Real authentication via `POST /api/auth/login` issuing secure HTTP-only cookie (`admin_token`).
- **Session Verification**: Real auth check on mount via `GET /api/auth/me` with automatic session preservation across refreshes.
- **Logout**: Seamless invalidation via `POST /api/auth/logout`, clearing server cookie and client auth state.
- **Career Applications**: Real list fetched from `GET /api/admin/careers` with full applicant details, experience, and pagination.
- **Application Details**: Real single application detail view via `GET /api/admin/careers/:id`.
- **Resume Access / Download**: Secure presigned S3 URL generation via `GET /api/admin/careers/:id/resume`, downloading/viewing directly from AWS S3 without exposing credentials.
- **Career Application Deletion**: Complete deletion of record and S3 file via `DELETE /api/admin/careers/:id`.
- **Contact Messages**: Real inquiry list fetched from `GET /api/admin/contact`.
- **Message Details**: Real inquiry detail view via `GET /api/admin/contact/:id`.
- **Contact Message Deletion**: Real inquiry deletion via `DELETE /api/admin/contact/:id`.
- **Videos**: Real video library fetched from `GET /api/admin/videos`.
- **Add Video**: Real video creation via `POST /api/admin/videos` with YouTube URL validation and automatic thumbnail resolution.
- **Edit Video**: Real video update via `PUT /api/admin/videos/:id`.
- **Delete Video**: Real video deletion via `DELETE /api/admin/videos/:id`.
- **Publish / Unpublish**: Real status toggle via `PATCH /api/admin/videos/:id/publish` and `PATCH /api/admin/videos/:id/unpublish`.
- **Dashboard Statistics**: Dynamic metrics derived from real database collections (total applications, unreviewed count, contact inquiries, published/draft videos).
- **Session Expiration Handling**: Centralized 401 interceptor that clears session and displays an expiration alert on `/admin/login`.
- **Loading, Empty & Error States**: Dedicated loading indicators, empty collection banners, and network error recovery cards with retry buttons across all admin views.
- **Mock Data Removal**: All production paths are disconnected from mock data; data is retrieved live from the backend.

## API Configuration

The frontend interacts with the backend using the following browser-safe environment variables:

| Environment Variable | Description | Example (Development) | Example (Production) |
|---|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the SecureXmotive Express API | `http://localhost:5000` | `https://api.securemotive.com` |
| `VITE_ENABLE_API` | Flag indicating whether API transmission is active | `true` | `true` |

> Note: All sensitive credentials (JWT secrets, PostgreSQL connection strings, AWS S3 access keys) reside strictly on the server and are never exposed to the frontend.

## Remaining Issues

None. All 18 API contracts, credentialed requests, data transformations, and error scenarios have been verified and tested against the live backend and database.
