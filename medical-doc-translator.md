# Medical Document Translator — Implementation Plan & PRD

> **Project Type:** WEB
> **Status:** PHASE 2 — PLANNING
> **Created:** 2026-03-31

---

## 📋 Product Requirement Document (PRD)

### Problem Statement

Regular people in Israel receive complex medical documents from doctors, hospitals, and labs that are filled with technical jargon, abbreviations, and clinical terminology. Most patients cannot fully understand their own medical records, leading to confusion, anxiety, and potential mismanagement of their health.

### Target Audience

**Primary Persona — "רעות" (Reut)**
- 35-year-old Israeli parent
- Receives medical documents in Hebrew (with some English medical terms)
- No medical background
- Wants to understand her family's medical documents without calling the doctor
- Uses a smartphone/laptop for daily tasks

**Secondary Persona — "יעקב" (Yaakov)**
- 68-year-old Israeli retiree
- Receives frequent lab results and specialist reports
- Struggles with complex medical terminology
- Needs clear, simple Hebrew explanations

### User Stories (MoSCoW Prioritized)

#### MUST (MVP — Phase 1)

1. **Upload & Process** (P0)
   > As a **user**, I want to **upload a PDF medical document**, so that **I can get it translated into simple language I understand**.
   
   **Acceptance Criteria:**
   - Given a digital PDF (max 10 pages), when uploaded, then the system extracts text successfully
   - Given an invalid file (non-PDF, >10 pages, >50MB), when uploaded, then the system shows a clear Hebrew error message
   - Given a document is processing, when waiting, then the user sees a progress indicator

2. **Simplified Output** (P0)
   > As a **user**, I want to **see a side-by-side comparison of the original document and the simplified version**, so that **I can verify and understand each section**.
   
   **Acceptance Criteria:**
   - Given processing is complete, when viewing results, then original appears on the left, simplified on the right
   - Given a medical term in the original, when simplified, then it is explained in plain Hebrew without changing the medical meaning
   - Given the simplified text, when read, then it contains NO added medical advice, diagnoses, or recommendations not present in the original

3. **Hebrew Interface** (P0)
   > As a **Hebrew-speaking user**, I want the **entire app to be in Hebrew with RTL layout**, so that **it feels natural to use**.

4. **Reliability Disclaimer** (P0)
   > As a **user**, I want to **see a clear disclaimer**, so that **I understand this is a simplification tool, not medical advice**.
   
   **Acceptance Criteria:**
   - Given the app loads, when viewing results, then a disclaimer banner is always visible
   - Given the disclaimer, when read, then it clearly states: "This is an AI-powered simplification. Always consult your doctor for medical decisions."

#### SHOULD (Phase 2)

5. **Document History** — Save past uploaded documents for logged-in users
6. **Source-Grounded Output** — Each simplified paragraph references the exact original text
7. **Glossary Tooltip** — Hover on a medical term to see its simple definition

#### COULD (Phase 3)

8. **Scanned PDF / Photo Upload** — OCR support for non-digital documents
9. **Dual-Pass Verification** — Second AI pass confirms accuracy
10. **Medical Terminology Cross-Reference** — Validate terms against SNOMED CT/UMLS
11. **HIPAA-Grade Privacy** — PII stripping before AI processing
12. **Export to PDF** — Download simplified version as a formatted PDF

#### WON'T (Future)

13. Audio explanation (text-to-speech in Hebrew)
14. DICOM / medical imaging interpretation
15. Direct EHR integration
16. Mobile native app (React Native)

### Out of Scope (MVP)

- User authentication / login (anonymous usage for MVP)
- Document storage / history
- Multi-user accounts
- Payment / billing
- Any form of medical advice or recommendations
- Scanned / photographed document support

---

## 🎯 Success Criteria (MVP)

| Metric | Target |
|--------|--------|
| Document upload success rate | > 95% |
| Text extraction accuracy (digital PDFs) | > 99% |
| Simplification faithfulness (no added info) | 100% — zero hallucinated medical claims |
| Time to simplify (1-5 page doc) | < 30 seconds |
| UI fully RTL Hebrew | 100% of elements |
| User readability score (Flesch-Kincaid equivalent for Hebrew) | ~6th grade level |
| Beta user satisfaction | ≥ 8/10 |

---

## 🏗️ Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 15 (App Router) | SSR, great DX, React ecosystem, Vercel deploy |
| **Styling** | Vanilla CSS + CSS Variables | Full control, RTL support, no dependency |
| **Backend/DB** | Supabase (Postgres + Storage + Edge Functions) | You already have a Supabase org, free tier, real-time, auth ready for later |
| **AI Model** | Google Gemini 2.5 Flash | Native PDF support, good Hebrew, competitive pricing, free tier for MVP |
| **PDF Viewer** | react-pdf (pdf.js wrapper) | Display original PDF in-browser |
| **Deployment** | Vercel | Zero-config Next.js hosting, free for hobby |
| **Analytics** | (Phase 2) Vercel Analytics | Usage tracking |

### Why Gemini 2.5 Flash for MVP?

| Factor | Details |
|--------|---------|
| **Native PDF** | Can process PDF files directly via multimodal API — no separate OCR needed for digital PDFs |
| **Hebrew** | Strong multilingual support including Hebrew |
| **Free Tier** | ~15 RPM, ~1500 RPD — sufficient for 10 beta users |
| **Cost** | ~$0.075 per 1M input tokens (paid tier) — very affordable |
| **Speed** | Flash variant optimized for low-latency responses |
| **Safety** | Strong instruction following for medical constraints |

---

## 🔒 Reliability Architecture

### MVP (Phase 1) — Strict Prompt Engineering

The system prompt will enforce these ironclad rules:

```
RELIABILITY RULES (SYSTEM PROMPT CORE):
1. ONLY rephrase/explain what exists in the document
2. NEVER add diagnoses, recommendations, or medical advice
3. NEVER omit information from the original
4. If uncertain about a term, keep the original term and mark it with [?]
5. Always output in Hebrew, even if the original has English terms
6. For English medical terms: provide Hebrew explanation + keep original in parentheses
7. Add a confidence indicator per section: ✅ (confident) or ⚠️ (uncertain, consult doctor)
8. Structure output to match the original document's structure
```

### Phase 2 — Source-Grounded Output

- Each simplified paragraph includes a reference to the exact section/line of the original
- Users can click a simplified paragraph to highlight the corresponding original text
- Adds traceability and trust

### Phase 3 — Dual-Pass Verification

- **Pass 1**: Gemini simplifies the document
- **Pass 2**: A second Gemini call receives BOTH the original AND simplified versions, asked to verify:
  - "Does the simplified version contain any information not in the original?" → Flag
  - "Is any original information missing from the simplified version?" → Flag
  - "Are any medical terms incorrectly explained?" → Flag
- Flagged items are marked with ⚠️ for the user

### Phase 4 — Medical Knowledge Validation (Research Findings)

Based on research, the most effective strategies beyond pure AI are:

| Strategy | How It Works | Feasibility |
|----------|-------------|-------------|
| **UMLS/SNOMED Cross-Reference** | Validate extracted medical terms against standardized databases | Medium — UMLS is free (license), but no Hebrew version exists; terms would need English-to-UMLS mapping |
| **Multi-Model Ensemble (MUSE)** | Run same document through 2-3 different LLMs, compare outputs for consensus | Medium — increases cost 2-3x but catches model-specific errors |
| **Confidence Scoring** | AI generates per-section confidence scores; low-confidence sections flagged for human review | Easy — can add in Phase 2 |
| **Medical Knowledge Graph** | Build/use a graph DB (Neo4j) of medical concepts to validate relationships (e.g., "does medication X treat condition Y?") | Hard — requires medical expertise to build |
| **Human-in-the-Loop** | Professional medical reviewer spot-checks AI output | Best reliability, highest cost |

**Recommendation for roadmap:**
1. MVP: Strict prompts + confidence indicators ← **We are here**
2. Phase 2: Source-grounding + per-section confidence scores
3. Phase 3: Dual-pass verification
4. Phase 4: Multi-model ensemble (Gemini + Claude comparison)
5. Phase 5: UMLS cross-reference for English medical terms

---

## 📁 File Structure

```
medical-documents-translator/
├── .agent/                          # AI dev agent config (existing)
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (RTL, Hebrew, meta tags)
│   │   ├── page.tsx                 # Home / landing page
│   │   ├── globals.css              # Global styles, CSS variables, RTL
│   │   └── result/
│   │       └── [id]/
│   │           └── page.tsx         # Side-by-side results page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Alert.tsx
│   │   │   └── Disclaimer.tsx
│   │   ├── upload/
│   │   │   ├── DropZone.tsx         # Drag & drop file upload area
│   │   │   ├── FileValidator.tsx    # Client-side validation (type, size, pages)
│   │   │   └── UploadProgress.tsx   # Upload + processing progress
│   │   └── result/
│   │       ├── SideBySideView.tsx   # Main result layout (original | simplified)
│   │       ├── OriginalViewer.tsx   # PDF viewer (react-pdf)
│   │       └── SimplifiedView.tsx   # Rendered simplified text with sections
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Browser Supabase client
│   │   │   └── server.ts            # Server-side Supabase client
│   │   ├── gemini/
│   │   │   ├── client.ts            # Gemini API client setup
│   │   │   ├── prompts.ts           # System prompts for medical simplification
│   │   │   └── types.ts             # Response types
│   │   └── pdf/
│   │       └── validator.ts         # PDF validation utilities (page count, size)
│   ├── hooks/
│   │   ├── useDocumentUpload.ts     # Upload logic hook
│   │   └── useDocumentProcess.ts    # Processing status polling hook
│   └── types/
│       └── index.ts                 # Shared TypeScript types
├── supabase/
│   └── functions/
│       └── process-document/
│           └── index.ts             # Edge Function: PDF → Gemini → store result
├── .env.local                       # Environment variables (local)
├── .env.example                     # Env var template
├── next.config.ts                   # Next.js configuration
├── package.json
├── tsconfig.json
└── medical-doc-translator.md        # This plan file
```

---

## 📋 Task Breakdown

### Phase 1: Foundation (P0 — Must complete first)

#### Task 1.1: Project Scaffolding
- **Agent:** `project-planner`
- **Skills:** `app-builder`
- **Priority:** P0 — Blocker
- **Dependencies:** None
- **INPUT:** Empty project directory
- **OUTPUT:** Next.js 15 project initialized with TypeScript, directory structure created
- **VERIFY:** `npm run dev` starts without errors

#### Task 1.2: Supabase Project Setup
- **Agent:** `database-architect`
- **Skills:** `database-design`
- **Priority:** P0 — Blocker
- **Dependencies:** None (parallel with 1.1)
- **INPUT:** Supabase organization `uktoamrmgldkmygykhbs`
- **OUTPUT:** New Supabase project created, Storage bucket `documents` created, DB table `translations` created
- **VERIFY:** Can connect to Supabase from code, storage bucket accessible
- **DB Schema:**
  ```sql
  CREATE TABLE translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    original_file_path TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    page_count INTEGER,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
    simplified_content JSONB,        -- Structured simplified output
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

#### Task 1.3: Design System & RTL Layout
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `clean-code`
- **Priority:** P0 — Blocker
- **Dependencies:** Task 1.1
- **INPUT:** Design requirements (Hebrew RTL, medical theme, professional feel)
- **OUTPUT:** `globals.css` with CSS variables, color palette, typography (Hebrew font), RTL configuration
- **VERIFY:** All text renders RTL, Hebrew fonts load correctly
- **Design Direction:**
  - Color palette: Medical blues + calming teals (NOT purple per agent rules)
  - Typography: Google Fonts — `Heebo` (Hebrew) + `Inter` (English/UI)
  - Tone: Professional, trustworthy, calming — NOT clinical/sterile
  - Glassmorphism for cards, subtle animations for progress

---

### Phase 2: Core Upload Flow (P0)

#### Task 2.1: Upload Component (DropZone)
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P0
- **Dependencies:** Task 1.3
- **INPUT:** Design system
- **OUTPUT:** Drag-and-drop upload area with file validation (PDF only, max 10 pages, max 50MB), Hebrew labels & errors
- **VERIFY:** Can drag a PDF into the zone, invalid files show Hebrew error, valid files proceed

#### Task 2.2: Supabase Storage Upload
- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`
- **Priority:** P0
- **Dependencies:** Task 1.2, Task 2.1
- **INPUT:** Selected PDF file
- **OUTPUT:** File uploaded to Supabase Storage `documents` bucket, row created in `translations` table with status='pending'
- **VERIFY:** File appears in Supabase Storage dashboard, DB row created

#### Task 2.3: Edge Function — Document Processing
- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`, `clean-code`
- **Priority:** P0 — Critical path
- **Dependencies:** Task 1.2
- **INPUT:** PDF file path from storage
- **OUTPUT:** Edge Function that:
  1. Downloads PDF from Supabase Storage
  2. Sends PDF to Gemini 2.5 Flash API with medical simplification system prompt
  3. Parses Gemini response into structured JSONB
  4. Updates `translations` row with simplified content + status='completed'
  5. Handles errors gracefully (updates status='error' with message)
- **VERIFY:** Invoke function with test PDF → get structured simplified output in DB

#### Task 2.4: Gemini System Prompt Engineering
- **Agent:** `backend-specialist`
- **Skills:** `clean-code`
- **Priority:** P0 — Critical for reliability
- **Dependencies:** None (parallel)
- **INPUT:** Reliability requirements
- **OUTPUT:** Battle-tested system prompt in `prompts.ts` that:
  - Enforces "only rephrase, never add" rule
  - Handles Hebrew + English medical terms
  - Outputs structured JSON (sections with original_reference, simplified_text, confidence)
  - Includes disclaimer generation
- **VERIFY:** Test with 5+ real Hebrew medical documents, zero hallucinated medical claims

---

### Phase 3: Results Display (P0)

#### Task 3.1: PDF Viewer Component (Original)
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P0
- **Dependencies:** Task 1.3
- **INPUT:** PDF file URL from Supabase Storage
- **OUTPUT:** In-browser PDF viewer using react-pdf, with page navigation
- **VERIFY:** Can display a multi-page Hebrew PDF correctly

#### Task 3.2: Simplified View Component
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P0
- **Dependencies:** Task 1.3
- **INPUT:** Structured simplified content (JSONB)
- **OUTPUT:** Rendered Hebrew text with sections, confidence indicators (✅/⚠️), medical term highlights
- **VERIFY:** All Hebrew renders RTL, sections are clearly separated, confidence icons visible

#### Task 3.3: Side-by-Side Layout
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P0
- **Dependencies:** Task 3.1, Task 3.2
- **INPUT:** PDF viewer + simplified view components
- **OUTPUT:** Responsive side-by-side layout:
  - Desktop: Left = original PDF, Right = simplified text
  - Mobile: Tabbed view (toggle between original and simplified)
- **VERIFY:** Desktop side-by-side works, mobile tabs work, RTL alignment correct

#### Task 3.4: Processing Status & Polling
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P0
- **Dependencies:** Task 2.3
- **INPUT:** Translation ID
- **OUTPUT:** Progress screen with:
  - Upload progress bar
  - "Analyzing document..." animation
  - Redirect to results page on completion
  - Error display with retry option on failure
- **VERIFY:** Status updates from pending → processing → completed, redirect works

---

### Phase 4: Polish & Landing (P1)

#### Task 4.1: Landing Page
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P1
- **Dependencies:** Task 1.3, Task 2.1
- **INPUT:** Product value proposition
- **OUTPUT:** Beautiful Hebrew landing page with:
  - Hero section explaining the product
  - Upload area CTA (integrated DropZone)
  - How it works (3-step visual)
  - Disclaimer section
  - Footer
- **VERIFY:** Page looks professional, all Hebrew renders correctly, upload CTA works

#### Task 4.2: Disclaimer Component
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P0
- **Dependencies:** Task 1.3
- **INPUT:** Legal disclaimer text
- **OUTPUT:** Persistent disclaimer banner on results page + initial upload disclaimer
- **VERIFY:** Disclaimer is visible on all screens, text is clear in Hebrew

#### Task 4.3: Error Handling & Edge Cases
- **Agent:** `frontend-specialist` + `backend-specialist`
- **Skills:** `clean-code`
- **Priority:** P1
- **Dependencies:** All Phase 2-3 tasks
- **INPUT:** Error scenarios
- **OUTPUT:** Graceful handling for:
  - Network errors during upload
  - Gemini API rate limits / errors
  - Malformed PDF (no extractable text)
  - Document too long (>10 pages)
  - Empty document
- **VERIFY:** Each error scenario produces a clear Hebrew error message

---

### Phase 5: Deployment & Verification (P1)

#### Task 5.1: Environment Configuration
- **Agent:** `devops-engineer`
- **Skills:** `deployment-procedures`
- **Priority:** P1
- **Dependencies:** All previous
- **INPUT:** Supabase project URL + Gemini API key
- **OUTPUT:** `.env.example` documented, Vercel env vars configured
- **VERIFY:** `npm run build` succeeds, Vercel preview deployment works

#### Task 5.2: Vercel Deployment
- **Agent:** `devops-engineer`
- **Priority:** P1
- **Dependencies:** Task 5.1
- **INPUT:** GitHub repo
- **OUTPUT:** Live deployment on Vercel
- **VERIFY:** App accessible via Vercel URL, upload + process flow works end-to-end

---

## Phase X: Final Verification Checklist

- [ ] **Lint & Types:** `npm run lint && npx tsc --noEmit` → clean
- [ ] **Build:** `npm run build` → success, no warnings
- [ ] **Security:** No API keys in client code, Supabase RLS configured
- [ ] **RTL:** All UI elements render correctly in RTL
- [ ] **Hebrew:** All user-facing text in Hebrew
- [ ] **Upload Flow:** PDF upload → processing → results displayed correctly
- [ ] **Side-by-Side:** Original PDF + simplified text render side by side on desktop
- [ ] **Mobile:** Tabbed view works on mobile viewport
- [ ] **Disclaimer:** Visible on all result screens
- [ ] **Error Handling:** Invalid file, network error, API error all show Hebrew messages
- [ ] **Reliability:** Test with 5 real Hebrew medical documents, zero hallucinated claims
- [ ] **Performance:** Document processing completes in <30 seconds for 5-page doc
- [ ] **No purple/violet:** Color check passed
- [ ] **No template layouts:** Design is custom, not generic

---

## 🗺️ Future Phases Roadmap

| Phase | Features | Timeline |
|-------|----------|----------|
| **Phase 2** | User auth (Supabase Auth), document history, source-grounded output, glossary tooltips | After MVP validation |
| **Phase 3** | OCR support (scanned docs), dual-pass verification, export to PDF | After user feedback |
| **Phase 4** | Multi-model ensemble, UMLS medical term validation, privacy-first mode (PII stripping) | Growth phase |
| **Phase 5** | Mobile app (React Native), HIPAA compliance, human-in-the-loop review | Scale phase |

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER (Browser)                        │
│  ┌──────────────────┐        ┌────────────────────────────┐ │
│  │   Upload Page     │        │    Results Page            │ │
│  │  ┌────────────┐  │        │  ┌──────────┬───────────┐  │ │
│  │  │  DropZone   │  │        │  │ Original │ Simplified│  │ │
│  │  │  (PDF)      │  │  ───►  │  │ PDF View │ Text View │  │ │
│  │  └────────────┘  │        │  └──────────┴───────────┘  │ │
│  └──────────────────┘        └────────────────────────────┘ │
└──────────────┬──────────────────────────┬───────────────────┘
               │ Upload PDF               │ Poll status / Fetch result
               ▼                          ▼
┌──────────────────────────────────────────────────────────────┐
│                     SUPABASE                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │   Storage     │  │  PostgreSQL   │  │  Edge Function   │   │
│  │  (PDF files)  │  │ (translations │  │ (process-doc)    │   │
│  │               │  │   table)      │  │                  │   │
│  └──────┬───────┘  └──────────────┘  └────────┬─────────┘   │
│         │                                      │              │
│         │              Download PDF            │              │
│         └──────────────────────────────────────┘              │
└────────────────────────────────┬──────────────────────────────┘
                                 │ Send PDF + System Prompt
                                 ▼
                    ┌───────────────────────┐
                    │   Google Gemini API    │
                    │   (2.5 Flash)          │
                    │                       │
                    │  PDF → Simplified     │
                    │  Hebrew Text (JSON)   │
                    └───────────────────────┘
```

---

## ⚠️ Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gemini hallucinating medical info | Critical — could mislead patients | Strict system prompt + confidence scoring + disclaimer |
| Gemini free tier rate limits | Medium — blocks beta testing | 15 RPM is sufficient for 10 users; upgrade to paid if needed ($5) |
| Hebrew PDF text extraction fails | High — core flow broken | Gemini handles native PDFs well; test with diverse Hebrew docs early |
| react-pdf Hebrew rendering issues | Medium — poor UX | Test early; pdf.js handles Hebrew well |
| Large PDFs slow to process | Low — capped at 10 pages | Set timeout + user expectation (progress bar) |

---

> **STATUS:** ⏳ Awaiting user approval to proceed to PHASE 4 (Implementation)
