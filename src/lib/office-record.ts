// Fallback + admin seed for the Dhanmondi office. Values mirror the live
// Office record character-for-character; if management changes the office
// facts, update the DB record and this seed together so NAP stays identical
// across header, footer, contact page, schema and directory citations.
export const DEFAULT_OFFICE_RECORD = {
  name: 'EduExpress International Dhanmondi Office',
  slug: 'dhanmondi-decision-desk',
  address: 'Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209',
  city: 'Dhaka',
  postalCode: '1209',
  phonePrimary: '+8801983333566',
  phoneSecondary: '+8801329663505',
  email: 'info@eduexpressint.com',
  hours: 'Saturday to Thursday, 11:00 AM to 6:00 PM',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=EduExpress+International+Dhanmondi+Dhaka',
  photoUrl: '/images/office/dhanmondi-reception.webp',
  isHeadOffice: true,
  isPublished: true,
  lastVerifiedAt: null,
} as const;
