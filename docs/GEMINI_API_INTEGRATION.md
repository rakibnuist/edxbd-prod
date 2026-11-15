# Gemini API Feature Integration Guide

**EduExpress International (`eduexpressint.com`)**  
*Next.js 16.4.3 App Router · React 19 · TypeScript · Prisma SQLite · Tailwind CSS*  
*SDK: `@google/genai` (^3.3.0) · Current SDK Standard*

---

## 1. Executive Summary

This document describes the architecture, compliance guardrails, endpoints, and verification procedures for the eight production Google Gemini features integrated into EduExpress International:

1. **Database-Grounded Fit Matcher (`/education-fit-assessment`)**: Instant student fit scoring with structured JSON output powered by `gemini-4-hydrogen`.
2. **Admin Counselor Co-pilot (`/admin/leads`)**: Dual-model triage and outreach drafting combining `gemini-decision-1` (Decisions API) and `gemini-4-hydrogen` (Interactions API).
3. **Streaming Study & Cost Advisor Q&A (`/find-education`)**: Interactive multi-turn chat with multi-round Function Calling and Server-Sent Events (SSE) streaming powered by `gemini-4-hydrogen`.
4. **Multimodal Academic Transcript Evaluator (`/education-fit-assessment`)**: Vision-based marksheet scanning (SSC, HSC, Alim, A Level, Bachelor) with automated BMDC Biology requirement verification powered by `gemini-4-hydrogen`.
5. **AI Visa Interview Simulator & Consular Coach (`/your-study-journey`)**: 4-round dynamic embassy interview rehearsal simulating the Chinese Embassy in Dhaka (X1/X2 visas) and Malaysian immigration desks (EMGS) with consular readiness scoring and red-flag detection powered by `gemini-4-hydrogen`.
6. **ClearCost Budget & Financial Feasibility Analyzer (`/compare-costs`)**: Real-time solvency stress-testing comparing student family budget (BDT/USD) against real database tuition, dorm, insurance, and living costs, producing risk-tier assessments, deficit calculations, and low-cost alternative suggestions powered by `gemini-4-hydrogen`.
7. **AI SOP & Study Plan Reviewer (`/csc-scholarship-bangladesh`)**: Comprehensive critique of student Statement of Purpose and research proposals evaluating academic milestones, research methodologies, non-immigrant intent, and BMDC licensing rules with before-and-after rewrite recommendations powered by `gemini-4-hydrogen`.
8. **Personalized Study Abroad Roadmap & ClearCost™ PDF Generator (`/for-parents`, `/education-fit-assessment`)**: Executive academic dossier and 2-page branded PDF generation compiling student profile, Gemini strategy analysis, grounded university options, ClearCost expense itemization, and month-by-month intake roadmap powered by `gemini-4-hydrogen` and `pdf-lib`.

All features strictly enforce EduExpress's brand, evidence-first governance, and Bangladesh medical licensing (BMDC/WDOMS) compliance rules with zero hallucinations and resilient local database catalog fallbacks.

---

## 2. Model & SDK Standards

- **SDK**: `@google/genai` (^3.3.0). Deprecated `@google/generative-ai` is not used.
- **Generation & Vision Models**:
  - `gemini-4-hydrogen`: Default generation and multimodal vision model for structured previews, counselor briefing generation, streaming advisor, marksheet image evaluation, and visa mock scoring.
- **Decision Models**:
  - `gemini-decision-1`: Used via the Decisions API (`v1beta`) for calibrated multi-choice triage of student leads.
- **Grounding Source**:
  - Real-time Prisma SQLite records caching 120 verified institutions, 416 active programs, 198 scholarships, and 24 published ClearCost plans.

---

## 3. Integrated Features

### Feature 1: Database-Grounded Fit Matcher
- **Target Page**: [`/education-fit-assessment`](/education-fit-assessment)
- **API Endpoint**: `POST /api/ai/fit-preview`
- **Core Files**:
  - [`src/lib/gemini-fit.ts`](/src/lib/gemini-fit.ts): Server-only generator utilizing `ai.interactions.create` with structured JSON schema.
  - [`src/lib/fit-matcher.ts`](/src/lib/fit-matcher.ts): GPA and subject normalization, candidate scoring, and slug hydration.
  - [`src/app/api/ai/fit-preview/route.ts`](/src/app/api/ai/fit-preview/route.ts): Rate-limited endpoint (`ai-fit-preview`, 25 req/hr).
  - [`src/components/assessment/EducationFitAssessment.tsx`](/src/components/assessment/EducationFitAssessment.tsx): UI language switcher (EN/BN), candidate preview cards, and lead conversion.
- **Unit Tests**: [`src/lib/fit-matcher.test.mjs`](/src/lib/fit-matcher.test.mjs) (4 unit tests passing).

### Feature 2: Admin Counselor Co-pilot
- **Target Page**: [`/admin/leads`](/admin/leads)
- **API Endpoint**: `POST /api/admin/leads/[id]/copilot`
- **Core Files**:
  - [`src/lib/gemini-lead-copilot.ts`](/src/lib/gemini-lead-copilot.ts): Concurrent runner executing `gemini-decision-1` and `gemini-4-hydrogen` via `Promise.allSettled`.
  - [`src/lib/lead-copilot.ts`](/src/lib/lead-copilot.ts): JSON schemas, calibrated decision triage extraction, WhatsApp & Email template hydration, and catalog fallback generator.
  - [`src/app/api/admin/leads/[id]/copilot/route.ts`](/src/app/api/admin/leads/[id]/copilot/route.ts): Authenticated route with `verifyLiveAdminUser`, role verification, and rate limiting (60 req/hr).
  - [`src/components/admin/LeadCopilotPanel.tsx`](/src/components/admin/LeadCopilotPanel.tsx): Drawer UI featuring triage badges, WhatsApp/email copy buttons, and note insertion.
- **Unit Tests**: [`src/lib/lead-copilot.test.mjs`](/src/lib/lead-copilot.test.mjs) (4 unit tests passing).

### Feature 3: Streaming Study & Cost Advisor Q&A
- **Target Page**: [`/find-education`](/find-education)
- **API Endpoint**: `POST /api/ai/advisor`
- **Core Files**:
  - [`src/lib/advisor-tools.ts`](/src/lib/advisor-tools.ts): Tool definitions (`search_universities_and_programs`, `get_cost_breakdown`, `lookup_verified_guides`), tool executor over Prisma records, citation deduplication, and streaming catalog fallback generator.
  - [`src/lib/gemini-advisor.ts`](/src/lib/gemini-advisor.ts): Streaming generator with multi-round tool loop handling `arguments_delta` and emitting Server-Sent Events (`status`, `chunk`, `citations`, `done`, `error`).
  - [`src/app/api/ai/advisor/route.ts`](/src/app/api/ai/advisor/route.ts): SSE route handler (`text/event-stream; charset=utf-8`) with rate limiting (30 req/hr).
  - [`src/components/finders/StudyAdvisorChat.tsx`](/src/components/finders/StudyAdvisorChat.tsx): Embedded interactive chat client with English/Bangla language switching, preset prompt chips, live status indicators, markdown formatting, and citation pills.
- **Unit Tests**: [`src/lib/advisor-tools.test.mjs`](/src/lib/advisor-tools.test.mjs) (5 unit tests passing).

### Feature 4: Multimodal Academic Transcript Evaluator
- **Target Page**: [`/education-fit-assessment`](/education-fit-assessment)
- **API Endpoint**: `POST /api/ai/evaluate-transcript`
- **Core Files**:
  - [`src/lib/transcript-evaluator.ts`](/src/lib/transcript-evaluator.ts): Marksheet data models, mathematical BMDC Biology threshold assessment (requires Biology in HSC with GPA >= 3.50), program grounding, and catalog fallback generator.
  - [`src/lib/gemini-transcript.ts`](/src/lib/gemini-transcript.ts): Server-only multimodal vision evaluator using `gemini-4-hydrogen` with image pre-processing (`sharp` WebP/JPEG compression).
  - [`src/app/api/ai/evaluate-transcript/route.ts`](/src/app/api/ai/evaluate-transcript/route.ts): Rate-limited endpoint (`ai-transcript-eval`, 20 req/hr) accepting `multipart/form-data`.
  - [`src/components/assessment/TranscriptUploadModal.tsx`](/src/components/assessment/TranscriptUploadModal.tsx): Interactive drag-and-drop modal displaying extracted subject tables, BMDC compliance alerts, and grounded university cards with "Apply to Form" autofill.
- **Unit Tests**: [`src/lib/transcript-evaluator.test.mjs`](/src/lib/transcript-evaluator.test.mjs) (3 unit tests passing).

### Feature 5: AI Visa Interview Simulator & Consular Coach
- **Target Page**: [`/your-study-journey`](/your-study-journey)
- **API Endpoint**: `POST /api/ai/visa-simulator`
- **Core Files**:
  - [`src/lib/visa-simulator.ts`](/src/lib/visa-simulator.ts): Destination-specific 4-stage questions (Purpose, Institution Details, Funding Verification, Post-Study Return Intent), red-flag detectors (unauthorized employment, immigration intent), and scoring rubric.
  - [`src/lib/gemini-visa-simulator.ts`](/src/lib/gemini-visa-simulator.ts): Server-only evaluator using `gemini-4-hydrogen` with structured feedback schema.
  - [`src/app/api/ai/visa-simulator/route.ts`](/src/app/api/ai/visa-simulator/route.ts): Rate-limited endpoint (`ai-visa-simulator`, 25 req/hr).
  - [`src/components/visa/VisaInterviewSimulator.tsx`](/src/components/visa/VisaInterviewSimulator.tsx): Interactive step-by-step consular interview simulator with readiness score meter, red flag warnings, and model diplomatic answers.
- **Unit Tests**: [`src/lib/visa-simulator.test.mjs`](/src/lib/visa-simulator.test.mjs) (3 unit tests passing).

### Feature 6: ClearCost Budget & Financial Feasibility Analyzer
- **Target Page**: [`/compare-costs`](/compare-costs)
- **API Endpoint**: `POST /api/ai/cost-feasibility`
- **Core Files**:
  - [`src/lib/cost-feasibility.ts`](/src/lib/cost-feasibility.ts): Financial data models, currency conversion (BDT/CNY/MYR/USD), solvency status classification (`comfortable`, `manageable`, `stretched`, `deficit`), and catalog fallback generator.
  - [`src/lib/gemini-cost-feasibility.ts`](/src/lib/gemini-cost-feasibility.ts): Server-only feasibility evaluator using `gemini-4-hydrogen` with structured financial guidance schema.
  - [`src/app/api/ai/cost-feasibility/route.ts`](/src/app/api/ai/cost-feasibility/route.ts): Rate-limited endpoint (`ai-cost-feasibility`, 30 req/hr).
  - [`src/components/finders/FinancialFeasibilityCard.tsx`](/src/components/finders/FinancialFeasibilityCard.tsx): Interactive solvency analysis card embedded into `CostCompare`, displaying budget balance meter, expense itemization, risk flags, and alternative institution links.
- **Unit Tests**: [`src/lib/cost-feasibility.test.mjs`](/src/lib/cost-feasibility.test.mjs) (2 unit tests passing).

### Feature 7: AI SOP & Study Plan Reviewer
- **Target Page**: [`/csc-scholarship-bangladesh`](/csc-scholarship-bangladesh)
- **API Endpoint**: `POST /api/ai/sop-reviewer`
- **Core Files**:
  - [`src/lib/sop-reviewer.ts`](/src/lib/sop-reviewer.ts): Document models, degree word count boundaries, academic depth & methodology detectors, non-immigrant intent verification, and catalog fallback generator.
  - [`src/lib/gemini-sop-reviewer.ts`](/src/lib/gemini-sop-reviewer.ts): Server-only evaluator using `gemini-4-hydrogen` with structured JSON critique schema and before/after rewrites.
  - [`src/app/api/ai/sop-reviewer/route.ts`](/src/app/api/ai/sop-reviewer/route.ts): Rate-limited endpoint (`ai-sop-reviewer`, 25 req/hr).
  - [`src/components/assessment/SopReviewerCard.tsx`](/src/components/assessment/SopReviewerCard.tsx): Interactive draft critique card with sample CSC plan pre-filler, overall evaluation score, strengths, areas for revision, and side-by-side Before/After recommendations.
- **Unit Tests**: [`src/lib/sop-reviewer.test.mjs`](/src/lib/sop-reviewer.test.mjs) (5 unit tests passing).

### Feature 8: Personalized Study Abroad Roadmap & ClearCost™ PDF Generator
- **Target Pages**: [`/for-parents`](/for-parents), [`/education-fit-assessment`](/education-fit-assessment)
- **API Endpoint**: `POST /api/ai/roadmap-pdf`
- **Core Files**:
  - [`src/lib/roadmap-generator.ts`](/src/lib/roadmap-generator.ts): Dossier models, grounded candidate shortlisting, transparent fee itemization, and catalog fallback generator.
  - [`src/lib/gemini-roadmap.ts`](/src/lib/gemini-roadmap.ts): Server-only strategy synthesizer using `gemini-4-hydrogen` with structured JSON strategy schema.
  - [`src/lib/pdf-roadmap.ts`](/src/lib/pdf-roadmap.ts): High-fidelity 2-page A4 PDF compiler powered by `pdf-lib` with dark petrol and lime EduExpress branding.
  - [`src/app/api/ai/roadmap-pdf/route.ts`](/src/app/api/ai/roadmap-pdf/route.ts): Rate-limited endpoint (`ai-roadmap-pdf`, 20 req/hr) streaming binary PDF bytes.
  - [`src/components/assessment/DownloadRoadmapModal.tsx`](/src/components/assessment/DownloadRoadmapModal.tsx): Interactive download modal providing one-click PDF generation and instant browser file download.
- **Unit Tests**: [`src/lib/roadmap-generator.test.mjs`](/src/lib/roadmap-generator.test.mjs) (4 unit tests passing).

---

## 4. Brand & Compliance Guardrails

1. **No Hallucinated URLs or Slugs**: Models only reference relative paths (`/universities/<slug>`, `/universities/<slug>/clear-cost`, `/mbbs-in-china-bangladesh`) verified against active database records.
2. **MBBS / Medical Licensing Priority**: Whenever MBBS or clinical medicine is detected, the advisor and co-pilot mandate WDOMS listing and Bangladesh (BMDC) recognition checks prior to comparing fees. Marksheet evaluation automatically verifies HSC Biology >= 3.50.
3. **Fee Separation & China Visa-First Terms**: University tuition, hostel, medical, insurance, and embassy visa fees are itemized separately. EduExpress's China visa-first policy (no consultancy service fees before China visa approval) is explicitly cited.
4. **Visa Integrity**: Consular simulator enforces non-immigrant intent, strictly penalizing mentions of off-campus unauthorized work or permanent settlement intentions.
5. **No Guarantees**: Under no circumstances do outputs promise or guarantee university admission, scholarship awards, or visa issuance.
6. **Bilingual Parity**: All features natively support both English and natural Bengali (`bn`), preserving key technical acronyms (BMDC, WDOMS, IELTS, CSC, JW201/JW202, EMGS).

---

## 5. Verification & Testing Playbook

Run the following test commands to verify all services:

```bash
# 1. Run all unit tests (66 passing across all suites)
node --test src/lib/*.test.mjs

# 2. TypeScript compilation check
npx tsc --noEmit

# 3. Linter check on touched files
npx eslint src/lib/roadmap-generator.ts src/lib/pdf-roadmap.ts src/lib/gemini-roadmap.ts src/app/api/ai/roadmap-pdf/route.ts src/components/assessment/DownloadRoadmapModal.tsx src/lib/sop-reviewer.ts src/lib/gemini-sop-reviewer.ts src/app/api/ai/sop-reviewer/route.ts src/components/assessment/SopReviewerCard.tsx src/lib/cost-feasibility.ts src/lib/gemini-cost-feasibility.ts src/app/api/ai/cost-feasibility/route.ts src/components/finders/FinancialFeasibilityCard.tsx src/lib/advisor-tools.ts src/lib/gemini-advisor.ts src/app/api/ai/advisor/route.ts src/components/finders/StudyAdvisorChat.tsx src/components/assessment/TranscriptUploadModal.tsx src/lib/transcript-evaluator.ts src/lib/gemini-transcript.ts src/app/api/ai/evaluate-transcript/route.ts src/lib/visa-simulator.ts src/lib/gemini-visa-simulator.ts src/app/api/ai/visa-simulator/route.ts src/components/visa/VisaInterviewSimulator.tsx

# 4. Production build verification
npm run build

# 5. Pre-deploy SEO launch acceptance audit
npm run seo:audit
```
