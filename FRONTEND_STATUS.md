# SecureXmotive Frontend — Status

Written at the end of Phase 7 (7 October 2026). This is the honest state of the public
website: what is finished, what is a placeholder, and what has to happen before it can go
live. Rules for working on the code are in [CLAUDE.md](CLAUDE.md); the design write-up is
in [design-analysis.md](design-analysis.md).

**In one line:** the site is implementation-complete and passes its build and QA checks,
but it is **not ready to launch** — content is missing, the backend connection is
unverified and switched off, and a few assets were never supplied.

## 1. Project overview

Marketing website for SecureXmotive (cybersecurity for connected vehicles and adjacent
industrial sectors). A client-rendered single-page app: Vite 8, React 19, TypeScript 6
(strict), Tailwind CSS v4, React Router 8. No UI framework, no icon library, no analytics,
no cookies, nothing stored in the browser. Fonts are self-hosted.

The design is the Figma file exported as 14 PDFs in `design/`. Only a 1280px desktop
layout was designed; everything below that width, and several whole pages, were derived
from the designed components.

The backend (Node, Express, Prisma, PostgreSQL, S3) is a separate project. It was never
present on this machine, and this repository contains no backend or admin code.

## 2. Completed pages

| Page | Route | Basis | State |
| --- | --- | --- | --- |
| Home | `/` | Designed | Built. Service previews carry the client's five domains. |
| Services | `/services` | Designed | Built with the client's five domains. Row descriptions missing (§6). |
| Service domain × 5 | `/services/automotive`, `/agriculture`, `/off-highway`, `/commercial`, `/industrial-ot` | Designed template | Built with the client's 19 services, wording verbatim. Tagline and intro missing (§6). |
| Knowledge Centre — Articles | `/knowledge-centre` | Designed | Built. Lists the client's 12 articles. |
| Knowledge Centre — Videos | `/knowledge-centre?tab=videos` | **Not designed** | Built from the article row. Shows "No videos have been published yet." until the API is on. |
| Knowledge Centre — Reports | `/knowledge-centre?tab=reports` | **Not designed** | Built from the article row. Shows two **placeholder** entries (§6). |
| Article × 12 | `/knowledge-centre/articles/:slug` | **Not designed** | Built. Full client text, converted from the supplied Word documents — see [ARTICLE_CONTENT.md](ARTICLE_CONTENT.md). |
| Careers | `/careers` | Designed | Built. Form follows the client's field requirements. |
| Company | `/company` | Designed | Built. |
| Contact | `/contact` | Designed | Built. |
| Privacy Policy | `/privacy-policy` | **Not designed** | Page exists; text is a **placeholder** (§6). |
| Terms of Service | `/terms-of-service` | **Not designed** | Page exists; text is a **placeholder** (§6). |
| Security Disclosure | `/security-disclosure` | **Not designed** | Shows the Contact page's disclosure card — the only disclosure copy in the design. No policy text. |
| Not found | any other URL, unknown service or article slug | **Not designed** | Built. |

Also derived rather than designed: the mobile menu, the Services dropdown, every layout
below 1280px, and every form state (errors, sending, result messages).

## 3. Completed components

**Shared (`src/components/common/`)** — `Button`, `Card`, `Container`, `ContentPlaceholder`,
`CtaBand`, `Divider`, `FormFields` (text, select, textarea), `FormStatus`,
`FrameworkChip`, `HeroBand`, `IconTile`, `Logo`, `NavCard`, `PageHeading`,
`SectionHeading`, `SectionLabel`, `Tag`, `TechnicalTicker`, `TextLink`, `icons`.

**Layout (`src/components/layout/`)** — `RootLayout`, `Header`, `ServicesMenu`,
`MobileMenu`, `Footer`, `PageContainer`, `LegalPage`.

**Page sections**

| Folder | Components |
| --- | --- |
| `home/` | `Hero`, `FrameworkCoverage`, `ComplianceSection`, `DeliverablesSection`, `WhyChooseSection`, `HomeCTA` |
| `services/` | `ServiceRow`, `ServiceDetailHero`, `ServiceItemSection`, `ServiceSidebar`, `NextService` |
| `knowledge/` | `KnowledgeTabs`, `ArticleList`, `ArticleCard`, `ArticleMeta`, `ArticleContent`, `ArticleNavigation`, `VideoList`, `VideoCard`, `ReportList`, `ReportCard`, `ItemMeta`, `TabMessage` |
| `careers/` | `WhyChooseUs`, `JobList`, `JobCard`, `SubmitResume`, `CareerForm`, `ResumeUpload` |
| `company/` | `MissionVision`, `CoreValues`, `CompanyTimeline`, `CompanyCTA` |
| `contact/` | `ContactForm`, `ResponseTimeCard`, `OfficeCard`, `SecurityDisclosure` |

**Hooks** — `useFormSubmission`, `useContactForm`, `useCareerForm`, `useVideos`,
`useMobileMenu`.

`src/pages/DevComponents.tsx` is a development-only component gallery at
`/dev/components`. It is not in production builds (checked: the built files do not
contain it and the URL shows the Not Found page).

## 4. Routes

```
/                                  Home
/services                          Services
/services/:serviceSlug             automotive · agriculture · off-highway · commercial · industrial-ot
/knowledge-centre                  Knowledge Centre (?tab=videos, ?tab=reports)
/knowledge-centre/articles/:slug   Article
/careers                           Careers (#apply jumps to the form)
/company                           Company
/contact                           Contact
/privacy-policy  /terms-of-service  /security-disclosure
*                                  Not found
```

Services inside a domain are anchored sections of the domain page
(`/services/automotive#threat-analysis-risk-assessment`), not routes. An unknown tab name
falls back to Articles.

## 5. API integrations

**Nothing is connected today.** `VITE_ENABLE_API` is `false`, and while it is, the site
makes no network request of any kind.

| Feature | Call (provisional) | With the API off | With the API on |
| --- | --- | --- | --- |
| Contact form | `POST /api/contact`, JSON | Validates, then says plainly that it is in preview mode and nothing was sent | Sends; success or a generic error message |
| Career application | `POST /api/careers/applications`, multipart, file under `resume` | Same preview message | Sends; success or a generic error message |
| Videos | `GET /api/videos`, expects a JSON array | Empty state, no request | Loading → list, empty state, or error with Retry |

What is **not verified**, because the backend was never available:

- The three paths, the request field names, and the response shapes. The video service
  assumes `{ id, title, description, youtubeUrl, thumbnail, published, createdAt }` in a
  bare array — if the backend wraps the list or names fields differently, the tab shows
  its error state until `ApiVideo`/`toVideo` in `src/services/videoService.ts` are
  adjusted.
- CORS, the backend's port (`5000` is a guess), upload size limits, and whether the
  backend's accepted resume types match the frontend's (PDF, DOC, DOCX up to 5 MB — an
  assumption).

What **was** tested: each call was run against a throwaway mock server on this machine —
success, server error, slow response, empty list and a wrong-shaped response. Requests had
the expected shape; errors showed fixed messages with no server text; unpublished videos
and videos with a non-web link were filtered out. No request was ever sent to a real
backend.

All HTTP goes through `src/services/api.ts`. There are no admin endpoints, no auth
headers, no tokens and no secrets anywhere in the frontend.

## 6. Remaining placeholders

Visible to a visitor today:

| Where | What a visitor sees | To remove it |
| --- | --- | --- |
| Reports tab | Two rows titled "[Report placeholder] Report title", category "PLACEHOLDER", "File pending" | Replace the entries in `src/data/reports.ts` (add `fileUrl` for a Download button), or empty the array before launch |
| Privacy Policy | "[Legal content placeholder]" box | Supply the policy text |
| Terms of Service | "[Legal content placeholder]" box | Supply the terms |
| Both forms | "Preview mode — the backend is not connected yet, so nothing was sent." after a valid submit | Verify the API and set `VITE_ENABLE_API=true` |

Missing but not visible (the layout simply omits them):

| Where | What is missing |
| --- | --- |
| Services page | The intro paragraph under the heading, and each row's description (`summary`). Home's service cards list each domain's service titles in place of a description. |
| Each service domain page | `tagline` and `intro` in the hero |
| Videos tab | No videos exist; none were invented |
| Security Disclosure page | An actual disclosure policy (scope, process, timelines) |
| Home hero | The video (`Car.mp4`) — the still image is used |

Markers in the code: `CONTENT_PENDING` (services and reports data),
`PLACEHOLDER_ASSET` (`src/data/home.ts`), `PROVISIONAL` (the three services and
`api.ts`). There are no `TODO`, `FIXME` or lorem-ipsum strings.

**Content that came from the design and has not been confirmed by the client.** The
office addresses, phone numbers and email addresses, the six job listings, the company
timeline, the "Systems operational" line
in the footer and the response-time promises on the Contact page are all reproduced from
the Figma design. They may be prototype copy. Someone at SecureXmotive should confirm
each before launch — in particular the contact details and the open positions.

## 7. Missing client assets

| Asset | Status |
| --- | --- |
| Hero video `home.mp4` | Supplied and integrated (`public/gifs/home.mp4` / `heroMedia.video`). Plays on loop in the background with poster fallback and reduced-motion support. |
| Hero image | `public/images/home/hero-vehicle.jpg` is the design's own 1024 × 468 export. A larger original would look sharper on wide screens. |
| Favicon / app icons | Temporary: the shield mark as an SVG favicon. No PNG or Apple touch icons. |
| Social share image (Open Graph) | None. No Open Graph or Twitter tags are set. |
| Logo files | The shield is an exported vector; the wordmark is live text. No brand logo files were supplied. |
| Report files and covers, video thumbnails | None supplied. |
| Brand font files | None supplied; `public/fonts/` is empty and fonts load from the bundled Fontsource packages. |
| Page imagery | `public/images/{services,knowledge,careers,company}/` are empty — the design has no imagery there. |

## 8. Known limitations

- **Responsive layouts are derived.** No tablet or mobile design exists. They are
  consistent with the desktop design and free of overflow, but nobody has approved them.
- **Figma access is partial.** The prototype is publicly viewable and was used as the
  pixel reference in the final QA pass (37 frames: 7 pages, 30 hover sheets). The design
  file itself cannot be read through the Figma connector (no edit access to the
  original; the copy's call allowance is used up), and the Figma Make project needs a
  login. Exact values come from the PDFs' vector data. Any animated elements that exist
  only in the Make source (background, banner, radar) are not reproduced; the prototype
  shows none.
- **Heights run slightly over the Figma frames** — Contact +6px, Company +7px, Knowledge
  Centre +14px over the full page — because hairlines are 1px here and 0.667px in the
  capture. Navigation labels sit up to 3px left of the frame for a similar reason (text
  measured half a letter-space narrower in the capture). Services, Service Detail, parts
  of Home and the Career form differ further on purpose: they carry the client's content
  and requirements instead of the design's.
- **Single-page app.** Every URL is served the same HTML, so the Not Found page is
  returned with HTTP 200, all pages share one meta description, and there is no
  server-side rendering, `robots.txt` or sitemap.
- **Tested in Chrome only** (headless, desktop and emulated mobile sizes). Not tested in
  Firefox, Safari or on real phones. Not tested with a screen reader — the accessibility
  checks were structural (roles, names, labels, focus, keyboard).
- **No automated tests in the repository.** QA used throwaway scripts that are not part
  of the project. No Lighthouse or colour-contrast audit was run; the palette is the
  design's, and a few small labels (11px teal at 75%) are low-contrast by design.
- **No spam protection on the forms** (no CAPTCHA, honeypot or rate limiting). None is
  designed; the backend should at least rate-limit.
- **Videos open on YouTube in a new tab.** No embedded player. When a video has no
  thumbnail of its own, the still is loaded from YouTube (`i.ytimg.com`), which is a
  third-party request.
- **Reports have no detail page;** a report is a row with a download link.
- **Resume limits** (PDF/DOC/DOCX, 5 MB) are assumed, checked by file extension and size
  in the browser only. The backend must enforce its own.
- The project folder is **not a git repository** yet.

## 9. Environment variables required

Both are read at **build time** and end up in the public JavaScript. Neither is a secret,
and no secret may ever be put in a `VITE_` variable.

| Variable | Purpose | Development | Production |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Origin of the backend, no trailing slash | `http://localhost:5000` (a guess) | The real API origin, HTTPS. Leave empty if the API is served from the site's own origin. |
| `VITE_ENABLE_API` | `true` lets the forms and the Videos tab call the backend | `false` | `true` — only after the contract is verified |

Template: `.env.example`. The local `.env` is ignored by git and contains only these two
values. A source search for passwords, keys, tokens, database URLs and credentials found
none.

## 10. Production deployment requirements

1. **Before building**
   - Supply or remove every placeholder in §6, and confirm the unverified content.
   - Check the three API calls against the real backend and correct
     `src/services/*.ts` where they differ.
   - Set both environment variables for the production build.
2. **Build:** `npm ci`, then `npm run build` (type-check + build). Output is static files
   in `dist/` (about 1.5 MB including all font subsets; the main script is 110 kB
   gzipped). Built and tested here with Node 24.18 and npm 12.
3. **Hosting:** any static host.
   - Rewrite every path that is not a file to `/index.html`, or deep links and reloads
     will 404.
   - Serve over HTTPS. Files under `/assets/` have hashed names and can be cached
     permanently; `index.html` should not be cached.
4. **Backend:** must allow the site's origin (CORS) for `POST /api/contact`,
   `POST /api/careers/applications` and `GET /api/videos`, expose only published videos
   on the public endpoint, and validate and rate-limit submissions itself.
5. **If a Content Security Policy is used:** allow the API origin in `connect-src` and
   `https://i.ytimg.com` in `img-src`. Scripts, styles and fonts are all self-hosted.
6. **Still to add for a public launch:** real favicons, a share image and Open Graph
   tags, `robots.txt` and a sitemap.

## 11. Final QA status

Run on 7 October 2026 against the dev server and the production build, and repeated
in the final QA pass the same day — see [FRONTEND_QA_REPORT.md](FRONTEND_QA_REPORT.md)
for that pass's method, findings and fixes.

| Check | Result |
| --- | --- |
| `npm run build` (TypeScript strict + Vite) | Pass |
| `npm run lint` (oxlint) | Pass, no warnings |
| Routes: 22 real URLs + 5 invalid ones (unknown page, service, article, sub-path, tab) | All render the right page; invalid ones show Not Found, and an unknown tab falls back to Articles |
| Internal links: 41 distinct links and anchors across all pages | None broken; every `#anchor` has a target |
| Horizontal overflow at 375, 390, 430, 480, 640, 768, 1024, 1280, 1440, 1600px on every route | None |
| One `h1` per page, heading order, image `alt`, named links and buttons, labelled fields | No issues on any route or width |
| Console errors and warnings, failed requests | None |
| Keyboard: skip link, tab order, focus outline, tabs (arrow keys, wrap), Services dropdown (Enter, Escape) | Pass |
| Mobile menu: open, close, Escape, close on navigation, close on resize, page inert and scroll locked while open, focus returns to the toggle | Pass |
| Reduced motion | No animation runs; the ticker is still |
| Contact form: required fields, email format, whitespace-only input, sending state, preview message | Pass |
| Career form: required fields, phone, years (0–60), link, resume type and size, "Apply now" preselects the role | Pass |
| Forms and videos against a local mock API: success, server error, slow, empty, wrong shape | Pass; no server detail shown to the visitor |
| Knowledge Centre tabs: URL sync, reload, back button | Pass |
| Production build: dev gallery excluded, no source maps, no secrets | Pass |
| Visual comparison at 1276px with the Figma prototype frames and the PDFs' vector data | Every designed page matches element for element apart from the drift in §8. Found and fixed: card arrows (white, design grey); form fields, row gaps and buttons 0.5–3px off the design. |

**Not checked:** Firefox, Safari, real devices, screen readers, Lighthouse, colour
contrast, and anything involving the real backend.

### Not complete

To be explicit, these are unfinished and need the client or the backend, not more
frontend work:

1. Reports (2 placeholder rows), legal text (2 pages), a disclosure
   policy, service summaries / taglines / intros.
2. Hero video, favicons, share image.
3. Confirmation of the design's contact details and job listings, and of the article
   categories, order and missing dates (the articles themselves are the client's).
4. Verification of the API contract, then switching `VITE_ENABLE_API` on.
5. Approval of the derived layouts (mobile, tablet, Videos, Reports, Article, legal, 404).
