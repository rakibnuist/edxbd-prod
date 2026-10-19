# University profile reference review

This is an internal implementation note. Each supplied page was opened separately and inspected through its rendered accessibility content and browser screenshot. These references inform information architecture; their fees, ranks and admission claims are not authoritative evidence for EduExpress records.

## 1. Study in China / Peking University

[Reference page](https://www.studyinchina.edu.cn/universityDetaile?unid=40288684740a7ef101740af72e9e0000)

- Large campus panorama with the institution logo, name and institution labels over the image.
- Horizontal navigation below the banner separates the overview, admissions and daily guide.
- The desktop layout pairs the main introduction with a contrasting sidebar containing a rank, founding year, address, official website and contacts.
- The rank shown in the sidebar has a provider label but no visible edition. EduExpress should always show a ranking's publisher, edition and scope beside the value.
- Access: the text web reader failed, but the browser rendered the university page successfully. The page defaulted to Chinese navigation with English introductory body text.

## 2. MalishaEdu / Guilin University of Electronic Technology

[Reference page](https://malishaedu.com/list/university-details/2)

- Campus banner, logo and a prominent university name create a clear institution header.
- A section bar exposes programs, about, fee structure, accommodation, admission, scholarships, FAQ and gallery.
- Program rows put degree, language, duration, tuition and accommodation together, making the cost relationship easy to scan.
- Main content is paired with an institution/location sidebar. Fees also receive their own section.
- Some navigation targets overlap and the gallery contains empty states. EduExpress should render only useful navigation and populated media.
- Access: text and browser views both worked. Figures and intake claims remain reference content requiring official corroboration before reuse.

## 3. BHE UNI / NUIST

[Reference page](https://bheuni.io/university-details/nanjing-university-of-information-science-and-technology-nuist)

- Breadcrumbs and a large photographic hero introduce the institution, country and application action.
- Overview, history and reasons-to-study tabs divide a long profile into understandable sections.
- Overview includes a useful facts table followed by rankings, language requirements, scholarships, fees, application instructions and popular courses.
- Course cards expose entry score, level, campus and fees close to the program title.
- The profile mixes world, subject and inapplicable national tables; EduExpress should separate those scopes and show only attributable rankings. A few fields display raw HTML or empty content, which should be normalized rather than reproduced.
- Access: text and browser views worked. The browser reflected some updated wording that differed from the cached text reader.

## 4. Admissions.cn / Beijing University of Chinese Medicine

[Reference page](https://bucm.admissions.cn/)

- Institution masthead with logo, name and location precedes a large campus gallery.
- A compact navigation bar leads to introduction, programs, guide, fees and scholarship information.
- Programs are grouped by study level and show start months; a profile sidebar offers key institutional facts.
- Additional guide/gallery/video/scholarship links make deeper information discoverable.
- The visible unqualified “Ranking” value sits near a view counter. It is not suitable evidence of a world university rank.
- Access: the initial browser navigation timed out, but the subsequent rendered state and screenshot loaded successfully. Text reader also worked.

## 5. Digi Edu Pro / Guangxi University of Science and Technology

[Reference page](https://www.digiedupro.com/guangxi-university-of-science-and-technology)

- Logo, institution name, province and a rank appear in a compact masthead.
- A horizontal bar exposes courses, fees, admission procedure, gallery, scholarship and reasons to choose the service.
- Campus imagery, an institutional introduction, study-level tiles and FAQs provide a recognizable university profile structure.
- The rank lacks a visible publisher/edition and percentage meters are unexplained. EduExpress should not reproduce those values or imply their precision.
- Access: the text reader failed, but the browser rendered the page successfully.

## EduExpress implementation direction

- Use a campus image hero with the institution logo, a single H1, country/city, concise overview and clear actions.
- Keep crawlable section links and main content in the server-rendered page, using a quick-facts sidebar to support scanning.
- Make programs, fees, accommodation, scholarships, admission requirements and sources distinct sections.
- Put the interactive ClearCost calculator close to programs and identify estimates, exclusions, currencies, scholarship assumptions and missing amounts explicitly.
- Display world ranking cards only from named ranking publishers, with the edition and scope. Do not turn a subject or national placement into a world rank.
- Keep editorial source-check/review timestamps internal. Application deadlines and ranking edition years remain relevant study information.

## Search implementation

- Unique institution-based absolute titles, one brand suffix, descriptive metadata and self-referencing canonical URLs.
- WebPage and CollegeOrUniversity structured data with EduExpress identified as publisher; the university remains the page subject.
- BreadcrumbList markup connected to the WebPage and matching the visible breadcrumb path.
- No invisible FAQ markup, unsupported reviews, rankings or maintenance timestamps in the page graph.
- Exclude paused programs from course markup and preserve the existing verification-based indexing gate. Design changes alone do not qualify an unverified record for indexing.

Primary implementation references: [Google title link guidance](https://developers.google.com/search/docs/appearance/title-link), [Google breadcrumb guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [Google structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
