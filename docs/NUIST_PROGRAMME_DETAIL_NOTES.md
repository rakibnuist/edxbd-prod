# Internal NUIST programme-detail research

This record supports the reusable university-detail page. The public loader hides source links, maintenance dates and internal metadata.

## Import scope

`data/research/nuist-programme-details.json` enriches four existing named English bachelor programmes: Artificial Intelligence; Computer Science and Technology; Electronic Information Engineering; International Economy and Trade. The names, four-year duration and published September intake retain the existing governed CMS catalogue; current availability remains explicitly unconfirmed.

The payload sets `internal.profileOnly: true`. The importer merges only the private profile campaign for an already-existing institution. It leaves all NUIST University and Program columns, programme statuses, source fields and timestamps unchanged. A before/after full-record comparison was used to verify this.

## Live official tables inspected

- `https://gjy.nuist.edu.cn/english/FeeswPayment/listm.htm`: application fee and sections II-VI, all accommodation notes and the payment timing note.
- `https://gjy.nuist.edu.cn/english/EntryRequirements/listm.htm`: full Bachelor row and shared document notes.
- `https://gjy.nuist.edu.cn/english/BachelorPrograms_3745/listm.htm`: CSCA subject matrix, 2027 catalogue heading and attachment link.
- Existing named-programme provenance is `https://gjy.nuist.edu.cn/english/NUISTExcellentFreshmenScholarship/listm.htm`. A re-fetch timed out. Existing supported names were retained with no claim that applications are open and no guaranteed scholarship amount.

## Fees and timing

- Application: CNY 500 after application submission/payment request, non-refundable; review starts after payment.
- Bachelor tuition: CNY 15,000 per year. Tuition, accommodation and insurance are payable in the first academic week.
- Twin accommodation: CNY 2,000-2,500 per year. This is a range, so it has `displayAmount` and no numeric amount. The calculator must require a confirmed room quote.
- Single accommodation: CNY 4,000 per year, an alternative subject to allocation. Marked optional so it is not added to twin accommodation. The fee page notes limited single/twin rooms are reserved for PhD and national-level scholarship students; undergraduate allocation is not promised.
- Insurance: CNY 600 per year, required.
- Medical: CNY 526 per examination after registration.
- Residence permit: CNY 400 for one year or less.
- Room deposit: CNY 200 **in China before check-in**, refunded at check-out if there is no room damage. Classified `other`/`in_china`, not a before-China tuition deposit.
- Electricity: CNY 0.55/kWh, usage-based. It remains non-numeric so the calculator does not add CNY 0.55 as an invented flat fee. Water is free; optional heating has an unquoted extra charge.
- No automatic tuition reduction, living-expense amount, EduExpress package charge or pre-departure tuition deposit is invented.

## Qualifications and documents

The bachelor rows preserve non-Chinese citizenship, high-school graduation below age 25, health/conduct conditions, guardian documentation below 18, and valid CSCA results. English STEM programmes require Mathematics and Physics; the trade/economics programme requires Mathematics. Non-English-speaking applicants need TOEFL iBT 80+, IELTS 6.0+ or Duolingo 100+ with verification available.

Document details preserve passport/visa where applicable, diploma or official pre-graduation evidence, transcripts and notarised translations as needed, Chinese/English study plan, CSCA, English-language evidence, complete medical form valid six months, bank funds covering tuition/accommodation/living, guardian documentation and additional documents requested by the university.

## Exclusions and source conflicts

No Masters catalogue or generic available Master course was invented from an image-based page. No PhD course was added: the live Meteorology curriculum page (`https://gjy.nuist.edu.cn/qxxwywskbsw/listm.htm`) describes a real English PhD with a three-year curriculum, while the live 2027 doctoral admissions heading (`https://gjy.nuist.edu.cn/english/PhwDPrograms/listm.htm`) says four years or above. The exact current subject catalogue must be checked before presenting a named current offer.

The public application-procedures page still gives a 31 May 2026 deadline. That closed date was not rolled forward to 2027. Current-cycle deadlines remain unconfirmed.
