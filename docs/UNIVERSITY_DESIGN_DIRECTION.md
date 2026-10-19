# University profile design direction

## Scope and decisions

The university profile is a research page with a working program finder and budget tool. It should help a prospective student answer, “Does this university fit my subject, language and budget, and how do I apply with EduExpress International?”

Keep the existing Next.js, Tailwind, data loaders, real university names and logos, calculator logic, accessible tabs, routes and enquiry form. This pass changes presentation and findability; it does not require a new component framework or invented marketing figures.

The user's latest instruction makes the public profile evergreen. Do not render application deadlines, closed-cycle notices, intake years, dated statistics, ranking edition years or maintenance timestamps in profile copy, program summaries, scholarship cards, calculator labels or enquiry defaults. Retain that source context internally. Do not describe an old application cycle as open. Ranking publisher names and scope remain visible; edition years stay internal.

## Taste Skill installation

The user explicitly requested the design skill at <https://www.tasteskill.dev/>. Its official site links to `Leonxlnx/taste-skill`.

- Main skill: `/Users/a1/.codex/skills/design-taste-frontend/SKILL.md`.
- Companion: `/Users/a1/.codex/skills/redesign-skill/SKILL.md`. The current companion is retired and directs redesigns to the main skill.
- Installed with the existing Codex skill-installer helper. The direct Python download encountered a local certificate-chain error; the helper's Git method succeeded without disabling certificate verification.
- Skill scripts and reference files are installed with the main skill. No remote package-manager script was run and no application dependency was added.
- Normal automatic skill discovery begins on the next turn. The files can be read and followed in the current turn.

The relevant Taste principles are audit first, keep working behavior and the established brand, use the subject's real material, give the screen one clear job, vary information layout, avoid decorative chrome, and verify desktop and phone views. For the program finder and calculator, the app-screen chapter explicitly permits restrained borders, aligned tables, small labels and repeated peer objects. Its page-only demands for four photographs and continuous entrance animation do not apply to those working controls. No fake university photographs, figures or testimonials should be added to satisfy an aesthetic rule.

## Real content and assets

The profile's distinctive material is already present:

1. NUIST's full name and recognizable university logo.
2. Nanjing, Jiangsu as a real place.
3. Published university and subject rankings, each with its publisher and scope; edition context stays internal.
4. Atmospheric science and meteorology alongside computing, engineering, business, languages and arts.
5. Actual degree levels and a substantial program catalog.
6. English and Chinese teaching-medium choices.
7. CSC and university scholarship routes with actual coverage and conditions.
8. Program-specific tuition periods and fee amounts.
9. Separate before-China and in-China payments.
10. Published EduExpress Package fees with their real currency.
11. A functioning application-interest/assessment route that can carry the chosen university and program.
12. The existing photograph at `public/images/students/campus-nuist.webp` and the authentic scenic campus photograph prepared at `public/images/universities/nuist-campus.webp`. Do not present other campuses or authorization documents as a campus photograph.

The new scenic WebP comes from the top photograph on page 5 of the user-provided local NUIST brochure, `/Users/a1/Downloads/7d1c7994-f175-4a1b-aa6c-002e8a907f48.pdf`. The page was rendered with Poppler and cropped to the photograph before conversion. The resulting 1600 × 708 pixel, 119,874-byte WebP was opened and visually checked: it shows the NUIST building and meteorological radar dome at sunset, contains no baked brochure text and no identifiable faces, and has no generated or replaced visual content. Suggested alt text: “NUIST campus building and meteorological radar dome in Nanjing.” Suggested crop focus: `65% 45%`, keeping the dome visible. The large shared image object on brochure page 6 was rejected because it contains baked-in headings and program text.

## Before audit

A live screenshot was captured through the available browser tool at `/tmp/eduexpress-university-before-taste.png`.

The university name is clear and the four requested priorities are visible. However, the navigation and identity region occupy roughly the first 520 pixels before the Overview content starts. The main content repeats the same white bordered box, the same muted small text and the same list treatment. The profile has no explicit application action in its first screen, while the right-hand action is a generic eligibility request. Historical admission-cycle text appears in several visible places and weakens the evergreen goal.

The three highest-impact changes are:

1. Make the identity region more purposeful: clear university name, location, optional real campus photograph and a direct application CTA. Keep the priority fact strip compact.
2. Make Overview tell the university's story through short specific prose, a strong-majors treatment and an informative scholarship/fee summary rather than a succession of checklists.
3. Give the working sections deliberate controls and readable data: program/degree and medium filters, a universal admission-document area, and all scholarship scenarios inside ClearCost.

## Direction exercise

Taste's app-style dealer offered **Achromatic ledger** and **Framed sheet** for this report/detail interface. **Framed sheet** was selected, seed `616739026`, while keeping the existing brand palette and type. The complete exercise is saved outside application source at `/tmp/eduexpress-taste-direction/direction.json`.

The useful device is a calm blue-grey ground behind one white working surface, restrained tab underlines, clear content edges and no resting shadows. Its face comes from the EduExpress blue and NUIST's own identity rather than a generic dashboard motif. The established public site navigation stays intact; no administrative sidebar or dashboard search is introduced. An app-shell recommendation is not permission to discard the public university page's information architecture.

Idea: NUIST's teaching options and scholarship routes become a practical study plan whose chosen program, teaching medium, funding and two-stage budget agree with one another.

Live interaction: choose a program and teaching medium, then compare eligible scholarship scenarios in ClearCost before applying with EduExpress International.

## Recommended shared structure

### Identity and priorities

Use the full university name and acronym naturally in the main title. Keep location, published ranking, scholarship availability and program breadth visible together, using concise definitions rather than four separate decorative cards. Include **Apply with EduExpress International** as the primary action. Preserve the university and chosen program in the real enquiry URL.

### Overview

Lead with two short, university-specific paragraphs: what it is known for and what international students can study there. Follow with distinctive strengths grounded in available data. Use different compositions for a subject-strength feature, a concise funding summary and a fee comparison. Positive means specific and useful; it does not mean guaranteed admission, employment, scholarships or outcomes.

### Programs and majors

Filter by degree/program and medium of instruction. Keep the search field for major names. Filter counts and empty states must reflect the actual result set. Selecting a result should carry the same program into requirements, fees and application context. On narrow screens, show readable two-line rows or a table inside its own scroll frame; never allow the whole page to overflow.

### Scholarships

Give the reduction or coverage a clear visual lead, then summarize eligible levels and the funding type. Keep conditions, renewal, additional scholarship-specific evidence and the application process in structured disclosures. General admission documents belong in the university's admission/document section; a scholarship may add extra evidence but must not appear to be the only route that requires documents.

### Fees and ClearCost

Keep the requested two payment stages. The scholarship dropdown includes all listed routes, with eligibility explained for the chosen program. Unsupported monetary reductions must remain a comparison option without an invented numeric discount. Only the actual selected compatible award scenario changes payable tuition or fee waivers. Preserve deposit crediting and each currency. Selecting an EduExpress Package includes its published fee in the right-hand breakdown immediately.

### Admission and documents

Present academic qualifications and language requirements with separate headings. Label **Documents required for admission** clearly. Group long evidence into scan-friendly categories or disclosures where helpful, preserving the actual requirements and any program-specific additions. Keep a direct application CTA in this area.

### Rankings

Use a compact table of publisher, ranking scope/subject and position. Keep edition years and source links internal. An absent world rank should not be replaced by an invented number or a subject rank presented as a world rank.

## Validation and handoff

Check the complete interface at desktop and phone widths, including tab navigation, program and medium filters, empty states, scholarship selection, fee waivers, currency-separated totals, package auto-inclusion, application context and dated-text absence. Browser inspection uses the available CUA interface rather than an independent browser-control script. Record actual checks run; do not claim the Taste inspector passed if it was not run.

This document is a design direction and before audit. It does not claim that the proposed visual changes, the final screenshots or a scored final critique have been completed.
