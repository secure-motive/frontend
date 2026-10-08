# SecureXmotive Admin Portal — Developer Credentials & Phase 1 Notes

## ⚠️ Phase 1: Frontend Only (Mock Mode)

This admin portal is currently running in **Phase 1: Frontend Only**.
- No backend connection or database is accessed.
- All actions (login, logout, video CRUD, publish toggles, search/filter) operate on client-side state with `localStorage` persistence.
- Phase 2 will replace these mock handlers with real Express/Prisma/PostgreSQL/JWT endpoints.

---

## 🔐 Mock Admin Credentials

To log into the Admin Portal (`/admin/login`), use either of the following credentials:

| Field | Value |
| :--- | :--- |
| **Email** | `admin@securexmotive.com` |
| **Password** | `Admin@SecureX2026!` |

*(Alternative accepted test credentials: `security@securexmotive.com` / `Password123!`)*

---

## 📁 Key Routes

- `/admin/login` — Mock Admin Login
- `/admin` — Admin Dashboard with live stats & recent items
- `/admin/applications` — Career Applications List & Search
- `/admin/applications/:id` — Career Application Details
- `/admin/messages` — Contact Us Submissions List & Search
- `/admin/messages/:id` — Contact Us Submission Detail
- `/admin/videos` — Video Management (List, Status Toggle, Delete)
- `/admin/videos/new` — Create New Video
- `/admin/videos/:id/edit` — Edit Existing Video

---

## 💾 Local State Reset

If you ever wish to reset the mock database back to its pristine seed data, you can click the **Reset Data** action in the Admin Portal navigation or clear the `localStorage` key `securexmotive_admin_data_v1`.
