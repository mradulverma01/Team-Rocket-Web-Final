# RRDCH — Rajarajeshwari Dental College & Hospital (WEBATHON-2026)

Website for **RRDCH**: patients, students, and staff. Built on the [T3 Stack](https://create.t3.gg/) with Convex, tRPC, and Next.js.

## Quick start

```bash
cd rrdch
cp .env.example .env   # fill in keys
npm install
npm run dev            # http://localhost:3000
```

More detail (stack, folders, debugging): see [AGENTS.md](./AGENTS.md).

## Tech stack

| Layer | Tools |
|--------|--------|
| App | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| API | tRPC v11 |
| Data | Convex (schema in `convex/schema.ts`) |
| Auth | WorkOS (roles: patient · student · doctor/admin) |
| Motion | GSAP |

---
Features (target scope)


### Public / marketing

- Home, About, Admissions, Research, Contact
- Department pages and hospital information
- Virtual tour
- Achievements and college highlights
- Events calendar (live updates for patients)
- Directions / wayfinding
- Clear **patient vs academic** navigation

### Patient portal

- Online appointment booking and **appointment tracking**
- Follow-up flows where applicable
- Live updates (announcements, events)
- Reports access (where integrated)
- Responsive **confirmation** after submissions

### Student portal

- Syllabus updates
- Department / class schedule
- Hostel **complaint** submission and tracking

### Doctor / admin

- Patient schedule / queue visibility
- Announcements to patients, students, or all

### Cross-cutting

- **Kannada** (and other languages, e.g. Google Translate widget)
- **Automation**: email / WhatsApp notifications (where approved)
- **Payments**: Razorpay
- Mobile-first, accessible UI with a defined **color palette** and **typography**

---

## Completed

- T3 app scaffold with lint, typecheck, and formatting scripts
- Convex **schema** for: `appointments`, `complaints`, `schedules`, `announcements` (indexes included)
- Route groups and shells:
  - Public: home (custom HTML via `rrdch-homepage.html`), about, admissions, research, departments, events, virtual tour, contact
  - Patient: book, appointments, reports, complaints
  - Student: syllabus, schedule, hostel
  - Doctor: queue, patients, announcements
- Shared layout: public header (`SiteHeader`), portal layout (`PortalShell`)
- **Notifications (item 7):** Contact form on `/contact` returns a **reference ID** and shows an accessible confirmation panel (`SubmissionConfirmation`). Server-side **webhook** to `NOTIFICATIONS_WEBHOOK_URL` (optional `NOTIFICATIONS_WEBHOOK_SECRET`) runs after the response via Next.js `after()` — suitable for n8n, email, WhatsApp, or reminder chains. Reuse `submission.submitInquiry` + channels (`contact`, `appointment_intent`, etc.) for booking and hostel flows later.
- Project guide for contributors: [AGENTS.md](./AGENTS.md)

---

## Next up

Prioritized follow-through (adjust order as the team agrees).

1. Convex backend — Implement queries/mutations for appointments, complaints, schedules, and announcements; connect UI to real data.
2. Auth — Wire clerk end-to-end; protect patient / student / doctor routes.
3. Appointment booking — Slot selection, validation, persistence, and confirmation UX (email/SMS/WhatsApp as required).
4. Payments — Razorpay integration for applicable flows.
5. Content — Fill department pages, achievements, tour media, and events from real college data.
6. Localization — Kannada copy (including medical terms) and optional Tamil; **compact Translate control** in the public header (Google Translate widget, same idea as [Manipal Hospitals Bangalore](https://www.manipalhospitals.com/bangalore/)). Pair with `messages/*.json` and next-intl for curated strings where machine translation is not enough.
7. Polish — Documented design tokens (colors, type), GSAP passes where needed, performance and a11y pass.
8. Moblie App- both Android and ios need to do that. 
9. Automation- Email/whatsapp message sent after booking, date and time with location google maps link. (Webhook + n8n path is in place from notifications work; extend payloads when booking persists.)
---



---

