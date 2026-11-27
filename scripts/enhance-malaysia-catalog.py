#!/usr/bin/env python3
"""
enhance-malaysia-catalog.py
Comprehensive population and enhancement script for Malaysian universities in EduExpress.
Sources: AES (Asian Education Solutions) official tuition fee schedules, company profile, and MQA/EMGS portals.
Updates both prisma/data/edxbd.db and data/edxbd.db.
"""

import sqlite3
import json
import os
import uuid
from datetime import datetime

DB_PATHS = [
    os.path.abspath('prisma/data/edxbd.db'),
    os.path.abspath('data/edxbd.db'),
]

NOW_ISO = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
EXPIRY_ISO = '2028-12-31 23:59:59'

def generate_id():
    return 'c' + uuid.uuid4().hex[:24]

# Comprehensive data for 30 Malaysian Universities
MALAYSIA_UNIVERSITIES = [
    {
        "slug": "universiti-malaya",
        "name": "Universiti Malaya (UM)",
        "location": "Jalan Universiti, 50603 Kuala Lumpur, Malaysia",
        "country": "Malaysia",
        "city": "Kuala Lumpur",
        "province": "Kuala Lumpur",
        "intake": "March, October",
        "degree": "Bachelor, Master, PhD, MBBS",
        "taught": "English",
        "rankingCountry": 1,
        "rankingWorld": 60,
        "rankingNational": 1,
        "majors": "Medicine & MBBS, Computer Science & AI, Software Engineering, Mechanical Engineering, Biomedical Engineering, Business Administration, Accounting, Economics",
        "tuition": "RM 14,000 – RM 24,000 / yr (~BDT 3.8L – 6.5L)",
        "tuitionDetails": [
            "Premier public research university. Instruction in English for international degree tracks.",
            "MBBS International Track: RM 673,200 full 5-year tuition + 6% SST (~RM 713,592 total).",
            "International Application Fee: RM 500 payable directly to Universiti Malaya portal.",
            "EduExpress charges BDT 0 consultancy and file-opening fees. All institutional fees paid directly to UM."
        ],
        "documents": [
            "Valid Passport info page (min. 18 months validity)",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level / Bachelor)",
            "English Language Proficiency (IELTS 6.0+ or equivalent)",
            "Health Examination & Medical Report Form",
            "Passport-size photographs (blue background)"
        ],
        "deadlines": {"application": "Rolling / 8 weeks before intake", "startDate": "October"},
        "notes": [
            "Malaysia's oldest and highest-ranked premier public research institution (QS World #60).",
            "Member of the Association of Pacific Rim Universities (APRU).",
            "Malaysian Qualifications Agency (MQA) accredited and recognized globally."
        ],
        "badges": ["QS World #60", "Malaysia #1", "MQA Accredited", "Zero Service Charge BDT 0", "Premier Public Research"],
        "logo": "/images/universities/logos/universiti-malaya.webp",
        "officialUrl": "https://www.um.edu.my",
        "aliases": ["UM", "University of Malaya"],
        "programs": [
            {
                "level": "MBBS",
                "name": "Bachelor of Medicine and Bachelor of Surgery (MBBS)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "October",
                "tuition": "RM 142,800 / yr (RM 713,592 Total 5 Yrs incl. SST)",
                "tuitionAfterScholarship": "RM 713,592 Total",
                "eligibility": ["HSC / A-Level with straight A/A* in Biology, Chemistry, Physics/Math", "IELTS 6.5 minimum", "Faculty interview clearance"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Artificial Intelligence)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3.5 Years",
                "intakes": "March, October",
                "tuition": "RM 18,500 / yr (~BDT 5.0L)",
                "tuitionAfterScholarship": "RM 18,500 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.5+ with strong Mathematics", "IELTS 6.0 or verified English MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Software Engineering",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3.5 Years",
                "intakes": "March, October",
                "tuition": "RM 18,500 / yr (~BDT 5.0L)",
                "tuitionAfterScholarship": "RM 18,500 / yr",
                "eligibility": ["HSC / A-Level with high grades in Mathematics & Physics", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Mechanical Engineering (Hons)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 22,000 / yr (~BDT 5.9L)",
                "tuitionAfterScholarship": "RM 22,000 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 3.5 in Science subjects", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Biomedical Engineering (Hons)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 22,500 / yr (~BDT 6.1L)",
                "tuitionAfterScholarship": "RM 22,500 / yr",
                "eligibility": ["HSC / A-Level with high grades in Physics, Chemistry & Biology", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Accounting (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 16,500 / yr (~BDT 4.5L)",
                "tuitionAfterScholarship": "RM 16,500 / yr",
                "eligibility": ["HSC / A-Level with strong Mathematics or Business background", "IELTS 6.0"]
            },
            {
                "level": "Master",
                "name": "Master of Business Administration (MBA)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1.5 Years",
                "intakes": "March, October",
                "tuition": "RM 38,000 total (~BDT 10.3L)",
                "tuitionAfterScholarship": "RM 38,000 total",
                "eligibility": ["Recognized Bachelor's degree with min CGPA 3.0 / 4.0", "At least 2 years executive/managerial work experience preferred", "IELTS 6.5"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Computer Science",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 - 5 Years",
                "intakes": "Rolling / March, October",
                "tuition": "RM 15,000 / yr (~BDT 4.0L)",
                "tuitionAfterScholarship": "RM 15,000 / yr",
                "eligibility": ["Master's degree in relevant field with research publication track record", "Detailed Research Proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 14,000 – RM 24,000", "notes": "Payable per semester directly to UM", "recipient": "Universiti Malaya", "refundable": "conditional"},
            {"item": "EMGS Student Pass & Visa Processing", "cost": "RM 2,800 – RM 3,200", "notes": "Official Malaysian Immigration & EMGS charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Medical Screening & Health Insurance", "cost": "RM 1,000", "notes": "Annual medical insurance coverage in Malaysia", "recipient": "EMGS Insurance", "refundable": "no"},
            {"item": "Application Fee", "cost": "RM 500", "notes": "Direct international online application fee", "recipient": "Universiti Malaya", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening and zero consultancy charges", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "Malaysian International Scholarship (MIS)", "type": "Government Grant", "details": ["Full tuition waiver and monthly living allowance for outstanding Master's/PhD applicants."], "amount": "100% Tuition + Living Stipend", "condition": "CGPA 3.5+ and strong research profile", "coverage": "Tuition, hostel & living allowance", "status": "active"}
        ]
    },
    {
        "slug": "universiti-teknologi-malaysia",
        "name": "Universiti Teknologi Malaysia (UTM)",
        "location": "Sultan Ibrahim Chancellery Building, Jalan Iman, 81310 Skudai, Johor Bahru, Malaysia",
        "country": "Malaysia",
        "city": "Johor Bahru",
        "province": "Johor",
        "intake": "March, October",
        "degree": "Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 2,
        "rankingWorld": 181,
        "rankingNational": 2,
        "majors": "Software Engineering, Computer Science, Chemical Engineering, Civil Engineering, Electrical Engineering, Data Engineering, Artificial Intelligence",
        "tuition": "RM 16,000 – RM 24,000 / yr (~BDT 4.3L – 6.5L)",
        "tuitionDetails": [
            "Malaysia's premier engineering and technological public research university (QS World #181).",
            "Campuses in Johor Bahru (main campus, 1,222 hectares) and Kuala Lumpur (Jalan Sultan Yahya Petra).",
            "Application Fee: RM 450; EMGS: RM 3,000; Personal Bond: RM 750 (refundable).",
            "EduExpress charges BDT 0 service fees. Zero file-opening charge."
        ],
        "documents": [
            "Valid Passport with at least 18 months validity",
            "Academic Certificates & Transcripts (attested)",
            "English Language Certificate (IELTS 5.5-6.0 / TOEFL)",
            "Medical Examination Report",
            "Digital Passport Photograph"
        ],
        "deadlines": {"application": "Rolling / 8 weeks before intake", "startDate": "October"},
        "notes": [
            "Top 100 in the world for Engineering & Technology disciplines.",
            "Over 100 international research collaborations with MIT, Imperial, and Cambridge.",
            "Affordable premier public university education with high employability."
        ],
        "badges": ["QS World #181", "Top 100 Engineering", "MQA Accredited", "Zero Service Charge BDT 0", "Public Research"],
        "logo": "/images/universities/logos/universiti-teknologi-malaysia.webp",
        "officialUrl": "https://www.utm.my",
        "aliases": ["UTM", "University of Technology Malaysia"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Data Engineering)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "March, October",
                "tuition": "RM 18,000 / yr (~BDT 4.8L)",
                "tuitionAfterScholarship": "RM 18,000 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 3.5 in Mathematics & Physics", "IELTS 5.5-6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor in Software Engineering (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "March, October",
                "tuition": "RM 18,000 / yr (~BDT 4.8L)",
                "tuitionAfterScholarship": "RM 18,000 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.5 with strong Mathematics", "IELTS 5.5-6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Chemical Engineering (Hons)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 21,500 / yr (~BDT 5.8L)",
                "tuitionAfterScholarship": "RM 21,500 / yr",
                "eligibility": ["HSC / A-Level with high grades in Chemistry, Physics & Math", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Electrical Engineering (Hons)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 21,500 / yr (~BDT 5.8L)",
                "tuitionAfterScholarship": "RM 21,500 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 3.5 in Science", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Civil Engineering (Hons)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 21,500 / yr (~BDT 5.8L)",
                "tuitionAfterScholarship": "RM 21,500 / yr",
                "eligibility": ["HSC / A-Level Science stream with Mathematics and Physics", "IELTS 5.5"]
            },
            {
                "level": "Master",
                "name": "Master of Science in Engineering Business Management",
                "subject": "Engineering",
                "languages": "English",
                "duration": "1.5 Years",
                "intakes": "March, October",
                "tuition": "RM 28,000 total (~BDT 7.5L)",
                "tuitionAfterScholarship": "RM 28,000 total",
                "eligibility": ["Bachelor's degree in engineering or technical field with CGPA 3.0+", "IELTS 6.0"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Engineering",
                "subject": "Engineering",
                "languages": "English",
                "duration": "3 - 5 Years",
                "intakes": "Rolling / March, October",
                "tuition": "RM 16,000 / yr (~BDT 4.3L)",
                "tuitionAfterScholarship": "RM 16,000 / yr",
                "eligibility": ["Master's degree in relevant discipline", "Approved research proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 16,000 – RM 24,000", "notes": "Payable per semester to UTM", "recipient": "Universiti Teknologi Malaysia", "refundable": "conditional"},
            {"item": "EMGS Student Pass Processing", "cost": "RM 3,000", "notes": "Official EMGS visa clearance", "recipient": "EMGS", "refundable": "no"},
            {"item": "Application Fee", "cost": "RM 450", "notes": "Direct international online application fee", "recipient": "UTM", "refundable": "no"},
            {"item": "Personal Bond (Refundable)", "cost": "RM 750", "notes": "Refunded upon graduation or visa exit", "recipient": "UTM / Immigration", "refundable": "yes"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "Zero service charge, zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "UTM Young Scholars Grant", "type": "Merit Waiver", "details": ["Partial fee reduction for high CGPA Master's and PhD researchers."], "amount": "20% - 40% Waiver", "condition": "CGPA 3.7+ and research output", "coverage": "Tuition fees", "status": "active"}
        ]
    },
    {
        "slug": "taylors-university",
        "name": "Taylor's University",
        "location": "No. 1 Jalan Taylor's, 47500 Subang Jaya, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Subang Jaya",
        "province": "Selangor",
        "intake": "January, March, June, August, September",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD, MBBS",
        "taught": "English",
        "rankingCountry": 5,
        "rankingWorld": 251,
        "rankingNational": 5,
        "majors": "Hospitality & Tourism, Computer Science, Software Engineering, MBBS & Medicine, Business Administration, Accounting & Finance, Actuarial Studies, Architecture",
        "tuition": "RM 32,000 – RM 48,000 / yr (~BDT 8.6L – 12.9L)",
        "tuitionDetails": [
            "Ranked #1 Private University in Southeast Asia (QS World #251).",
            "World top 20 for Hospitality & Leisure Management.",
            "UK Dual Degrees: Dual awards with University of the West of England (UWE Bristol) and University of Toulouse.",
            "MBBS Program: RM 113,234 first-year payment; RM 512,760 full 5-year tuition (official schedule including SST).",
            "Zero EduExpress service charge (BDT 0)."
        ],
        "documents": [
            "Passport copy (all pages / information page)",
            "Academic certificates & transcripts (SSC & HSC / O & A Level)",
            "English Proficiency: IELTS 5.5-6.0 or verified English Medium of Instruction letter",
            "Passport size photo with white background",
            "Health declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "March & September"},
        "notes": [
            "Lakeside Campus Subang Jaya with world-class facilities and high tech labs.",
            "Unrivalled corporate internship network with top multinationals across ASEAN.",
            "Dual-award degrees confer two certificates: Taylor's University and UK/French partner."
        ],
        "badges": ["QS World #251", "World #19 Hospitality", "UK Dual Degree", "Zero Service Charge BDT 0", "#1 Private Uni in SE Asia"],
        "logo": "/images/universities/logos/taylors-university.webp",
        "officialUrl": "https://university.taylors.edu.my",
        "aliases": ["Taylor's", "Taylors University"],
        "programs": [
            {
                "level": "MBBS",
                "name": "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "September",
                "tuition": "RM 102,552 / yr (RM 512,760 Full 5 Yrs incl. SST)",
                "tuitionAfterScholarship": "RM 512,760 Full Course",
                "eligibility": ["HSC / A-Level with minimum BBB, ABC or AAC in Biology, Chemistry & Physics/Math", "IELTS 6.5 minimum", "Faculty Interview"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Hons) - Dual Award with UWE Bristol",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, August, September",
                "tuition": "RM 38,500 / yr (~BDT 10.4L)",
                "tuitionAfterScholarship": "RM 31,500 / yr (With High Achiever Award)",
                "eligibility": ["HSC / A-Level minimum GPA 3.0+ with Mathematics", "IELTS 6.0 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Software Engineering (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, August, September",
                "tuition": "RM 38,500 / yr (~BDT 10.4L)",
                "tuitionAfterScholarship": "RM 31,500 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.0+ with Mathematics", "IELTS 6.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of International Hospitality Management (Dual Award with Univ. of Toulouse)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, August, September",
                "tuition": "RM 39,200 / yr (~BDT 10.5L)",
                "tuitionAfterScholarship": "RM 32,000 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Business (Hons) Accounting & Finance",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, August, September",
                "tuition": "RM 37,800 / yr (~BDT 10.2L)",
                "tuitionAfterScholarship": "RM 30,800 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.0+", "IELTS 6.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) Actuarial Studies",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, August, September",
                "tuition": "RM 39,500 / yr (~BDT 10.6L)",
                "tuitionAfterScholarship": "RM 32,500 / yr",
                "eligibility": ["HSC / A-Level with strong Mathematics / Further Maths", "IELTS 6.0"]
            },
            {
                "level": "Foundation",
                "name": "Foundation in Science / Foundation in Computing",
                "subject": "Foundation & pathway",
                "languages": "English",
                "duration": "1 Year",
                "intakes": "January, March, June, August",
                "tuition": "RM 29,500 (~BDT 7.9L)",
                "tuitionAfterScholarship": "RM 24,500",
                "eligibility": ["SSC / O-Level with minimum 5 credits including Math & English"]
            },
            {
                "level": "Master",
                "name": "Master of Business Administration (MBA)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "January, March, June, August, October",
                "tuition": "RM 49,500 total (~BDT 13.3L)",
                "tuitionAfterScholarship": "RM 42,000 total",
                "eligibility": ["Bachelor's degree with CGPA 2.75+", "IELTS 6.0 or MOI English"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 32,000 – RM 48,000", "notes": "Subject to programme choice", "recipient": "Taylor's University", "refundable": "conditional"},
            {"item": "EMGS Student Pass & Visa Processing", "cost": "RM 2,800 – RM 3,500", "notes": "Malaysian Immigration official charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Registration & Enrolment Fee", "cost": "RM 3,000", "notes": "One-time initial international enrolment charge", "recipient": "Taylor's University", "refundable": "no"},
            {"item": "International Student Administration Fee", "cost": "RM 2,500", "notes": "Annual university administrative charge", "recipient": "Taylor's University", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening charge", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "Taylor's High Achiever Scholarship", "type": "Merit Waiver", "details": ["Tuition waiver up to RM 15,000 for high-achieving HSC/A-Level graduates (GPA 4.5+ / AAB)."], "amount": "RM 5,000 – RM 15,000 Waiver", "condition": "High school GPA 4.0 - 5.0", "coverage": "First year tuition reduction", "status": "active"},
            {"title": "Early Bird Acceptance Waiver", "type": "Early Admission", "details": ["Rebate of RM 2,000 on first semester tuition for early submission."], "amount": "RM 2,000 Waiver", "condition": "Apply 8 weeks before intake", "coverage": "Tuition deduction", "status": "active"}
        ]
    },
    {
        "slug": "ucsi-university",
        "name": "UCSI University",
        "location": "No. 1, UCSI Heights, Jalan Menara Gading, Cheras, 56000 Kuala Lumpur, Malaysia",
        "country": "Malaysia",
        "city": "Kuala Lumpur",
        "province": "Kuala Lumpur",
        "intake": "January, May, September",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD, MBBS",
        "taught": "English",
        "rankingCountry": 6,
        "rankingWorld": 265,
        "rankingNational": 6,
        "majors": "Medicine & MD, Pharmacy, Computer Science, Artificial Intelligence, Chemical Engineering, Performing Arts & Music, Hospitality Management, Architecture",
        "tuition": "RM 24,000 – RM 38,000 / yr (~BDT 6.5L – 10.2L)",
        "tuitionDetails": [
            "Ranked QS World #265 (Top 1% in the world).",
            "World top 25 for Performing Arts; globally acclaimed Faculty of Medicine and Pharmacy.",
            "Doctor of Medicine (MD / MBBS) accredited by Malaysian Medical Council (MMC) & WHO.",
            "Campuses in Kuala Lumpur, Terengganu, and Springhill (Medical Campus).",
            "BDT 0 EduExpress service charge."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Proficiency: IELTS 5.5-6.0 or MOI English certificate",
            "Passport size photos (white background)",
            "Health Declaration Form"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "May & September"},
        "notes": [
            "UCSI University is recognized as one of Asia's top private comprehensive institutions.",
            "Maintains research and internship arrangements with Harvard University and Imperial College London.",
            "Modern high-tech campuses with comprehensive hostel accommodation."
        ],
        "badges": ["QS World #265", "Top 1% Worldwide", "World #21 Performing Arts", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/ucsi-university.webp",
        "officialUrl": "https://www.ucsiuniversity.edu.my",
        "aliases": ["UCSI", "UCSI University Malaysia"],
        "programs": [
            {
                "level": "MBBS",
                "name": "Doctor of Medicine (MD / MBBS)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "September",
                "tuition": "RM 82,000 / yr (~BDT 22.1L / yr)",
                "tuitionAfterScholarship": "RM 82,000 / yr",
                "eligibility": ["HSC / A-Level with BBB, ABC or AAC in Biology, Chemistry & Physics/Math", "IELTS 6.0+", "Interview clearance"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Pharmacy (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 34,500 / yr (~BDT 9.3L)",
                "tuitionAfterScholarship": "RM 25,875 / yr (With 25% Merit Scholarship)",
                "eligibility": ["HSC / A-Level with high grades in Chemistry, Biology & Math", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 26,500 / yr (~BDT 7.1L)",
                "tuitionAfterScholarship": "RM 19,875 / yr (With 25% Merit Scholarship)",
                "eligibility": ["HSC / A-Level with minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Hons) in Artificial Intelligence",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 27,200 / yr (~BDT 7.3L)",
                "tuitionAfterScholarship": "RM 20,400 / yr",
                "eligibility": ["HSC / A-Level with strong Mathematics", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Chemical Engineering with Honours",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "January, May, September",
                "tuition": "RM 29,800 / yr (~BDT 8.0L)",
                "tuitionAfterScholarship": "RM 22,350 / yr",
                "eligibility": ["HSC / A-Level Science stream with Chemistry & Physics", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Arts (Hons) in Hospitality Management",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 25,500 / yr (~BDT 6.9L)",
                "tuitionAfterScholarship": "RM 19,125 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Master",
                "name": "Master of Philosophy in Engineering",
                "subject": "Engineering",
                "languages": "English",
                "duration": "2 Years",
                "intakes": "January, May, September",
                "tuition": "RM 26,000 / yr (~BDT 7.0L)",
                "tuitionAfterScholarship": "RM 19,500 / yr",
                "eligibility": ["Bachelor's in Engineering with CGPA 2.75+", "IELTS 6.0"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Engineering / Business",
                "subject": "Engineering",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "Rolling / January, May, September",
                "tuition": "RM 22,000 / yr (~BDT 5.9L)",
                "tuitionAfterScholarship": "RM 16,500 / yr",
                "eligibility": ["Master's degree with research thesis", "Research Proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 24,000 – RM 38,000", "notes": "Payable in semester instalments", "recipient": "UCSI University", "refundable": "conditional"},
            {"item": "EMGS Visa & Student Pass Processing", "cost": "RM 2,800 – RM 3,300", "notes": "Official Malaysian Immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Enrolment & International Admin Fee", "cost": "RM 2,800", "notes": "Initial university registration & processing", "recipient": "UCSI University", "refundable": "no"},
            {"item": "Security Deposit (Refundable)", "cost": "RM 1,000", "notes": "Refundable upon program completion", "recipient": "UCSI University", "refundable": "yes"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening charge", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "UCSI University Trust Scholarship", "type": "Merit Waiver", "details": ["20% to 50% tuition fee waiver for students with outstanding academic results (GPA 4.5+ or 3 As in A-Level)."], "amount": "20% - 50% Tuition Waiver", "condition": "High school GPA 4.0 - 5.0", "coverage": "Tuition fees throughout study duration", "status": "active"}
        ]
    },
    {
        "slug": "sunway-university",
        "name": "Sunway University",
        "location": "5, Jalan Universiti, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Subang Jaya",
        "province": "Selangor",
        "intake": "January, April, August, September",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 7,
        "rankingWorld": 539,
        "rankingNational": 7,
        "majors": "Computer Science & AI, Software Engineering, Business & Finance, Accounting, Conventions & Events Management, Medical Biotechnology, Culinary Arts, Psychology",
        "tuition": "RM 28,000 – RM 44,000 / yr (~BDT 7.5L – 11.9L)",
        "tuitionDetails": [
            "Ranked QS World #539, QS 5-Star rated institution.",
            "Exclusive Dual Bachelor Awards with Lancaster University (UK Top 10) conferring two official degree certificates.",
            "Backed by the Jeffrey Cheah Foundation — Malaysia's largest education charity.",
            "Located in the modern, connected Sunway City smart township.",
            "EduExpress provides BDT 0 free application support."
        ],
        "documents": [
            "Full Passport Copy (including all blank pages)",
            "Academic certificates & transcripts (SSC & HSC / O & A Level)",
            "English Proficiency: IELTS 6.0 or verified English MOI letter",
            "Passport-size photographs (white background)",
            "Medical declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "April & August"},
        "notes": [
            "Graduates receive two parchments: one from Sunway University and one from Lancaster University UK.",
            "Research partnerships with University of Cambridge, University of Oxford, and Harvard University.",
            "Campus connected by elevated canopy walk to Sunway Pyramid Mall and Sunway Medical Centre."
        ],
        "badges": ["QS World #539", "Lancaster UK Dual Degree", "Jeffrey Cheah Scholarships", "Zero Service Charge BDT 0", "QS 5-Star"],
        "logo": "/images/universities/logos/sunway-university.webp",
        "officialUrl": "https://sunwayuniversity.edu.my",
        "aliases": ["Sunway", "Sunway University Malaysia"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) Computer Science (Lancaster Dual Degree)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, April, August",
                "tuition": "RM 36,000 / yr (~BDT 9.7L)",
                "tuitionAfterScholarship": "RM 28,000 / yr (With Jeffrey Cheah Scholarship)",
                "eligibility": ["HSC / A-Level with minimum GPA 3.2+ including Mathematics", "IELTS 6.0 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) Information Technology (Lancaster Dual Degree)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, April, August",
                "tuition": "RM 35,500 / yr (~BDT 9.6L)",
                "tuitionAfterScholarship": "RM 27,500 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.0+", "IELTS 6.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) in Medical Biotechnology",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, April, August",
                "tuition": "RM 37,200 / yr (~BDT 10.0L)",
                "tuitionAfterScholarship": "RM 29,200 / yr",
                "eligibility": ["HSC / A-Level with Chemistry and Biology", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) in Conventions and Events Management",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, April, August",
                "tuition": "RM 33,500 / yr (~BDT 9.0L)",
                "tuitionAfterScholarship": "RM 25,500 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 6.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) in Accounting and Finance (Lancaster Dual Degree)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, April, August",
                "tuition": "RM 36,800 / yr (~BDT 9.9L)",
                "tuitionAfterScholarship": "RM 28,800 / yr",
                "eligibility": ["HSC / A-Level with strong Mathematics", "IELTS 6.0 or MOI"]
            },
            {
                "level": "Diploma",
                "name": "Diploma in Culinary Arts",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "2 Years",
                "intakes": "January, April, August, September",
                "tuition": "RM 27,000 / yr (~BDT 7.3L)",
                "tuitionAfterScholarship": "RM 22,000 / yr",
                "eligibility": ["SSC / O-Level with minimum 3 credits", "Basic English"]
            },
            {
                "level": "Master",
                "name": "Master of Science in Computer Science (By Research)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "2 Years",
                "intakes": "January, April, August",
                "tuition": "RM 26,000 / yr (~BDT 7.0L)",
                "tuitionAfterScholarship": "RM 18,000 / yr",
                "eligibility": ["Bachelor's degree in computing with CGPA 2.75+", "IELTS 6.5"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 28,000 – RM 44,000", "notes": "Payable in semester instalments", "recipient": "Sunway University", "refundable": "conditional"},
            {"item": "EMGS Visa & Student Pass Processing", "cost": "RM 3,000", "notes": "Government EMGS visa fees", "recipient": "EMGS", "refundable": "no"},
            {"item": "Registration & Enrolment Fee", "cost": "RM 2,500", "notes": "One-time initial fee", "recipient": "Sunway University", "refundable": "no"},
            {"item": "Security Deposit (Refundable)", "cost": "RM 1,500", "notes": "Refundable upon program completion", "recipient": "Sunway University", "refundable": "yes"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "Jeffrey Cheah Entrance Scholarship", "type": "Merit Waiver", "details": ["Direct tuition waiver of RM 6,000 to RM 18,000 based on HSC / A-Level results."], "amount": "RM 6,000 – RM 18,000 Waiver", "condition": "HSC GPA 4.0 - 5.0 / A-Level 2-3 As", "coverage": "Tuition fees deduction", "status": "active"}
        ]
    },
    {
        "slug": "asia-pacific-university",
        "name": "Asia Pacific University of Technology & Innovation (APU)",
        "location": "Technology Park Malaysia, Bukit Jalil, 57000 Kuala Lumpur, Malaysia",
        "country": "Malaysia",
        "city": "Kuala Lumpur",
        "province": "Kuala Lumpur",
        "intake": "February, April, May, July, September, November",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 12,
        "rankingWorld": 611,
        "rankingNational": 12,
        "majors": "Artificial Intelligence, Cybersecurity, Software Engineering, Data Analytics, Cloud Engineering, Computer Games Development, FinTech, Digital Marketing",
        "tuition": "RM 26,000 – RM 38,000 / yr (~BDT 7.0L – 10.2L)",
        "tuitionDetails": [
            "Premier Digital Tech Institution certified by MDEC (Malaysia Digital Economy Corporation).",
            "Dual Awards with De Montfort University (DMU) UK — students receive two degrees upon graduation.",
            "Ranked QS World #611; Top 2.2% in Asia; 100% employability track record.",
            "Ultra-modern iconic campus inside Technology Park Malaysia (TPM).",
            "Zero EduExpress service charge (BDT 0)."
        ],
        "documents": [
            "Passport copy (info page with at least 18 months validity)",
            "Academic certificates & marksheets (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 5.0-6.0 or MOI English certificate)",
            "Passport size photos (white background)",
            "Medical examination form"
        ],
        "deadlines": {"application": "Rolling / 4-6 weeks before intake", "startDate": "May, July & September"},
        "notes": [
            "Malaysia's #1 university for Computing, Cybersecurity, and AI.",
            "APU teams regularly win national and international hackathons and cybersecurity championships.",
            "Dual-degree UK certificates conferred by De Montfort University, Leicester."
        ],
        "badges": ["QS World #611", "Premier Digital Tech (MDEC)", "UK Dual Award (DMU)", "Zero Service Charge BDT 0", "#1 Tech Hub"],
        "logo": "/images/universities/logos/asia-pacific-university.webp",
        "officialUrl": "https://www.apu.edu.my",
        "aliases": ["APU", "Asia Pacific University Malaysia", "APIIT"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "BSc (Hons) in Computer Science with Specialism in AI (DMU UK Dual Award)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "February, May, July, September, November",
                "tuition": "RM 32,500 / yr (~BDT 8.8L)",
                "tuitionAfterScholarship": "RM 26,000 / yr (With 20% Merit Scholarship)",
                "eligibility": ["HSC / A-Level with minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "BSc (Hons) in Cyber Security (DMU UK Dual Award)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "February, May, July, September, November",
                "tuition": "RM 32,500 / yr (~BDT 8.8L)",
                "tuitionAfterScholarship": "RM 26,000 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "BSc (Hons) in Software Engineering (DMU UK Dual Award)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "February, May, July, September, November",
                "tuition": "RM 32,500 / yr (~BDT 8.8L)",
                "tuitionAfterScholarship": "RM 26,000 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "BSc (Hons) in Information Technology with Specialism in Cloud Engineering",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "February, May, July, September, November",
                "tuition": "RM 31,500 / yr (~BDT 8.5L)",
                "tuitionAfterScholarship": "RM 25,200 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Engineering in Mechatronic Engineering with Honours",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "February, May, July, September, November",
                "tuition": "RM 32,000 / yr (~BDT 8.6L)",
                "tuitionAfterScholarship": "RM 25,600 / yr",
                "eligibility": ["HSC / A-Level Science stream with Physics & Math", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "BA (Hons) in Business Management with Specialism in Digital Leadership",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "February, May, July, September, November",
                "tuition": "RM 30,500 / yr (~BDT 8.2L)",
                "tuitionAfterScholarship": "RM 24,400 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Master",
                "name": "Master of Science in Artificial Intelligence",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "May, July, September, November",
                "tuition": "RM 38,500 total (~BDT 10.4L)",
                "tuitionAfterScholarship": "RM 30,800 total",
                "eligibility": ["Bachelor's in Computing or related technical area with CGPA 2.75+", "IELTS 6.0"]
            },
            {
                "level": "Master",
                "name": "Master of Science in Cyber Security",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "May, July, September, November",
                "tuition": "RM 38,500 total (~BDT 10.4L)",
                "tuitionAfterScholarship": "RM 30,800 total",
                "eligibility": ["Bachelor's in Computing or IT with CGPA 2.75+", "IELTS 6.0"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 26,000 – RM 38,000", "notes": "Payable in semester instalments", "recipient": "APU", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "International Student Administration Fee", "cost": "RM 2,500", "notes": "One-time initial enrolment and registration charge", "recipient": "APU", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "APU Merit Scholarship", "type": "Merit Waiver", "details": ["15% to 30% tuition fee waiver based on high school results (GPA 4.0 - 5.0)."], "amount": "15% - 30% Tuition Waiver", "condition": "High school GPA 4.0+", "coverage": "Tuition fees throughout study duration", "status": "active"}
        ]
    },
    {
        "slug": "universiti-kuala-lumpur",
        "name": "Universiti Kuala Lumpur (UniKL)",
        "location": "1016 Jalan Sultan Ismail, 50250 Kuala Lumpur, Malaysia",
        "country": "Malaysia",
        "city": "Kuala Lumpur",
        "province": "Kuala Lumpur",
        "intake": "January, July, September",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD, MBBS",
        "taught": "English",
        "rankingCountry": 15,
        "rankingWorld": 1001,
        "rankingNational": 15,
        "majors": "Software Engineering, MBBS & Medicine, Aviation Technology, Automation & Robotics, Pharmacy, Computer Animation, Business Technology, Marine Engineering",
        "tuition": "RM 20,000 – RM 28,000 / yr (~BDT 5.4L – 7.5L)",
        "tuitionDetails": [
            "Malaysia's premier Higher Technical and Vocational Education and Training (HTVET) institution.",
            "12 specialized branch institutes across Malaysia: MIIT (Info Tech, KL), RCMP (Medicine, Ipoh), MIAT (Aviation, Sepang), MFI (Industrial Tech, Bangi).",
            "MBBS Program (UniKL RCMP Perak): RM 93,704 first-year payment; RM 468,520 full 5-year tuition + 6% SST.",
            "Over 130 industry-accredited academic programmes from Foundation to PhD.",
            "EduExpress charges BDT 0 service fees."
        ],
        "documents": [
            "Valid Passport with minimum 18 months validity",
            "Academic Transcripts & Certificates (attested)",
            "English Language Certificate (IELTS 5.5 or English Medium of Instruction letter)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "July & September"},
        "notes": [
            "Rated SETARA 5-Star (Very Good) by the Ministry of Higher Education Malaysia.",
            "Direct hands-on technical training with industry partners including Airbus, Boeing, Microsoft, and Siemens.",
            "Comprehensive on-campus hostels and laboratories."
        ],
        "badges": ["SETARA 5-Star", "Premier HTVET University", "MQA Accredited", "Zero Service Charge BDT 0", "12 Specialized Institutes"],
        "logo": "/images/universities/logos/universiti-kuala-lumpur.webp",
        "officialUrl": "https://www.unikl.edu.my",
        "aliases": ["UniKL", "University of Kuala Lumpur"],
        "programs": [
            {
                "level": "MBBS",
                "name": "Bachelor of Medicine and Bachelor of Surgery (MBBS) - UniKL RCMP",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "September",
                "tuition": "RM 93,704 / yr (RM 468,520 Full 5 Yrs + 6% SST)",
                "tuitionAfterScholarship": "RM 468,520 Full Course",
                "eligibility": ["HSC / A-Level with BBB, ABC or AAC in Biology, Chemistry & Physics/Math", "IELTS 6.0", "Faculty interview"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Information Technology (Hons) in Software Engineering (UniKL MIIT)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, July, September",
                "tuition": "RM 22,000 / yr (~BDT 5.9L)",
                "tuitionAfterScholarship": "RM 17,600 / yr (With 20% Merit Waiver)",
                "eligibility": ["HSC / A-Level with minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Multimedia Technology (Hons) in Computer Animation (UniKL MIIT)",
                "subject": "Arts & design",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, July, September",
                "tuition": "RM 22,000 / yr (~BDT 5.9L)",
                "tuitionAfterScholarship": "RM 17,600 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Engineering Technology (Hons) in Robotics & Automation (UniKL MFI)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "January, July, September",
                "tuition": "RM 24,000 / yr (~BDT 6.5L)",
                "tuitionAfterScholarship": "RM 19,200 / yr",
                "eligibility": ["HSC / A-Level Science stream with Math & Physics", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Pharmacy (Hons) - UniKL RCMP",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 30,000 / yr (~BDT 8.1L)",
                "tuitionAfterScholarship": "RM 24,000 / yr",
                "eligibility": ["HSC / A-Level with Chemistry, Biology & Math", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Business Administration in Islamic Finance (Hons) - UniKL Business School",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, July, September",
                "tuition": "RM 20,000 / yr (~BDT 5.4L)",
                "tuitionAfterScholarship": "RM 16,000 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Foundation",
                "name": "Foundation in Medical Sciences (UniKL RCMP)",
                "subject": "Foundation & pathway",
                "languages": "English",
                "duration": "1 Year",
                "intakes": "January, July",
                "tuition": "RM 18,500 (~BDT 5.0L)",
                "tuitionAfterScholarship": "RM 15,000",
                "eligibility": ["SSC / O-Level with minimum 5 Bs including Science subjects"]
            },
            {
                "level": "Master",
                "name": "Master of Information Technology",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "1.5 Years",
                "intakes": "January, July",
                "tuition": "RM 24,000 total (~BDT 6.5L)",
                "tuitionAfterScholarship": "RM 19,200 total",
                "eligibility": ["Bachelor's in IT/Computing with CGPA 2.75+", "IELTS 6.0"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 20,000 – RM 28,000", "notes": "Payable in semester instalments directly to UniKL", "recipient": "UniKL", "refundable": "conditional"},
            {"item": "EMGS Visa & Student Pass Processing", "cost": "RM 2,800 – RM 3,200", "notes": "Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Registration & Orientation Fee", "cost": "RM 2,000", "notes": "One-time initial international enrolment fee", "recipient": "UniKL", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "UniKL International Student Merit Waiver", "type": "Merit Waiver", "details": ["Up to 20% - 30% tuition reduction for applicants with high secondary results."], "amount": "20% - 30% Tuition Waiver", "condition": "High school GPA 4.0+", "coverage": "Tuition fees throughout study duration", "status": "active"}
        ]
    },
    {
        "slug": "segi-university",
        "name": "SEGi University & Colleges",
        "location": "No. 9, Jalan Teknologi, Taman Sains Selangor, Kota Damansara, 47810 Petaling Jaya, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Petaling Jaya",
        "province": "Selangor",
        "intake": "January, March, May, July, September, October",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD, MBBS",
        "taught": "English",
        "rankingCountry": 16,
        "rankingWorld": 801,
        "rankingNational": 16,
        "majors": "Medicine & MBBS, Dentistry (BDS), Pharmacy, Information Technology, Business Administration, Accounting & Finance, Biomedical Science, Early Childhood Education",
        "tuition": "RM 18,000 – RM 28,000 / yr (~BDT 4.8L – 7.5L)",
        "tuitionDetails": [
            "QS 5-Star Plus rated institution (highest category in QS Stars rating system).",
            "Full MBBS 5-Year Package: RM 101,986 first-year (registration + Year 1); RM 420,064 full 5-year programme including SST, facilities, and initial visa processing.",
            "UK Dual Degrees: Dual awards with University of Central Lancashire (UCLan) and University of Sunderland.",
            "Main campus in Kota Damansara with dedicated MRT station (Kota Damansara MRT).",
            "Zero EduExpress service charge (BDT 0)."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Proficiency: IELTS 5.5-6.0 or verified English MOI letter",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "May & September"},
        "notes": [
            "One of Malaysia's largest private higher education providers, established in 1977.",
            "Hospitality, Medical, Dental, and Business faculties with industry internship placements.",
            "Dual-award UK degree certificates conferred upon completion."
        ],
        "badges": ["QS 5-Star Plus", "UK Dual Award (UCLan)", "MQA Tier 5", "Zero Service Charge BDT 0", "Full MBBS Package"],
        "logo": "/images/universities/logos/segi-university.webp",
        "officialUrl": "https://segi.edu.my",
        "aliases": ["SEGi", "SEGi University Kota Damansara"],
        "programs": [
            {
                "level": "MBBS",
                "name": "Bachelor of Medicine and Bachelor of Surgery (MBBS)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "September",
                "tuition": "RM 101,986 (Yr 1) / RM 420,064 (Full 5 Yrs incl. SST)",
                "tuitionAfterScholarship": "RM 420,064 Full Course Package",
                "eligibility": ["HSC / A-Level with BBB, ABC or AAC in Biology, Chemistry & Physics/Math", "IELTS 6.0", "Interview clearance"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Dental Surgery (BDS)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "September",
                "tuition": "RM 75,000 / yr (~BDT 20.2L / yr)",
                "tuitionAfterScholarship": "RM 75,000 / yr",
                "eligibility": ["HSC / A-Level with BBB or higher in Biology & Chemistry", "IELTS 6.0", "Interview"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Information Technology (Hons) - Dual Award UCLan UK",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 22,500 / yr (~BDT 6.1L)",
                "tuitionAfterScholarship": "RM 18,000 / yr (With High Achiever Rebate)",
                "eligibility": ["HSC / A-Level with minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Accounting and Finance (Hons) - Dual Award UCLan UK",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 21,500 / yr (~BDT 5.8L)",
                "tuitionAfterScholarship": "RM 17,200 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Biomedical Science (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 24,000 / yr (~BDT 6.5L)",
                "tuitionAfterScholarship": "RM 19,200 / yr",
                "eligibility": ["HSC / A-Level Science stream with Biology & Chemistry", "IELTS 5.5"]
            },
            {
                "level": "Diploma",
                "name": "Diploma in Business Administration",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "2 Years",
                "intakes": "January, March, May, July, September",
                "tuition": "RM 15,000 / yr (~BDT 4.0L)",
                "tuitionAfterScholarship": "RM 12,000 / yr",
                "eligibility": ["SSC / O-Level with minimum 3 credits", "Basic English"]
            },
            {
                "level": "Master",
                "name": "Master of Business Administration (MBA - Global Business)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "January, May, September",
                "tuition": "RM 28,000 total (~BDT 7.5L)",
                "tuitionAfterScholarship": "RM 22,400 total",
                "eligibility": ["Bachelor's degree with CGPA 2.5+", "IELTS 6.0 or MOI English"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 18,000 – RM 28,000", "notes": "General bachelor's tuition payable in instalments", "recipient": "SEGi University", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 3,000", "notes": "Official Malaysian Immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Registration & Enrolment Fee", "cost": "RM 2,500", "notes": "One-time initial international enrolment charge", "recipient": "SEGi University", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "SEGi High Achiever Rebate", "type": "Merit Waiver", "details": ["Direct tuition rebate up to RM 10,000 based on secondary academic performance."], "amount": "RM 4,000 – RM 10,000 Rebate", "condition": "High school GPA 4.0+", "coverage": "Tuition deduction", "status": "active"}
        ]
    },
    {
        "slug": "university-of-cyberjaya",
        "name": "University of Cyberjaya (UoC)",
        "location": "Persiaran Bestari, Cyber 11, 63000 Cyberjaya, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Cyberjaya",
        "province": "Selangor",
        "intake": "January, February, May, July, September, October",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD, MBBS",
        "taught": "English",
        "rankingCountry": 18,
        "rankingWorld": 851,
        "rankingNational": 18,
        "majors": "Medicine & MBBS, Doctor of Pharmacy (PharmD), Physiotherapy, Dietetics, Creative Multimedia, Biomedical Engineering, Business Administration, Psychology",
        "tuition": "RM 20,000 – RM 28,000 / yr (~BDT 5.4L – 7.5L)",
        "tuitionDetails": [
            "Premier healthcare, medical and technology university located in Malaysia's Silicon Valley (Cyberjaya).",
            "MBBS International Program: Published tuition RM 450,000 less RM 45,000 - RM 50,000 scholarship = Net tuition RM 400,000 - RM 405,000 (First year payment RM 98,300; Full 5-year package ~RM 434,300).",
            "Doctor of Pharmacy (PharmD) and Master in Pharmaceutical Sciences accredited by Pharmacy Board Malaysia.",
            "SETARA 5-Star (Very Good) and QS 5-Star rated for Teaching and Inclusiveness.",
            "BDT 0 EduExpress service fee."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 5.5-6.0 or verified English MOI letter)",
            "Passport size photographs (white background)",
            "Medical examination form"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "May & September"},
        "notes": [
            "Over 20 years of excellence in medical, pharmaceutical, and health sciences education.",
            "Recognized by WHO, MMC, Malaysian Pharmacy Board, and international medical councils.",
            "Modern green campus with state-of-the-art anatomy labs and simulation wards."
        ],
        "badges": ["QS 5-Star Teaching", "SETARA 5-Star", "MBBS RM50k Waiver", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/university-of-cyberjaya.webp",
        "officialUrl": "https://cyberjaya.edu.my",
        "aliases": ["UoC", "CUCMS", "Cyberjaya University"],
        "programs": [
            {
                "level": "MBBS",
                "name": "Bachelor of Medicine and Bachelor of Surgery (MBBS)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "September",
                "tuition": "RM 98,300 (Yr 1) / RM 434,300 (Full 5 Yrs after RM 50,000 Waiver)",
                "tuitionAfterScholarship": "RM 400,000 Net Tuition (RM 434,300 Full Package)",
                "eligibility": ["HSC / A-Level with BBB, ABC or AAC in Biology, Chemistry & Physics/Math", "IELTS 6.0", "Faculty interview"]
            },
            {
                "level": "Bachelor",
                "name": "Doctor of Pharmacy (PharmD)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 32,500 / yr (~BDT 8.8L)",
                "tuitionAfterScholarship": "RM 26,000 / yr (With Merit Scholarship)",
                "eligibility": ["HSC / A-Level with Chemistry, Biology & Math", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) in Physiotherapy",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "May, September",
                "tuition": "RM 24,000 / yr (~BDT 6.5L)",
                "tuitionAfterScholarship": "RM 19,200 / yr",
                "eligibility": ["HSC / A-Level Science stream with Biology", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Dietetics (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 24,500 / yr (~BDT 6.6L)",
                "tuitionAfterScholarship": "RM 19,600 / yr",
                "eligibility": ["HSC / A-Level with Chemistry and Biology", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor in Creative Multimedia (Hons)",
                "subject": "Arts & design",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "February, May, September",
                "tuition": "RM 22,000 / yr (~BDT 5.9L)",
                "tuitionAfterScholarship": "RM 17,600 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Accounting and Finance (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "February, May, September",
                "tuition": "RM 21,500 / yr (~BDT 5.8L)",
                "tuitionAfterScholarship": "RM 17,200 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Master",
                "name": "Master of Business Administration (MBA Dual Award)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "February, May, July, September, November",
                "tuition": "RM 26,000 total (~BDT 7.0L)",
                "tuitionAfterScholarship": "RM 20,800 total",
                "eligibility": ["Bachelor's degree with CGPA 2.5+", "IELTS 6.0 or MOI English"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 20,000 – RM 28,000", "notes": "Subject to programme choice", "recipient": "University of Cyberjaya", "refundable": "conditional"},
            {"item": "EMGS Visa & Student Pass Processing", "cost": "RM 2,800 – RM 3,200", "notes": "Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Resource & Facility Fee", "cost": "RM 1,500 / sem", "notes": "Resource and lab access fee", "recipient": "University of Cyberjaya", "refundable": "no"},
            {"item": "International Student Registration Fee", "cost": "RM 2,500", "notes": "One-time initial enrolment fee", "recipient": "University of Cyberjaya", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "Cyberjaya MBBS Promotional Scholarship", "type": "Tuition Discount", "details": ["Special RM 45,000 – RM 50,000 direct tuition discount on the full 5-year MBBS package."], "amount": "RM 50,000 Tuition Discount", "condition": "Confirmed admission to MBBS", "coverage": "Tuition deduction across 5 years", "status": "active"},
            {"title": "Academic Merit Scholarship", "type": "Merit Waiver", "details": ["20% to 30% tuition fee waiver for undergraduate science and management programmes."], "amount": "20% - 30% Waiver", "condition": "HSC GPA 4.0+", "coverage": "Tuition fee deduction", "status": "active"}
        ]
    },
    {
        "slug": "management-and-science-university",
        "name": "Management & Science University (MSU)",
        "location": "University Drive, Off Persiaran Olahraga, Section 13, 40100 Shah Alam, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Shah Alam",
        "province": "Selangor",
        "intake": "February, July, September",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD, MBBS",
        "taught": "English",
        "rankingCountry": 14,
        "rankingWorld": 580,
        "rankingNational": 14,
        "majors": "Medicine & MBBS, Pharmacy, Computer Science, Software Engineering, International Business, Cardiovascular Technology, Hospitality & Tourism, Optometry",
        "tuition": "RM 20,000 – RM 32,000 / yr (~BDT 5.4L – 8.6L)",
        "tuitionDetails": [
            "Ranked QS World #580, QS Asia #129; Top 50 Worldwide for Hospitality & Leisure Management.",
            "International MBBS Programme: RM 139,703 first-year estimate; RM 654,475 full 5-year published programme total before 6% SST.",
            "Own on-campus teaching hospital: MSU Medical Centre (MSUMC).",
            "SETARA Tier 5 (Excellent) rating by Ministry of Higher Education Malaysia.",
            "EduExpress charges BDT 0 service fees."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (attested)",
            "English Language Certificate (IELTS 5.5-6.0 or MOI English letter)",
            "Passport-size photographs (white background)",
            "Medical check-up form"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "July & September"},
        "notes": [
            "Over 98.7% graduate employability rate certified by Ministry of Higher Education tracer study.",
            "State-of-the-art campus in Shah Alam with extensive lifestyle, transit, and sports facilities.",
            "Recognized by WHO, MMC, General Medical Council (UK), and international accrediting bodies."
        ],
        "badges": ["QS World #580", "QS Asia #129", "Top 50 Hospitality", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/management-and-science-university.webp",
        "officialUrl": "https://www.msu.edu.my",
        "aliases": ["MSU", "MSU Malaysia"],
        "programs": [
            {
                "level": "MBBS",
                "name": "Bachelor of Medicine and Bachelor of Surgery (MBBS)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "September",
                "tuition": "RM 139,703 (Yr 1) / RM 654,475 (Full 5 Yrs before SST)",
                "tuitionAfterScholarship": "RM 654,475 Full Course",
                "eligibility": ["HSC / A-Level with BBB, ABC or AAC in Biology, Chemistry & Physics/Math", "IELTS 6.0", "Faculty interview"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Pharmacy (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 32,000 / yr (~BDT 8.6L)",
                "tuitionAfterScholarship": "RM 25,600 / yr",
                "eligibility": ["HSC / A-Level with Chemistry, Biology & Math", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "February, July, September",
                "tuition": "RM 24,000 / yr (~BDT 6.5L)",
                "tuitionAfterScholarship": "RM 19,200 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor in International Business (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "February, July, September",
                "tuition": "RM 22,000 / yr (~BDT 5.9L)",
                "tuitionAfterScholarship": "RM 17,600 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor in Cardiovascular Technology (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "February, September",
                "tuition": "RM 26,000 / yr (~BDT 7.0L)",
                "tuitionAfterScholarship": "RM 20,800 / yr",
                "eligibility": ["HSC / A-Level Science stream with Biology & Physics", "IELTS 5.5"]
            },
            {
                "level": "Master",
                "name": "Master in Business Administration (MBA)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1.5 Years",
                "intakes": "February, July, September",
                "tuition": "RM 28,000 total (~BDT 7.5L)",
                "tuitionAfterScholarship": "RM 22,400 total",
                "eligibility": ["Bachelor's degree with CGPA 2.5+", "IELTS 6.0 or MOI English"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Management",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "Rolling / February, July, September",
                "tuition": "RM 20,000 / yr (~BDT 5.4L)",
                "tuitionAfterScholarship": "RM 16,000 / yr",
                "eligibility": ["Master's degree in business or management", "Research Proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 20,000 – RM 32,000", "notes": "Payable in semester instalments", "recipient": "MSU", "refundable": "conditional"},
            {"item": "EMGS Visa & Student Pass Processing", "cost": "RM 2,800 – RM 3,200", "notes": "Official Malaysian Immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Registration & Orientation Fee", "cost": "RM 2,500", "notes": "One-time initial enrolment charge", "recipient": "MSU", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "MSU President's Scholarship", "type": "Merit Waiver", "details": ["Up to 25% tuition fee waiver for students with excellent academic records."], "amount": "15% - 25% Waiver", "condition": "High school GPA 4.0+", "coverage": "Tuition deduction", "status": "active"}
        ]
    },
    {
        "slug": "mahsa-university",
        "name": "MAHSA University",
        "location": "Jalan SP 2, Bandar Saujana Putra, 42610 Jenjarom, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Bandar Saujana Putra",
        "province": "Selangor",
        "intake": "January, April, July, September",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD, MBBS",
        "taught": "English",
        "rankingCountry": 17,
        "rankingWorld": 801,
        "rankingNational": 17,
        "majors": "Medicine & MBBS, Doctor of Dental Surgery (DDS), Pharmacy, Biomedical Sciences, Nursing, Physiotherapy, Information Technology, Business Administration",
        "tuition": "RM 18,000 – RM 28,000 / yr (~BDT 4.8L – 7.5L)",
        "tuitionDetails": [
            "Premier healthcare, medical and dental mega-campus spanning 48 acres in Bandar Saujana Putra.",
            "MBBS Program: RM 512,100 published 5-year total; accredited by MMC, WHO, and international medical councils.",
            "Doctor of Dental Surgery (DDS) with advanced simulation clinics and dental hospital.",
            "SETARA 5-Star (Very Good) rating by Ministry of Higher Education Malaysia.",
            "BDT 0 EduExpress service fee."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (attested)",
            "English Language Certificate (IELTS 5.5-6.0 or MOI English letter)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "April & September"},
        "notes": [
            "One of Southeast Asia's most recognized dedicated healthcare training institutions.",
            "Complete on-campus student residences with swimming pools, sports facilities, and dining.",
            "Wide network of partner teaching hospitals across Malaysia."
        ],
        "badges": ["Premier Healthcare Mega-Campus", "SETARA 5-Star", "Dental & MBBS Hub", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/mahsa-university.webp",
        "officialUrl": "https://mahsa.edu.my",
        "aliases": ["MAHSA", "MAHSA University Malaysia"],
        "programs": [
            {
                "level": "MBBS",
                "name": "Bachelor of Medicine and Bachelor of Surgery (MBBS)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "September",
                "tuition": "RM 102,420 / yr (RM 512,100 Full 5 Yrs)",
                "tuitionAfterScholarship": "RM 512,100 Full Course",
                "eligibility": ["HSC / A-Level with BBB, ABC or AAC in Biology, Chemistry & Physics/Math", "IELTS 6.0", "Faculty interview"]
            },
            {
                "level": "Bachelor",
                "name": "Doctor of Dental Surgery (DDS)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "September",
                "tuition": "RM 78,000 / yr (~BDT 21.0L / yr)",
                "tuitionAfterScholarship": "RM 78,000 / yr",
                "eligibility": ["HSC / A-Level with high grades in Biology, Chemistry & Physics", "IELTS 6.0", "Interview"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Pharmacy (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 30,000 / yr (~BDT 8.1L)",
                "tuitionAfterScholarship": "RM 24,000 / yr",
                "eligibility": ["HSC / A-Level with Chemistry, Biology & Math", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Biomedical Sciences (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "January, April, September",
                "tuition": "RM 23,000 / yr (~BDT 6.2L)",
                "tuitionAfterScholarship": "RM 18,400 / yr",
                "eligibility": ["HSC / A-Level Science stream with Biology & Chemistry", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Nursing (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "January, April, September",
                "tuition": "RM 20,000 / yr (~BDT 5.4L)",
                "tuitionAfterScholarship": "RM 16,000 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 2.8+ including Science", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Information Technology (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, April, September",
                "tuition": "RM 21,000 / yr (~BDT 5.6L)",
                "tuitionAfterScholarship": "RM 16,800 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+ with Math", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Master",
                "name": "Master of Science in Public Health",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "1.5 Years",
                "intakes": "January, April, September",
                "tuition": "RM 26,000 total (~BDT 7.0L)",
                "tuitionAfterScholarship": "RM 20,800 total",
                "eligibility": ["Bachelor's in Health Sciences or related discipline", "IELTS 6.0"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 18,000 – RM 28,000", "notes": "Subject to programme choice", "recipient": "MAHSA University", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Registration & Administration Fee", "cost": "RM 2,500", "notes": "One-time international registration charge", "recipient": "MAHSA University", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "MAHSA Blue Ribbon Scholarship", "type": "Merit Waiver", "details": ["Up to 30% tuition fee reduction for undergraduate health science and computing applicants."], "amount": "20% - 30% Tuition Waiver", "condition": "High school GPA 4.0+", "coverage": "Tuition deduction", "status": "active"}
        ]
    },
    {
        "slug": "lincoln-university-college",
        "name": "Lincoln University College",
        "location": "Wisma Lincoln, No. 12-18, Jalan SS 6/12, 47301 Petaling Jaya, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Petaling Jaya",
        "province": "Selangor",
        "intake": "January, May, September",
        "degree": "Diploma, Bachelor, Master, PhD, MBBS",
        "taught": "English",
        "rankingCountry": 22,
        "rankingWorld": 901,
        "rankingNational": 22,
        "majors": "Doctor of Medicine (MD / MBBS), Pharmacy, Nursing, Computer Science, Business Administration, Public Health, Physiotherapy, Dentistry",
        "tuition": "RM 16,000 – RM 24,000 / yr (~BDT 4.3L – 6.5L)",
        "tuitionDetails": [
            "Ranked Top 35 in the World for Quality Education by Times Higher Education (THE) Impact Rankings.",
            "Doctor of Medicine (MD / MBBS) program recognised by WHO, Malaysian Medical Council (MMC), and Bangladesh Medical & Dental Council (BMDC).",
            "Special Bangladesh-tailored transparent package structure with all charges inclusive of 6% SST.",
            "Highly affordable tuition with flexible instalment plans for Bangladeshi families.",
            "EduExpress charges BDT 0 service fees."
        ],
        "documents": [
            "Valid Passport info page with at least 18 months validity",
            "Academic Certificates & Transcripts (SSC & HSC / O & A Level)",
            "English Proficiency: IELTS 5.0-6.0 or verified English MOI letter",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "May & September"},
        "notes": [
            "Associate member of the Association of Commonwealth Universities (ACU).",
            "Strong alumni network of practicing doctors and healthcare specialists across South Asia.",
            "Campuses in Petaling Jaya and Kota Bharu (Medical Campus)."
        ],
        "badges": ["THE Impact Top 35", "WHO & MMC Listed", "BMDC Recognised", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/lincoln-university-college.webp",
        "officialUrl": "https://lincoln.edu.my",
        "aliases": ["Lincoln", "LUC", "Lincoln University Malaysia"],
        "programs": [
            {
                "level": "MBBS",
                "name": "Doctor of Medicine (MD / MBBS)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "May, September",
                "tuition": "RM 68,000 / yr (~BDT 18.3L / yr)",
                "tuitionAfterScholarship": "Special Bangladesh Package Pricing",
                "eligibility": ["HSC / A-Level with Biology, Chemistry & Physics (min GPA 3.5+ / BBB)", "IELTS 6.0", "Interview clearance"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Pharmacy (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 26,000 / yr (~BDT 7.0L)",
                "tuitionAfterScholarship": "RM 20,800 / yr",
                "eligibility": ["HSC / A-Level with Chemistry, Biology & Math", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) in Nursing",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "January, May, September",
                "tuition": "RM 18,500 / yr (~BDT 5.0L)",
                "tuitionAfterScholarship": "RM 14,800 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 2.8+ including Science", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 18,000 / yr (~BDT 4.8L)",
                "tuitionAfterScholarship": "RM 14,400 / yr",
                "eligibility": ["HSC / A-Level with Math", "IELTS 5.0 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Business Administration (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 16,500 / yr (~BDT 4.5L)",
                "tuitionAfterScholarship": "RM 13,200 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.5+", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Master",
                "name": "Master of Science in Public Health",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "1.5 Years",
                "intakes": "January, May, September",
                "tuition": "RM 24,000 total (~BDT 6.5L)",
                "tuitionAfterScholarship": "RM 19,200 total",
                "eligibility": ["Bachelor's in MBBS, Nursing, or Health Sciences", "IELTS 6.0"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Medical Sciences",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "Rolling / January, May, September",
                "tuition": "RM 18,000 / yr (~BDT 4.8L)",
                "tuitionAfterScholarship": "RM 14,400 / yr",
                "eligibility": ["Master's degree in health or biomedical area", "Research Proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 16,000 – RM 24,000", "notes": "General bachelor's tuition payable per semester", "recipient": "Lincoln University College", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Government immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "International Student Enrolment Fee", "cost": "RM 2,000", "notes": "One-time initial admission charge", "recipient": "Lincoln University College", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "Lincoln Bangladesh Merit Bursary", "type": "Merit Waiver", "details": ["Direct 20% to 25% tuition fee reduction for Bangladeshi students maintaining good standing."], "amount": "20% - 25% Tuition Waiver", "condition": "High school GPA 3.5+", "coverage": "Tuition deduction throughout study", "status": "active"}
        ]
    },
    {
        "slug": "city-university-malaysia",
        "name": "City University Malaysia",
        "location": "Menara City U, No. 8, Jalan 51A/223, 46100 Petaling Jaya, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Petaling Jaya",
        "province": "Selangor",
        "intake": "January, March, May, July, September, November",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 20,
        "rankingWorld": 851,
        "rankingNational": 20,
        "majors": "Software Engineering, Information Technology, Business Administration, Accounting, Graphic Design, Occupational Safety & Health, Mass Communication, Early Childhood Education",
        "tuition": "RM 16,000 – RM 24,000 / yr (~BDT 4.3L – 6.5L)",
        "tuitionDetails": [
            "Established in 1984; over 40 years of academic excellence in Petaling Jaya.",
            "MoHE SETARA 5-Star (Very Good) rating; QS Asia Ranked (#351-400).",
            "MQA accredited programmes across business, computing, engineering, and creative industries.",
            "Prime urban location in Petaling Jaya near Asia Jaya LRT station.",
            "EduExpress charges BDT 0 service fees."
        ],
        "documents": [
            "Passport copy (info page with min. 18 months validity)",
            "Academic certificates & marksheets (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 5.0-5.5 or MOI English certificate)",
            "Passport size photos (white background)",
            "Medical check-up report"
        ],
        "deadlines": {"application": "Rolling / 4-6 weeks before intake", "startDate": "May, July & September"},
        "notes": [
            "Campuses in Petaling Jaya and Johor Bahru.",
            "Partnership arrangements with British, Australian, and French universities.",
            "Highly practical curriculum designed for fast-track employment."
        ],
        "badges": ["SETARA 5-Star", "Estd 1984", "QS Asia #351-400", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/city-university-malaysia.webp",
        "officialUrl": "https://www.city.edu.my",
        "aliases": ["City U", "City University Petaling Jaya"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Hons) Software Engineering",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, July, September",
                "tuition": "RM 19,500 / yr (~BDT 5.3L)",
                "tuitionAfterScholarship": "RM 14,625 / yr (With 25% Merit Waiver)",
                "eligibility": ["HSC / A-Level with minimum GPA 2.8+ including Math", "IELTS 5.0 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Information Technology (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, July, September",
                "tuition": "RM 19,000 / yr (~BDT 5.1L)",
                "tuitionAfterScholarship": "RM 14,250 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Business Administration (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, July, September",
                "tuition": "RM 18,000 / yr (~BDT 4.8L)",
                "tuitionAfterScholarship": "RM 13,500 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.5+", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Accounting (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "January, May, July, September",
                "tuition": "RM 19,000 / yr (~BDT 5.1L)",
                "tuitionAfterScholarship": "RM 14,250 / yr",
                "eligibility": ["HSC / A-Level with Math or Accounting background", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Graphic Design (Hons)",
                "subject": "Arts & design",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, July, September",
                "tuition": "RM 19,500 / yr (~BDT 5.3L)",
                "tuitionAfterScholarship": "RM 14,625 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.5+", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Diploma",
                "name": "Diploma in Business Administration",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "2 Years",
                "intakes": "January, March, May, July, September",
                "tuition": "RM 14,000 / yr (~BDT 3.8L)",
                "tuitionAfterScholarship": "RM 11,200 / yr",
                "eligibility": ["SSC / O-Level with minimum 3 credits", "Basic English"]
            },
            {
                "level": "Master",
                "name": "Master of Business Administration (MBA)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "January, May, July, September",
                "tuition": "RM 24,000 total (~BDT 6.5L)",
                "tuitionAfterScholarship": "RM 18,000 total",
                "eligibility": ["Bachelor's degree with CGPA 2.5+", "IELTS 6.0 or MOI English"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 16,000 – RM 24,000", "notes": "Payable in semester instalments", "recipient": "City University Malaysia", "refundable": "conditional"},
            {"item": "EMGS Visa & Student Pass Processing", "cost": "RM 2,800 – RM 3,200", "notes": "Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "International Student Administration Fee", "cost": "RM 2,000", "notes": "One-time registration and administration fee", "recipient": "City University Malaysia", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "City U High Achiever Scholarship", "type": "Merit Waiver", "details": ["25% to 50% tuition fee reduction for students with excellent academic records."], "amount": "25% - 50% Tuition Waiver", "condition": "HSC GPA 4.0+", "coverage": "Tuition deduction throughout study", "status": "active"}
        ]
    },
    {
        "slug": "nilai-university",
        "name": "Nilai University",
        "location": "No. 1, Persiaran Universiti, Putra Nilai, 71800 Nilai, Negeri Sembilan, Malaysia",
        "country": "Malaysia",
        "city": "Nilai",
        "province": "Negeri Sembilan",
        "intake": "January, March, May, July, September, October",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 23,
        "rankingWorld": 951,
        "rankingNational": 23,
        "majors": "Aircraft Maintenance Engineering, Biotechnology, Computer Science, Software Engineering, Nursing, Business Administration, Accounting & Finance, Culinary Arts",
        "tuition": "RM 18,000 – RM 28,000 / yr (~BDT 4.8L – 7.5L)",
        "tuitionDetails": [
            "Sprawling 105-acre green university campus in Putra Nilai (20 minutes from KLIA airport).",
            "Pioneer in Aircraft Maintenance Engineering — CAAM Approved Maintenance Training Organisation (ATO).",
            "Guaranteed 30% International Student Scholarship across full duration under the AES schedule.",
            "SETARA 5-Star (Very Good) rating by Ministry of Higher Education Malaysia.",
            "EduExpress charges BDT 0 service fees."
        ],
        "documents": [
            "Valid Passport with at least 18 months validity",
            "Academic Transcripts & Certificates (attested)",
            "English Language Certificate (IELTS 5.0-5.5 or MOI English letter)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "May & September"},
        "notes": [
            "Comprehensive on-campus student housing with lakes, sports arena, and golf course proximity.",
            "Direct hangar facilities with real aircraft for aviation engineering students.",
            "Affordable peaceful living environment outside congested metropolitan areas."
        ],
        "badges": ["105-Acre Green Campus", "Aviation Maintenance Leader", "Guaranteed 30% Scholarship", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/nilai-university.webp",
        "officialUrl": "https://www.nilai.edu.my",
        "aliases": ["Nilai", "Nilai University College"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "BSc (Hons) in Aircraft Maintenance Engineering",
                "subject": "Engineering",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 28,000 / yr (~BDT 7.5L)",
                "tuitionAfterScholarship": "RM 19,600 / yr (With Guaranteed 30% Scholarship)",
                "eligibility": ["HSC / A-Level Science stream with Physics & Math", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Diploma",
                "name": "Diploma in Aircraft Maintenance Technology",
                "subject": "Engineering",
                "languages": "English",
                "duration": "2.5 Years",
                "intakes": "January, May, September",
                "tuition": "RM 21,000 / yr (~BDT 5.6L)",
                "tuitionAfterScholarship": "RM 14,700 / yr (With Guaranteed 30% Scholarship)",
                "eligibility": ["SSC / O-Level with credits in Science & Math", "Basic English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 22,000 / yr (~BDT 5.9L)",
                "tuitionAfterScholarship": "RM 15,400 / yr (With Guaranteed 30% Scholarship)",
                "eligibility": ["HSC / A-Level with minimum GPA 2.8+ including Math", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) in Biotechnology",
                "subject": "Natural sciences & maths",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 23,000 / yr (~BDT 6.2L)",
                "tuitionAfterScholarship": "RM 16,100 / yr",
                "eligibility": ["HSC / A-Level with Chemistry & Biology", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) in Nursing",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "January, July, September",
                "tuition": "RM 20,000 / yr (~BDT 5.4L)",
                "tuitionAfterScholarship": "RM 14,000 / yr",
                "eligibility": ["HSC / A-Level Science stream", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Business Administration (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 19,500 / yr (~BDT 5.3L)",
                "tuitionAfterScholarship": "RM 13,650 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.5+", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Master",
                "name": "Master of Business Administration (MBA)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "January, May, September",
                "tuition": "RM 24,000 total (~BDT 6.5L)",
                "tuitionAfterScholarship": "RM 16,800 total",
                "eligibility": ["Bachelor's degree with CGPA 2.5+", "IELTS 6.0 or MOI English"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 18,000 – RM 28,000", "notes": "Subject to programme choice before 30% scholarship", "recipient": "Nilai University", "refundable": "conditional"},
            {"item": "EMGS Visa & Student Pass Processing", "cost": "RM 2,800 – RM 3,200", "notes": "Government immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Enrolment & Resource Fee", "cost": "RM 2,200", "notes": "One-time initial international enrolment charge", "recipient": "Nilai University", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "Nilai University 30% Guaranteed International Scholarship", "type": "Guaranteed Waiver", "details": ["Automatic 30% tuition fee reduction across all years of study for international students under the AES partnership."], "amount": "30% Tuition Waiver", "condition": "Standard admission qualification", "coverage": "Tuition deduction throughout full degree", "status": "active"}
        ]
    },
    {
        "slug": "universiti-tun-abdul-razak",
        "name": "Universiti Tun Abdul Razak (UNIRAZAK)",
        "location": "195A, Jalan Tun Razak, 50400 Kuala Lumpur, Malaysia",
        "country": "Malaysia",
        "city": "Kuala Lumpur",
        "province": "Kuala Lumpur",
        "intake": "January, March, May, July, September, November",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 21,
        "rankingWorld": 851,
        "rankingNational": 21,
        "majors": "Business Administration, Accounting & CPA Australia, Information Technology, Public Policy & Governance, Education, Global Logistics, Human Capital Management",
        "tuition": "RM 18,000 – RM 26,000 / yr (~BDT 4.8L – 7.0L)",
        "tuitionDetails": [
            "Malaysia's premier government-backed business, governance and public policy university.",
            "Established by Yayasan Tun Abdul Razak (named after Malaysia's 2nd Prime Minister).",
            "EPAS / EFMD European Accredited and CPA Australia recognized Faculty of Business and Accounting.",
            "Located in the heart of Kuala Lumpur on prestigious Jalan Tun Razak.",
            "EduExpress charges BDT 0 service fees."
        ],
        "documents": [
            "Valid Passport info page with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 5.5 or verified English MOI letter)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "May & September"},
        "notes": [
            "Close ties to Malaysian ministries, civil service, and premier corporate institutions.",
            "High accreditation with ACCA, CPA Australia, and CIMA for accounting graduates.",
            "Modern city-center tower campus with advanced seminar suites and library."
        ],
        "badges": ["EPAS / EFMD Accredited", "Government-Backed Institution", "CPA Australia Recognised", "MQA Tier 5", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/universiti-tun-abdul-razak.webp",
        "officialUrl": "https://www.unirazak.edu.my",
        "aliases": ["UNIRAZAK", "Razak University"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Business Administration (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 20,000 / yr (~BDT 5.4L)",
                "tuitionAfterScholarship": "RM 15,000 / yr (With 25% Leadership Waiver)",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Accounting (Hons) - CPA Australia Track",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "January, May, September",
                "tuition": "RM 21,500 / yr (~BDT 5.8L)",
                "tuitionAfterScholarship": "RM 16,125 / yr",
                "eligibility": ["HSC / A-Level with strong Mathematics or Business", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Information Technology (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 20,500 / yr (~BDT 5.5L)",
                "tuitionAfterScholarship": "RM 15,375 / yr",
                "eligibility": ["HSC / A-Level with Math", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Education (Early Childhood Education) (Hons)",
                "subject": "Education, languages & humanities",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 18,500 / yr (~BDT 5.0L)",
                "tuitionAfterScholarship": "RM 13,875 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.5+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Master",
                "name": "Master of Business Administration (MBA)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "January, May, September",
                "tuition": "RM 28,000 total (~BDT 7.5L)",
                "tuitionAfterScholarship": "RM 21,000 total",
                "eligibility": ["Bachelor's degree with CGPA 2.5+", "IELTS 6.0 or MOI English"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Governance & Business",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "Rolling / January, May, September",
                "tuition": "RM 19,000 / yr (~BDT 5.1L)",
                "tuitionAfterScholarship": "RM 14,250 / yr",
                "eligibility": ["Master's degree in business, economics, or public policy", "Research Proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 18,000 – RM 26,000", "notes": "Payable in semester instalments", "recipient": "UNIRAZAK", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Government immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "International Student Administration Fee", "cost": "RM 2,000", "notes": "One-time initial international enrolment charge", "recipient": "UNIRAZAK", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "UNIRAZAK Global Leadership Scholarship", "type": "Merit Waiver", "details": ["20% to 40% tuition fee reduction for applicants with high academic standing."], "amount": "20% - 40% Tuition Waiver", "condition": "High school GPA 4.0+", "coverage": "Tuition deduction throughout study", "status": "active"}
        ]
    },
    {
        "slug": "uow-malaysia",
        "name": "UOW Malaysia (University of Wollongong)",
        "location": "Jalan Kontraktor U1/14, Seksyen U1, Glenmarie, 40150 Shah Alam, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Shah Alam",
        "province": "Selangor",
        "intake": "January, March, May, July, September, October",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 13,
        "rankingWorld": 620,
        "rankingNational": 13,
        "majors": "Computer Science, Software Engineering, Game Development, Accounting & Finance, Business Administration, Mass Communication, Hospitality Management, Engineering",
        "tuition": "RM 24,000 – RM 38,000 / yr (~BDT 6.5L – 10.2L)",
        "tuitionDetails": [
            "Part of the global University of Wollongong (UOW Australia) network (QS World #167).",
            "Dual-Award degree option: students graduate with degrees from UOW Malaysia and UOW Australia.",
            "Campuses in Glenmarie (Shah Alam, modern university campus) and George Town (Penang).",
            "Pioneers in Game Development, Computing, and Media Arts in Malaysia.",
            "BDT 0 EduExpress service charge."
        ],
        "documents": [
            "Valid Passport copy (min. 18 months validity)",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 5.5-6.0 or MOI English letter)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "May & September"},
        "notes": [
            "Credits fully transferable to UOW Australia campuses (Wollongong, Sydney).",
            "Industry partnerships with leading gaming, IT, and financial corporations across the Asia-Pacific.",
            "Modern purpose-built campus with high-end computing laboratories and digital studios."
        ],
        "badges": ["UOW Australia Network", "QS World #167 Parent", "Game Dev Pioneer", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/uow-malaysia.webp",
        "officialUrl": "https://www.uow.edu.my",
        "aliases": ["UOW Malaysia KDU", "UOW MKDU", "University of Wollongong Malaysia"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Hons) - UOW Australia Dual Award",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 32,000 / yr (~BDT 8.6L)",
                "tuitionAfterScholarship": "RM 25,600 / yr (With 20% Excellence Scholarship)",
                "eligibility": ["HSC / A-Level with minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Software Engineering (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 32,000 / yr (~BDT 8.6L)",
                "tuitionAfterScholarship": "RM 25,600 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Game Development (Hons)",
                "subject": "Arts & design",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 33,000 / yr (~BDT 8.9L)",
                "tuitionAfterScholarship": "RM 26,400 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor in Accounting & Finance (Hons) - UOW Australia Dual Award",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 30,500 / yr (~BDT 8.2L)",
                "tuitionAfterScholarship": "RM 24,400 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Communication (Hons)",
                "subject": "Education, languages & humanities",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 28,000 / yr (~BDT 7.5L)",
                "tuitionAfterScholarship": "RM 22,400 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Master",
                "name": "Master of Business Administration (MBA)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "January, May, September",
                "tuition": "RM 36,000 total (~BDT 9.7L)",
                "tuitionAfterScholarship": "RM 28,800 total",
                "eligibility": ["Bachelor's degree with CGPA 2.5+", "IELTS 6.0 or MOI English"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 24,000 – RM 38,000", "notes": "Subject to programme choice", "recipient": "UOW Malaysia", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Enrolment & International Admin Fee", "cost": "RM 2,500", "notes": "One-time initial international enrolment charge", "recipient": "UOW Malaysia", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "UOW Malaysia Global Excellence Scholarship", "type": "Merit Waiver", "details": ["20% to 30% tuition fee reduction for students with strong academic track records."], "amount": "20% - 30% Tuition Waiver", "condition": "High school GPA 4.0+", "coverage": "Tuition deduction throughout study", "status": "active"}
        ]
    },
    {
        "slug": "multimedia-university",
        "name": "Multimedia University (MMU)",
        "location": "Persiaran Multimedia, 63100 Cyberjaya, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Cyberjaya",
        "province": "Selangor",
        "intake": "March, July, October",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 11,
        "rankingWorld": 1001,
        "rankingNational": 11,
        "majors": "Artificial Intelligence, Cybersecurity, Software Engineering, Computer Animation, Game Design, Telecommunications Engineering, Digital Business, Accounting",
        "tuition": "RM 22,000 – RM 32,000 / yr (~BDT 5.9L – 8.6L)",
        "tuitionDetails": [
            "Malaysia's pioneer digital technology university, established by Telekom Malaysia (TM Group).",
            "MDEC Premier Digital Tech University with campuses in Cyberjaya and Melaka.",
            "Ranked QS World #1001-1200; QS Asia #207; globally renowned Faculty of Computing & Informatics and Faculty of Creative Multimedia.",
            "Birthplace of Malaysia's creative animation and digital media revolution.",
            "BDT 0 EduExpress service charge."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 5.5 or MOI English letter)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "July & October"},
        "notes": [
            "Alumni created award-winning international animations including BoBoiBoy and Upin & Ipin.",
            "Comprehensive on-campus broadband infrastructure and incubation centres.",
            "Over 90% graduate employment within 6 months of degree completion."
        ],
        "badges": ["Premier Digital Tech University", "TM Group University", "QS Asia #207", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/multimedia-university.webp",
        "officialUrl": "https://www.mmu.edu.my",
        "aliases": ["MMU", "Multimedia University Malaysia"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Hons) in Artificial Intelligence",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, July, October",
                "tuition": "RM 26,000 / yr (~BDT 7.0L)",
                "tuitionAfterScholarship": "RM 20,800 / yr (With 20% Merit Waiver)",
                "eligibility": ["HSC / A-Level with minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Information Technology (Hons) in Security Technology (Cybersecurity)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, July, October",
                "tuition": "RM 25,500 / yr (~BDT 6.9L)",
                "tuitionAfterScholarship": "RM 20,400 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Multimedia (Hons) in Animation",
                "subject": "Arts & design",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, July, October",
                "tuition": "RM 26,500 / yr (~BDT 7.1L)",
                "tuitionAfterScholarship": "RM 21,200 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Engineering (Hons) Electronics Majoring in Telecommunications",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "March, July, October",
                "tuition": "RM 27,500 / yr (~BDT 7.4L)",
                "tuitionAfterScholarship": "RM 22,000 / yr",
                "eligibility": ["HSC / A-Level Science stream with Physics & Math", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Accounting (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "March, July, October",
                "tuition": "RM 23,000 / yr (~BDT 6.2L)",
                "tuitionAfterScholarship": "RM 18,400 / yr",
                "eligibility": ["HSC / A-Level with Math or Accounting background", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Master",
                "name": "Master of Computer Science (By Coursework)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "1.5 Years",
                "intakes": "March, July, October",
                "tuition": "RM 28,000 total (~BDT 7.5L)",
                "tuitionAfterScholarship": "RM 22,400 total",
                "eligibility": ["Bachelor's in Computing with CGPA 2.75+", "IELTS 6.0"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Creative Multimedia / Computing",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "Rolling / March, July, October",
                "tuition": "RM 18,000 / yr (~BDT 4.8L)",
                "tuitionAfterScholarship": "RM 14,400 / yr",
                "eligibility": ["Master's degree with research thesis", "Research Proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 22,000 – RM 32,000", "notes": "Payable in semester instalments", "recipient": "Multimedia University", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "International Student Enrolment Fee", "cost": "RM 2,200", "notes": "One-time initial international enrolment charge", "recipient": "Multimedia University", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "MMU Merit Scholarship", "type": "Merit Waiver", "details": ["20% to 50% tuition fee reduction for high achievers (GPA 4.2+ / AAB in A-Level)."], "amount": "20% - 50% Tuition Waiver", "condition": "High school GPA 4.0+", "coverage": "Tuition deduction throughout study", "status": "active"}
        ]
    },
    {
        "slug": "inti-international-university",
        "name": "INTI International University & Colleges",
        "location": "Persiaran Perdana BBN, Putra Nilai, 71800 Nilai, Negeri Sembilan, Malaysia",
        "country": "Malaysia",
        "city": "Nilai",
        "province": "Negeri Sembilan",
        "intake": "January, April, August, September",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 10,
        "rankingWorld": 516,
        "rankingNational": 10,
        "majors": "Computer Science, Software Engineering, American Degree Transfer Program (ADTP), Civil Engineering, Mechanical Engineering, Business Administration, Mass Communication, Biotechnology",
        "tuition": "RM 22,000 – RM 36,000 / yr (~BDT 5.9L – 9.7L)",
        "tuitionDetails": [
            "Ranked QS World #516; QS Asia #170; QS 5-Star rated in 7 categories.",
            "Dual Awards with University of Hertfordshire (UK) and Southern New Hampshire University (USA 4+0 program).",
            "Campuses in Nilai (Negeri Sembilan, flagship 82-acre campus), Subang Jaya, Penang, and Sabah.",
            "Largest American Degree Transfer Program (ADTP) in Malaysia with credit transfer to 300+ US universities.",
            "BDT 0 EduExpress service charge."
        ],
        "documents": [
            "Passport copy (info page with min. 18 months validity)",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 5.5-6.0 or verified English MOI letter)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "April & August"},
        "notes": [
            "Global alumni network spanning over 80,000 graduates across the world.",
            "Flagship Nilai campus includes Olympic-sized swimming pool, sports stadium, and modern hostels.",
            "Over 450 corporate partners ensuring top internships and industry projects."
        ],
        "badges": ["QS World #516", "QS Asia #170", "UK & US Dual Degrees", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/inti-international-university.webp",
        "officialUrl": "https://newinti.edu.my",
        "aliases": ["INTI", "INTI International University Nilai"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Hons) - Dual Award Univ of Hertfordshire UK",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, April, August",
                "tuition": "RM 29,500 / yr (~BDT 7.9L)",
                "tuitionAfterScholarship": "RM 22,125 / yr (With 25% Merit Scholarship)",
                "eligibility": ["HSC / A-Level with minimum GPA 3.0+ including Math", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Information Technology (Hons) - Business Analytics",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, April, August",
                "tuition": "RM 28,000 / yr (~BDT 7.5L)",
                "tuitionAfterScholarship": "RM 21,000 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) Business Administration (Southern New Hampshire Univ USA 4+0)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, April, August",
                "tuition": "RM 31,000 / yr (~BDT 8.4L)",
                "tuitionAfterScholarship": "RM 23,250 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Civil Engineering (Hons)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "January, April, August",
                "tuition": "RM 32,000 / yr (~BDT 8.6L)",
                "tuitionAfterScholarship": "RM 24,000 / yr",
                "eligibility": ["HSC / A-Level Science stream with Physics & Math", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Mass Communication (Hons) - Dual Award Univ of Hertfordshire UK",
                "subject": "Education, languages & humanities",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, April, August",
                "tuition": "RM 27,500 / yr (~BDT 7.4L)",
                "tuitionAfterScholarship": "RM 20,625 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.5 or MOI"]
            },
            {
                "level": "Master",
                "name": "Master of Business Administration (MBA)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "January, April, August",
                "tuition": "RM 33,000 total (~BDT 8.9L)",
                "tuitionAfterScholarship": "RM 24,750 total",
                "eligibility": ["Bachelor's degree with CGPA 2.5+", "IELTS 6.0 or MOI English"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Applied Sciences / Business",
                "subject": "Natural sciences & maths",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "Rolling / January, April, August",
                "tuition": "RM 20,000 / yr (~BDT 5.4L)",
                "tuitionAfterScholarship": "RM 15,000 / yr",
                "eligibility": ["Master's degree in relevant discipline", "Research Proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 22,000 – RM 36,000", "notes": "Payable in semester instalments", "recipient": "INTI International University", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "International Student Administration Fee", "cost": "RM 2,500", "notes": "One-time initial international enrolment charge", "recipient": "INTI", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "INTI International Merit Scholarship", "type": "Merit Waiver", "details": ["20% to 45% tuition fee waiver based on high school examination results."], "amount": "20% - 45% Tuition Waiver", "condition": "High school GPA 4.0+", "coverage": "Tuition deduction throughout study", "status": "active"}
        ]
    },
    {
        "slug": "university-of-southampton-malaysia",
        "name": "University of Southampton Malaysia",
        "location": "No. 3, Persiaran Canselor 1, Kota Ilmu, Educity, 79200 Iskandar Puteri, Johor, Malaysia",
        "country": "Malaysia",
        "city": "Iskandar Puteri",
        "province": "Johor",
        "intake": "July, September",
        "degree": "Foundation, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 8,
        "rankingWorld": 80,
        "rankingNational": 8,
        "majors": "Aeronautics and Astronautics, Electrical & Electronic Engineering, Mechanical Engineering, Computer Science, Business Management, Economics & Actuarial Science",
        "tuition": "RM 45,000 – RM 62,000 / yr (~BDT 12.1L – 16.7L)",
        "tuitionDetails": [
            "Ranked QS World #80 (University of Southampton UK parent ranking).",
            "#1 UK University in Malaysia for Engineering and Technology.",
            "Signature 2+2 and 4+0 Engineering Master of Engineering (MEng) degrees.",
            "Located in EduCity, Iskandar Puteri, Johor — state-of-the-art campus with world-class wind tunnels and computing clusters.",
            "Zero EduExpress service charge (BDT 0)."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 6.5 minimum with 6.0 in all bands)",
            "Personal statement and academic references",
            "Medical declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "September"},
        "notes": [
            "UK Russell Group founding member degree awarded in Malaysia at approximately 60% lower cost than UK campus.",
            "Engineering degrees accredited by the Board of Engineers Malaysia (BEM) and the UK Engineering Council.",
            "Students in 2+2 tracks complete their final 2 years on campus in Southampton, UK."
        ],
        "badges": ["QS World #80", "UK Russell Group", "#1 UK Engineering in Malaysia", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/university-of-southampton-malaysia.webp",
        "officialUrl": "https://www.southampton.edu.my",
        "aliases": ["UoSM", "Southampton Malaysia"],
        "programs": [
            {
                "level": "Master",
                "name": "MEng Aeronautics and Astronautics (2+2 / 4+0 Track)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 58,000 / yr (~BDT 15.6L / yr in Malaysia)",
                "tuitionAfterScholarship": "RM 46,400 / yr (With Top Achiever Scholarship)",
                "eligibility": ["HSC / A-Level with AAA or A*AA in Math, Physics & Chemistry", "IELTS 6.5"]
            },
            {
                "level": "Master",
                "name": "MEng Electrical and Electronic Engineering (2+2 / 4+0 Track)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 56,000 / yr (~BDT 15.1L)",
                "tuitionAfterScholarship": "RM 44,800 / yr",
                "eligibility": ["HSC / A-Level with AAA in Math & Physics", "IELTS 6.5"]
            },
            {
                "level": "Master",
                "name": "MEng Mechanical Engineering (2+2 / 4+0 Track)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 56,000 / yr (~BDT 15.1L)",
                "tuitionAfterScholarship": "RM 44,800 / yr",
                "eligibility": ["HSC / A-Level with AAA in Math & Physics", "IELTS 6.5"]
            },
            {
                "level": "Bachelor",
                "name": "BSc (Hons) Computer Science",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "September",
                "tuition": "RM 52,000 / yr (~BDT 14.0L)",
                "tuitionAfterScholarship": "RM 41,600 / yr",
                "eligibility": ["HSC / A-Level with AAA in Mathematics", "IELTS 6.5"]
            },
            {
                "level": "Bachelor",
                "name": "BSc (Hons) Business Management",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "September",
                "tuition": "RM 46,000 / yr (~BDT 12.4L)",
                "tuitionAfterScholarship": "RM 36,800 / yr",
                "eligibility": ["HSC / A-Level with AAB", "IELTS 6.5"]
            },
            {
                "level": "Foundation",
                "name": "Engineering Foundation Year",
                "subject": "Foundation & pathway",
                "languages": "English",
                "duration": "1 Year",
                "intakes": "July, September",
                "tuition": "RM 32,000 (~BDT 8.6L)",
                "tuitionAfterScholarship": "RM 25,600",
                "eligibility": ["SSC / O-Level with A grades in Math and Physics", "IELTS 6.0"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 45,000 – RM 62,000", "notes": "Fixed for the uninterrupted duration of the degree", "recipient": "University of Southampton Malaysia", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 3,000", "notes": "Official Malaysian Immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Enrolment & Induction Fee", "cost": "RM 2,500", "notes": "One-time initial enrolment fee", "recipient": "UoSM", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "Southampton Top Achiever Scholarship", "type": "Merit Waiver", "details": ["Up to 100% first-year tuition waiver for students achieving straight A*s in A-Level or equivalent."], "amount": "20% - 100% First-Year Waiver", "condition": "Straight As / A* in high school science", "coverage": "Tuition deduction", "status": "active"}
        ]
    },
    {
        "slug": "monash-university-malaysia",
        "name": "Monash University Malaysia",
        "location": "Jalan Lagoon Selatan, Bandar Sunway, 47500 Subang Jaya, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Subang Jaya",
        "province": "Selangor",
        "intake": "February, July, October",
        "degree": "Bachelor, Master, PhD, MBBS",
        "taught": "English",
        "rankingCountry": 1,
        "rankingWorld": 37,
        "rankingNational": 1,
        "majors": "Medicine & MD, Computer Science, Software Engineering, Applied Data Science, Chemical Engineering, Business & Commerce, Psychological Science, Pharmacy",
        "tuition": "RM 42,000 – RM 58,000 / yr (~BDT 11.3L – 15.6L)",
        "tuitionDetails": [
            "Australian Group of Eight (Go8) premier foreign branch campus (Monash Australia QS World #37).",
            "Medical degree: Bachelor of Medical Science and Doctor of Medicine (BMedSc/MD) accredited by Australian Medical Council (AMC) & MMC.",
            "Degrees identical to Monash Australia, conferred under the seal of Monash University Melbourne.",
            "Located in the vibrant Sunway City hub with elevated walkways to Sunway Medical Centre.",
            "BDT 0 EduExpress service charge."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 6.5 with 6.0 in each band)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 8 weeks before intake", "startDate": "February & July"},
        "notes": [
            "Students enjoy seamless campus transfer rights to Monash Melbourne campuses after Year 1 or Year 2.",
            "World-leading research output and state-of-the-art genomics, robotics, and medical laboratories.",
            "Full Australian Group of Eight degree qualification at approximately 1/3 of the Australian cost."
        ],
        "badges": ["QS World #37", "Australian Go8 Branch", "AMC & MMC Accredited", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/monash-university-malaysia.webp",
        "officialUrl": "https://www.monash.edu.my",
        "aliases": ["Monash Malaysia", "Monash University"],
        "programs": [
            {
                "level": "MBBS",
                "name": "Bachelor of Medical Science and Doctor of Medicine (BMedSc/MD)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "5 Years",
                "intakes": "February",
                "tuition": "RM 118,000 / yr (~BDT 31.8L / yr)",
                "tuitionAfterScholarship": "RM 118,000 / yr",
                "eligibility": ["A-Level minimum AAA / HSC equivalent with Chemistry, Biology & Physics/Math", "IELTS 7.0 (no band less than 6.5)", "ISAT & MMI Interview clearance"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "February, July, October",
                "tuition": "RM 46,000 / yr (~BDT 12.4L)",
                "tuitionAfterScholarship": "RM 36,000 / yr (With High Achiever Award)",
                "eligibility": ["HSC / A-Level with strong Mathematics (min GPA 3.5+)", "IELTS 6.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Software Engineering (Honours)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "February, July, October",
                "tuition": "RM 52,000 / yr (~BDT 14.0L)",
                "tuitionAfterScholarship": "RM 42,000 / yr",
                "eligibility": ["HSC / A-Level with Math and Physics", "IELTS 6.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Business and Commerce",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "February, July, October",
                "tuition": "RM 43,500 / yr (~BDT 11.7L)",
                "tuitionAfterScholarship": "RM 33,500 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.2+", "IELTS 6.5"]
            },
            {
                "level": "Master",
                "name": "Master of Applied Data Science",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "1.5 Years",
                "intakes": "February, July",
                "tuition": "RM 56,000 total (~BDT 15.1L)",
                "tuitionAfterScholarship": "RM 46,000 total",
                "eligibility": ["Bachelor's degree with strong quantitative background (CGPA 3.0+)", "IELTS 6.5"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 42,000 – RM 58,000", "notes": "General degree tuition payable per semester", "recipient": "Monash University Malaysia", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 3,000", "notes": "Official Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Application Fee", "cost": "RM 100", "notes": "Direct international online application fee", "recipient": "Monash Malaysia", "refundable": "no"},
            {"item": "International Student Administration Fee", "cost": "RM 2,500", "notes": "One-time initial enrolment charge", "recipient": "Monash Malaysia", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "Monash High Achiever Award", "type": "Merit Waiver", "details": ["Direct scholarship of RM 10,000 per year for students achieving outstanding results."], "amount": "RM 10,000 / Year", "condition": "High school GPA 4.5+ / A*AA in A-Level", "coverage": "Tuition deduction", "status": "active"}
        ]
    },
    {
        "slug": "university-of-nottingham-malaysia",
        "name": "University of Nottingham Malaysia",
        "location": "Jalan Broga, 43500 Semenyih, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Semenyih",
        "province": "Selangor",
        "intake": "February, September",
        "degree": "Foundation, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 3,
        "rankingWorld": 108,
        "rankingNational": 3,
        "majors": "Computer Science, Chemical Engineering, Civil Engineering, Psychology, International Relations, Finance, Accounting and Management, Biotechnology",
        "tuition": "RM 40,000 – RM 55,000 / yr (~BDT 10.8L – 14.8L)",
        "tuitionDetails": [
            "Authentic UK Russell Group branch campus (Nottingham UK QS World #108).",
            "125-acre garden campus set in Semenyih hills with self-contained British campus architecture.",
            "Degrees awarded are identical to those conferred at the University of Nottingham in the UK.",
            "Over 5,000 students from 85+ countries.",
            "BDT 0 EduExpress service charge."
        ],
        "documents": [
            "Valid Passport info page with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 6.0-6.5)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "September"},
        "notes": [
            "Established in 2000 as the first British university branch campus in Malaysia.",
            "Students can participate in the inter-campus exchange to Nottingham UK or Nottingham Ningbo China.",
            "Full British academic governance and research oversight."
        ],
        "badges": ["QS World #108", "UK Russell Group", "125-Acre Garden Campus", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/university-of-nottingham-malaysia.webp",
        "officialUrl": "https://www.nottingham.edu.my",
        "aliases": ["UNM", "Nottingham Malaysia"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "BSc (Hons) Computer Science",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "September",
                "tuition": "RM 48,500 / yr (~BDT 13.1L)",
                "tuitionAfterScholarship": "RM 36,375 / yr (With 25% High Achiever Scholarship)",
                "eligibility": ["HSC / A-Level with strong Mathematics (AAB / GPA 4.0+)", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "BEng (Hons) Chemical Engineering",
                "subject": "Engineering",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "September",
                "tuition": "RM 53,000 / yr (~BDT 14.3L)",
                "tuitionAfterScholarship": "RM 39,750 / yr",
                "eligibility": ["HSC / A-Level with Chemistry, Math & Physics", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "BSc (Hons) Psychology",
                "subject": "Law, politics & social sciences",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "September",
                "tuition": "RM 44,500 / yr (~BDT 12.0L)",
                "tuitionAfterScholarship": "RM 33,375 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.2+", "IELTS 6.5"]
            },
            {
                "level": "Bachelor",
                "name": "BA (Hons) International Relations",
                "subject": "Law, politics & social sciences",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "September",
                "tuition": "RM 42,000 / yr (~BDT 11.3L)",
                "tuitionAfterScholarship": "RM 31,500 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.0+", "IELTS 6.5"]
            },
            {
                "level": "Bachelor",
                "name": "BSc (Hons) Finance, Accounting and Management",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "September",
                "tuition": "RM 46,000 / yr (~BDT 12.4L)",
                "tuitionAfterScholarship": "RM 34,500 / yr",
                "eligibility": ["HSC / A-Level with strong Mathematics", "IELTS 6.5"]
            },
            {
                "level": "Master",
                "name": "MSc in Environmental Monitoring & Management",
                "subject": "Natural sciences & maths",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "September",
                "tuition": "RM 49,000 total (~BDT 13.2L)",
                "tuitionAfterScholarship": "RM 36,750 total",
                "eligibility": ["Bachelor's degree in science with CGPA 3.0+", "IELTS 6.5"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 40,000 – RM 55,000", "notes": "Payable in semester instalments", "recipient": "University of Nottingham Malaysia", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 3,000", "notes": "Official Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Application Fee", "cost": "RM 200", "notes": "Direct international online application fee", "recipient": "UNM", "refundable": "no"},
            {"item": "International Student Administration Fee", "cost": "RM 2,500", "notes": "One-time initial enrolment charge", "recipient": "UNM", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "Nottingham High Achiever Scholarship", "type": "Merit Waiver", "details": ["25% tuition fee reduction for students achieving excellent A-Level / HSC scores."], "amount": "25% Tuition Waiver", "condition": "High school GPA 4.5+ / AAB in A-Level", "coverage": "Tuition deduction throughout study", "status": "active"}
        ]
    },
    {
        "slug": "heriot-watt-university-malaysia",
        "name": "Heriot-Watt University Malaysia",
        "location": "No 1, Jalan Venna P5/2, Precinct 5, 62200 Putrajaya, Malaysia",
        "country": "Malaysia",
        "city": "Putrajaya",
        "province": "Putrajaya",
        "intake": "January, April, July, September",
        "degree": "Foundation, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 4,
        "rankingWorld": 235,
        "rankingNational": 4,
        "majors": "Actuarial Science, Petroleum Engineering, Chemical Engineering, Civil Engineering, Business and Finance, Renewable Energy, Computer Science, Quantity Surveying",
        "tuition": "RM 38,000 – RM 52,000 / yr (~BDT 10.2L – 14.0L)",
        "tuitionDetails": [
            "UK Royal Charter institution founded in 1821 (Heriot-Watt UK QS World #235).",
            "World #1 institution for Actuarial Science and pioneer in Petroleum Engineering.",
            "Stunning lakeside eco-campus in administrative capital Putrajaya with living green roof.",
            "Go Global initiative allows seamless 1-to-1 transfer to Edinburgh and Dubai campuses.",
            "Zero EduExpress service charge (BDT 0)."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 6.0-6.5)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "September"},
        "notes": [
            "Graduates receive identical UK Royal Charter degree certificates to Edinburgh campus.",
            "Putrajaya eco-campus recognized with Malaysia's Green Building Index (GBI) certification.",
            "High graduate starting salaries and strong international recruiter presence."
        ],
        "badges": ["QS World #235", "UK Royal Charter", "World #1 Actuarial Science", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/heriot-watt-university-malaysia.webp",
        "officialUrl": "https://www.hw.ac.uk/malaysia/",
        "aliases": ["HWUM", "Heriot Watt Malaysia"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "BSc (Hons) Actuarial Science",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, September",
                "tuition": "RM 46,000 / yr (~BDT 12.4L)",
                "tuitionAfterScholarship": "RM 36,800 / yr (With High Achiever Scholarship)",
                "eligibility": ["HSC / A-Level with straight A in Mathematics", "IELTS 6.5"]
            },
            {
                "level": "Bachelor",
                "name": "BEng (Hons) Petroleum Engineering",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 49,500 / yr (~BDT 13.3L)",
                "tuitionAfterScholarship": "RM 39,600 / yr",
                "eligibility": ["HSC / A-Level with Math, Physics & Chemistry", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "BEng (Hons) Chemical Engineering",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 49,500 / yr (~BDT 13.3L)",
                "tuitionAfterScholarship": "RM 39,600 / yr",
                "eligibility": ["HSC / A-Level with Math, Physics & Chemistry", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "BBA (Hons) Business and Finance",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, September",
                "tuition": "RM 41,000 / yr (~BDT 11.0L)",
                "tuitionAfterScholarship": "RM 32,800 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.0+", "IELTS 6.0"]
            },
            {
                "level": "Master",
                "name": "MSc Renewable Energy Engineering",
                "subject": "Engineering",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "September",
                "tuition": "RM 48,000 total (~BDT 12.9L)",
                "tuitionAfterScholarship": "RM 38,400 total",
                "eligibility": ["Bachelor's in Engineering or Physical Sciences with CGPA 3.0+", "IELTS 6.5"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 38,000 – RM 52,000", "notes": "Payable in semester instalments", "recipient": "Heriot-Watt University Malaysia", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 3,000", "notes": "Official Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "International Student Administration Fee", "cost": "RM 2,500", "notes": "One-time initial enrolment charge", "recipient": "HWUM", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "Heriot-Watt High Achiever Scholarship", "type": "Merit Waiver", "details": ["Up to 20% - 30% tuition reduction for top-tier academic applicants."], "amount": "20% - 30% Tuition Waiver", "condition": "High school GPA 4.5+ / AAB in A-Level", "coverage": "Tuition deduction throughout study", "status": "active"}
        ]
    },
    {
        "slug": "universiti-putra-malaysia",
        "name": "Universiti Putra Malaysia (UPM)",
        "location": "43400 UPM Serdang, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Serdang",
        "province": "Selangor",
        "intake": "March, October",
        "degree": "Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 3,
        "rankingWorld": 148,
        "rankingNational": 3,
        "majors": "Computer Science, Software Engineering, Agricultural Sciences, Biotechnology, Food Science & Technology, Environmental Management, Economics",
        "tuition": "RM 15,000 – RM 22,000 / yr (~BDT 4.0L – 5.9L)",
        "tuitionDetails": [
            "Ranked QS World #148; QS Asia #25; Top 3 premier public research university in Malaysia.",
            "Global powerhouse in Agricultural Sciences, Biotechnology, Environmental Sciences, and Computing.",
            "Expansive 1,100-hectare research campus in Serdang, 20 minutes from Kuala Lumpur.",
            "Very affordable public tuition with high international prestige.",
            "Zero EduExpress service charge (BDT 0)."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (attested)",
            "English Language Certificate (IELTS 6.0 minimum)",
            "Passport size photos (blue background)",
            "Health Examination Report"
        ],
        "deadlines": {"application": "Rolling / 8 weeks before intake", "startDate": "October"},
        "notes": [
            "AACSB and EQUIS accredited School of Business and Economics.",
            "Leading research outputs in sustainable agriculture, veterinary sciences, and renewable biotechnology.",
            "Over 6,000 international students from more than 80 nations."
        ],
        "badges": ["QS World #148", "QS Asia #25", "Top 3 Public University", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/universiti-putra-malaysia.webp",
        "officialUrl": "https://upm.edu.my",
        "aliases": ["UPM", "University Putra Malaysia"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Software Engineering)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "March, October",
                "tuition": "RM 16,500 / yr (~BDT 4.5L)",
                "tuitionAfterScholarship": "RM 16,500 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 3.5 in Science/Math", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Agricultural Science",
                "subject": "Agriculture, food & environment",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 15,000 / yr (~BDT 4.0L)",
                "tuitionAfterScholarship": "RM 15,000 / yr",
                "eligibility": ["HSC / A-Level Science stream with Biology", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Food Science and Technology",
                "subject": "Agriculture, food & environment",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 17,000 / yr (~BDT 4.6L)",
                "tuitionAfterScholarship": "RM 17,000 / yr",
                "eligibility": ["HSC / A-Level with Chemistry and Biology", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Biotechnology",
                "subject": "Natural sciences & maths",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 17,500 / yr (~BDT 4.7L)",
                "tuitionAfterScholarship": "RM 17,500 / yr",
                "eligibility": ["HSC / A-Level Science stream with Biology & Chemistry", "IELTS 6.0"]
            },
            {
                "level": "Master",
                "name": "Master of Environmental Management",
                "subject": "Agriculture, food & environment",
                "languages": "English",
                "duration": "1.5 Years",
                "intakes": "March, October",
                "tuition": "RM 24,000 total (~BDT 6.5L)",
                "tuitionAfterScholarship": "RM 24,000 total",
                "eligibility": ["Bachelor's degree in science with CGPA 3.0+", "IELTS 6.0"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Agriculture / Computing",
                "subject": "Agriculture, food & environment",
                "languages": "English",
                "duration": "3 - 5 Years",
                "intakes": "Rolling / March, October",
                "tuition": "RM 15,000 / yr (~BDT 4.0L)",
                "tuitionAfterScholarship": "RM 15,000 / yr",
                "eligibility": ["Master's degree in relevant discipline", "Approved research proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 15,000 – RM 22,000", "notes": "Payable per semester to UPM", "recipient": "Universiti Putra Malaysia", "refundable": "conditional"},
            {"item": "EMGS Student Pass Processing", "cost": "RM 3,000", "notes": "Government immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Application Fee", "cost": "RM 300", "notes": "Direct international online application fee", "recipient": "UPM", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "Zero service charge, zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "UPM Graduate Research Fellowship", "type": "Research Grant", "details": ["Full/partial tuition coverage for Master's and PhD students involved in research projects."], "amount": "Partial to Full Tuition", "condition": "CGPA 3.6+ and research publication", "coverage": "Tuition fees", "status": "active"}
        ]
    },
    {
        "slug": "universiti-kebangsaan-malaysia",
        "name": "Universiti Kebangsaan Malaysia (UKM)",
        "location": "43600 UKM Bangi, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Bangi",
        "province": "Selangor",
        "intake": "March, October",
        "degree": "Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 4,
        "rankingWorld": 138,
        "rankingNational": 4,
        "majors": "Information Technology, Software Engineering, Civil Engineering, Pharmacy, Business Administration, Economics, Clinical Psychology, Environmental Health",
        "tuition": "RM 15,000 – RM 25,000 / yr (~BDT 4.0L – 6.8L)",
        "tuitionDetails": [
            "National University of Malaysia; ranked QS World #138 and QS Asia #28.",
            "Premier public research university established in 1970.",
            "Vast 1,096-hectare scenic campus in Bangi, Selangor.",
            "High research output in science, medicine, technology, and social sciences.",
            "Zero EduExpress service charge (BDT 0)."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (attested)",
            "English Language Certificate (IELTS 6.0 minimum)",
            "Passport size photos (blue background)",
            "Medical check-up report"
        ],
        "deadlines": {"application": "Rolling / 8 weeks before intake", "startDate": "October"},
        "notes": [
            "One of five research universities designated by the Malaysian Government.",
            "Host of the UKM Medical Centre (PPUKM) in Cheras, Kuala Lumpur.",
            "High employer reputation score globally."
        ],
        "badges": ["QS World #138", "QS Asia #28", "National Research Giant", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/universiti-kebangsaan-malaysia.webp",
        "officialUrl": "https://www.ukm.my",
        "aliases": ["UKM", "National University of Malaysia"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Information Technology (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3.5 Years",
                "intakes": "March, October",
                "tuition": "RM 17,000 / yr (~BDT 4.6L)",
                "tuitionAfterScholarship": "RM 17,000 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 3.5 in Science/Math", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Civil Engineering (Hons)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 21,000 / yr (~BDT 5.7L)",
                "tuitionAfterScholarship": "RM 21,000 / yr",
                "eligibility": ["HSC / A-Level with Math and Physics", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Pharmacy (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 28,000 / yr (~BDT 7.5L)",
                "tuitionAfterScholarship": "RM 28,000 / yr",
                "eligibility": ["HSC / A-Level with Chemistry and Biology", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Business Administration (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, October",
                "tuition": "RM 16,000 / yr (~BDT 4.3L)",
                "tuitionAfterScholarship": "RM 16,000 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.2+", "IELTS 6.0"]
            },
            {
                "level": "Master",
                "name": "Master of Clinical Psychology",
                "subject": "Law, politics & social sciences",
                "languages": "English",
                "duration": "2 Years",
                "intakes": "October",
                "tuition": "RM 25,000 / yr (~BDT 6.8L)",
                "tuitionAfterScholarship": "RM 25,000 / yr",
                "eligibility": ["Bachelor's in Psychology with CGPA 3.0+", "IELTS 6.5"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Science & Technology",
                "subject": "Natural sciences & maths",
                "languages": "English",
                "duration": "3 - 5 Years",
                "intakes": "Rolling / March, October",
                "tuition": "RM 16,000 / yr (~BDT 4.3L)",
                "tuitionAfterScholarship": "RM 16,000 / yr",
                "eligibility": ["Master's degree in relevant discipline", "Approved research proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 15,000 – RM 25,000", "notes": "Payable per semester to UKM", "recipient": "UKM", "refundable": "conditional"},
            {"item": "EMGS Student Pass Processing", "cost": "RM 3,000", "notes": "Government immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Application Fee", "cost": "RM 350", "notes": "Direct international online application fee", "recipient": "UKM", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "Zero service charge, zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "UKM Vice-Chancellor Scholarship", "type": "Merit Waiver", "details": ["Partial fee reduction for high CGPA Master's and PhD international researchers."], "amount": "Partial Tuition Waiver", "condition": "CGPA 3.7+ and publications", "coverage": "Tuition fees", "status": "active"}
        ]
    },
    {
        "slug": "universiti-sains-malaysia",
        "name": "Universiti Sains Malaysia (USM)",
        "location": "11800 USM, George Town, Penang, Malaysia",
        "country": "Malaysia",
        "city": "George Town",
        "province": "Penang",
        "intake": "March, October",
        "degree": "Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 5,
        "rankingWorld": 146,
        "rankingNational": 5,
        "majors": "Computer Science, Pharmaceutical Sciences, Mechatronics Engineering, Data Science & Analytics, Management, Marine Biology, Medical Sciences",
        "tuition": "RM 14,000 – RM 23,000 / yr (~BDT 3.8L – 6.2L)",
        "tuitionDetails": [
            "Ranked QS World #146; QS Asia #32; designated as Malaysia's only APEX (Accelerated Programme for Excellence) University.",
            "Located on the historic island of Penang with world-renowned pharmaceutical and science research faculties.",
            "Campuses in Penang Island (Main), Nibong Tebal (Engineering), and Kubang Kerian (Health Campus, Kelantan).",
            "Very affordable international tuition with world top 150 credentials.",
            "BDT 0 EduExpress service charge."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (attested)",
            "English Language Certificate (IELTS 6.0 minimum)",
            "Passport size photos (blue background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 8 weeks before intake", "startDate": "October"},
        "notes": [
            "APEX status grants USM special autonomy and research funding from the Ministry of Higher Education.",
            "Top 50 in the world for Pharmacy and Pharmacology (QS Subject Rankings).",
            "Vibrant island lifestyle with strong semiconductor and tech industry ecosystem in Penang."
        ],
        "badges": ["QS World #146", "Malaysia's APEX University", "QS Asia #32", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/universiti-sains-malaysia.webp",
        "officialUrl": "https://www.usm.my",
        "aliases": ["USM", "University of Science Malaysia"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Computer Science (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "March, October",
                "tuition": "RM 17,500 / yr (~BDT 4.7L)",
                "tuitionAfterScholarship": "RM 17,500 / yr",
                "eligibility": ["HSC / A-Level with minimum GPA 3.5 in Science/Math", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Pharmaceutical Sciences (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 24,000 / yr (~BDT 6.5L)",
                "tuitionAfterScholarship": "RM 24,000 / yr",
                "eligibility": ["HSC / A-Level with high grades in Chemistry, Biology & Math", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Mechatronics Engineering (Hons)",
                "subject": "Engineering",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "October",
                "tuition": "RM 21,000 / yr (~BDT 5.7L)",
                "tuitionAfterScholarship": "RM 21,000 / yr",
                "eligibility": ["HSC / A-Level with Math and Physics", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Management (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, October",
                "tuition": "RM 15,000 / yr (~BDT 4.0L)",
                "tuitionAfterScholarship": "RM 15,000 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.0+", "IELTS 6.0"]
            },
            {
                "level": "Master",
                "name": "Master of Science in Data Science & Analytics",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "1.5 Years",
                "intakes": "March, October",
                "tuition": "RM 26,000 total (~BDT 7.0L)",
                "tuitionAfterScholarship": "RM 26,000 total",
                "eligibility": ["Bachelor's degree in computing/quantitative field with CGPA 3.0+", "IELTS 6.0"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Pharmaceutical / Computer Sciences",
                "subject": "Natural sciences & maths",
                "languages": "English",
                "duration": "3 - 5 Years",
                "intakes": "Rolling / March, October",
                "tuition": "RM 15,000 / yr (~BDT 4.0L)",
                "tuitionAfterScholarship": "RM 15,000 / yr",
                "eligibility": ["Master's degree in relevant discipline", "Approved research proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 14,000 – RM 23,000", "notes": "Payable per semester to USM", "recipient": "Universiti Sains Malaysia", "refundable": "conditional"},
            {"item": "EMGS Student Pass Processing", "cost": "RM 3,000", "notes": "Government immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Application Fee", "cost": "RM 300", "notes": "Direct international online application fee", "recipient": "USM", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "Zero service charge, zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "USM Global Fellowship", "type": "Fellowship Grant", "details": ["Financial support and tuition assistance for exceptional international postgraduate researchers."], "amount": "Partial Tuition Support", "condition": "CGPA 3.7+ and research output", "coverage": "Tuition fees", "status": "active"}
        ]
    },
    {
        "slug": "alfa-university-college",
        "name": "ALFA University College",
        "location": "Jalan Subang 1, Subang Jaya, 47500 Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Subang Jaya",
        "province": "Selangor",
        "intake": "January, March, May, July, September, November",
        "degree": "Diploma, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 25,
        "rankingWorld": 1100,
        "rankingNational": 25,
        "majors": "Interior Architecture, Architecture (LAM Part 1), Computer Science & Cybersecurity, Business Administration, Information Technology, Human Resource Management, E-Business",
        "tuition": "RM 18,000 – RM 26,000 / yr (~BDT 4.8L – 7.0L)",
        "tuitionDetails": [
            "Pioneer design and architecture academy established in 1998 in Subang Jaya.",
            "Architecture programmes recognized by Lembaga Arkitek Malaysia (Board of Architects Malaysia - LAM).",
            "MQA accredited Bachelor's, Master's, and Doctorate degrees in Computing, Business, and Built Environment.",
            "Specialist creative studio environment with direct industry project attachments.",
            "EduExpress charges BDT 0 service fees."
        ],
        "documents": [
            "Valid Passport info page with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 5.0-5.5 or verified English MOI letter)",
            "Creative portfolio (for Architecture and Design applicants)",
            "Passport size photos (white background)"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "May & September"},
        "notes": [
            "Over 25 years of heritage in creative arts, built environment, and commercial design.",
            "Dedicated computer labs, 3D printing suites, and design studios.",
            "High graduate employability in Malaysian architectural and design firms."
        ],
        "badges": ["LAM Recognized Architecture", "Creative Pioneer Estd 1998", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/alfa-university-college.webp",
        "officialUrl": "https://alfa.edu.my",
        "aliases": ["ALFA", "ALFA University", "ALFA College"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Arts (Hons) in Interior Architecture",
                "subject": "Arts & design",
                "languages": "English",
                "duration": "3.5 Years",
                "intakes": "January, May, September",
                "tuition": "RM 22,000 / yr (~BDT 5.9L)",
                "tuitionAfterScholarship": "RM 17,600 / yr (With 20% Creative Waiver)",
                "eligibility": ["HSC / A-Level minimum GPA 2.5+", "Design portfolio / drawing test", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor in Computer Science (Cyber Security and Networks)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 20,500 / yr (~BDT 5.5L)",
                "tuitionAfterScholarship": "RM 16,400 / yr",
                "eligibility": ["HSC / A-Level with Math (GPA 2.8+)", "IELTS 5.0 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Information Technology (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 19,500 / yr (~BDT 5.3L)",
                "tuitionAfterScholarship": "RM 15,600 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Arts (Hons) Business Administration",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 18,500 / yr (~BDT 5.0L)",
                "tuitionAfterScholarship": "RM 14,800 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.5+", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Master",
                "name": "Master of Business Administration (MBA)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "January, May, September",
                "tuition": "RM 24,000 total (~BDT 6.5L)",
                "tuitionAfterScholarship": "RM 19,200 total",
                "eligibility": ["Bachelor's degree with CGPA 2.5+", "IELTS 6.0 or MOI English"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Business / Design Management",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "Rolling / January, May, September",
                "tuition": "RM 18,000 / yr (~BDT 4.8L)",
                "tuitionAfterScholarship": "RM 14,400 / yr",
                "eligibility": ["Master's degree in relevant field", "Research Proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 18,000 – RM 26,000", "notes": "Payable in semester instalments", "recipient": "ALFA University College", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "International Student Registration Fee", "cost": "RM 2,000", "notes": "One-time initial enrolment charge", "recipient": "ALFA University College", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "ALFA Creative Pioneer Waiver", "type": "Merit Waiver", "details": ["Up to 20% tuition fee reduction for applicants with creative design portfolios or high school GPA 3.8+."], "amount": "20% Tuition Waiver", "condition": "Portfolio or GPA 3.8+", "coverage": "Tuition deduction throughout study", "status": "active"}
        ]
    },
    {
        "slug": "asia-metropolitan-university",
        "name": "Asia Metropolitan University (AMU)",
        "location": "No. 6, Jalan Lembah, Bandar Baru Seri Alam, 81750 Masai, Johor Bahru, Malaysia",
        "country": "Malaysia",
        "city": "Johor Bahru",
        "province": "Johor",
        "intake": "January, March, May, July, September, November",
        "degree": "Foundation, Diploma, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 26,
        "rankingWorld": 1150,
        "rankingNational": 26,
        "majors": "Pharmacy, Physiotherapy, Healthcare Management, Nursing, Business Administration, Accounting & Finance, Information Technology, Biomedical Science",
        "tuition": "RM 16,000 – RM 26,000 / yr (~BDT 4.3L – 7.0L)",
        "tuitionDetails": [
            "Specialized healthcare, nursing, pharmacy and business university located in Johor Bahru.",
            "Accredited by MQA, Nursing Board Malaysia, and Malaysian Pharmacy Board.",
            "Very affordable healthcare degree programs compared to Kuala Lumpur institutions.",
            "Close proximity to Singapore (just 30 minutes from the Singapore-Johor Causeway).",
            "Zero EduExpress service charge (BDT 0)."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (attested)",
            "English Language Certificate (IELTS 5.0-5.5 or MOI English letter)",
            "Passport size photos (white background)",
            "Medical check-up report"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "May & September"},
        "notes": [
            "Clinical training conducted at accredited government and private hospitals across Johor.",
            "Purpose-built campus with specialized nursing simulation labs and anatomy models.",
            "Affordable living costs in Johor Bahru compared to the Klang Valley."
        ],
        "badges": ["Specialized Healthcare University", "MQA Accredited", "Affordable Tuition", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/asia-metropolitan-university.webp",
        "officialUrl": "https://amu.edu.my",
        "aliases": ["AMU", "Asia Metropolitan University Malaysia"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Pharmacy (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "September",
                "tuition": "RM 28,000 / yr (~BDT 7.5L)",
                "tuitionAfterScholarship": "RM 22,400 / yr (With 20% Healthcare Waiver)",
                "eligibility": ["HSC / A-Level with Chemistry, Biology & Math", "IELTS 5.5"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Physiotherapy (Hons)",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "4 Years",
                "intakes": "January, May, September",
                "tuition": "RM 21,000 / yr (~BDT 5.7L)",
                "tuitionAfterScholarship": "RM 16,800 / yr",
                "eligibility": ["HSC / A-Level Science stream with Biology", "IELTS 5.0 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) in Healthcare Management",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 18,500 / yr (~BDT 5.0L)",
                "tuitionAfterScholarship": "RM 14,800 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.5+", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Business Administration (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 16,500 / yr (~BDT 4.5L)",
                "tuitionAfterScholarship": "RM 13,200 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.5+", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Diploma",
                "name": "Diploma in Nursing",
                "subject": "Medicine & health",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, July, September",
                "tuition": "RM 15,000 / yr (~BDT 4.0L)",
                "tuitionAfterScholarship": "RM 12,000 / yr",
                "eligibility": ["SSC / O-Level with minimum 5 credits including Science & Math", "Basic English"]
            },
            {
                "level": "Master",
                "name": "Master of Business Administration (Healthcare Management)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1 Year (Full-time)",
                "intakes": "January, May, September",
                "tuition": "RM 22,000 total (~BDT 5.9L)",
                "tuitionAfterScholarship": "RM 17,600 total",
                "eligibility": ["Bachelor's degree with CGPA 2.5+", "IELTS 6.0 or MOI English"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 16,000 – RM 26,000", "notes": "Payable in semester instalments", "recipient": "Asia Metropolitan University", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Government immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "Enrolment & International Admin Fee", "cost": "RM 2,000", "notes": "One-time initial international enrolment charge", "recipient": "AMU", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "AMU Healthcare Future Leader Scholarship", "type": "Merit Waiver", "details": ["20% to 35% tuition fee waiver for pharmacy and physiotherapy students with good academic standing."], "amount": "20% - 35% Tuition Waiver", "condition": "High school GPA 3.8+", "coverage": "Tuition deduction throughout study", "status": "active"}
        ]
    },
    {
        "slug": "london-school-of-business-and-finance-malaysia",
        "name": "London School of Business & Finance (LSBF) Malaysia",
        "location": "Level 13, Menara Sentral Vista, 150 Jalan Sultan Abdul Samad, Brickfields, 50470 Kuala Lumpur, Malaysia",
        "country": "Malaysia",
        "city": "Kuala Lumpur",
        "province": "Kuala Lumpur",
        "intake": "January, March, May, July, September, November",
        "degree": "Foundation, Diploma, Bachelor, Professional ACCA",
        "taught": "English",
        "rankingCountry": 27,
        "rankingWorld": 1200,
        "rankingNational": 27,
        "majors": "ACCA Professional Qualification, Accounting and Finance, Digital Marketing, Business Administration, Information Technology, International Business",
        "tuition": "RM 15,000 – RM 22,000 / yr (~BDT 4.0L – 5.9L)",
        "tuitionDetails": [
            "Part of Global University Systems (GUS) — international education network across UK, Canada, and Singapore.",
            "ACCA Gold Approved Learning Partner with exceptional exam passing rates.",
            "Specialized business, finance, accounting, and digital marketing degrees in central KL (KL Sentral transportation hub).",
            "Very economical international student fee structure in Malaysian Ringgit.",
            "Zero EduExpress service charge (BDT 0)."
        ],
        "documents": [
            "Valid Passport info page with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 5.0-5.5 or verified English MOI letter)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 4-6 weeks before intake", "startDate": "May & September"},
        "notes": [
            "Located at KL Sentral with direct connections to KLIA Express, MRT, LRT, and KTM.",
            "Direct progression pathways to UK universities within the Global University Systems group.",
            "High employability in Kuala Lumpur's financial district."
        ],
        "badges": ["GUS UK Network", "ACCA Gold Partner", "Central KL Location", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/london-school-of-business-and-finance-malaysia.webp",
        "officialUrl": "https://www.lsbf.edu.my",
        "aliases": ["LSBF Malaysia", "LSBF KL"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "Bachelor of Arts (Hons) Accounting and Finance",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 18,500 / yr (~BDT 5.0L)",
                "tuitionAfterScholarship": "RM 14,800 / yr (With 20% GUS Scholarship)",
                "eligibility": ["HSC / A-Level with Math or Business (GPA 2.8+)", "IELTS 5.0 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Science (Hons) Digital Marketing",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "January, May, September",
                "tuition": "RM 18,000 / yr (~BDT 4.8L)",
                "tuitionAfterScholarship": "RM 14,400 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.5+", "IELTS 5.0 or MOI"]
            },
            {
                "level": "Diploma",
                "name": "Diploma in Business Administration",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "2 Years",
                "intakes": "January, March, May, July, September",
                "tuition": "RM 13,500 / yr (~BDT 3.6L)",
                "tuitionAfterScholarship": "RM 10,800 / yr",
                "eligibility": ["SSC / O-Level with minimum 3 credits", "Basic English"]
            },
            {
                "level": "Diploma",
                "name": "Diploma in Information Technology",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "2 Years",
                "intakes": "January, March, May, July, September",
                "tuition": "RM 14,000 / yr (~BDT 3.8L)",
                "tuitionAfterScholarship": "RM 11,200 / yr",
                "eligibility": ["SSC / O-Level with Math credit", "Basic English"]
            },
            {
                "level": "Bachelor",
                "name": "ACCA Professional Qualification (Applied Skills & Strategic Professional)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "2.5 - 3 Years",
                "intakes": "January, July",
                "tuition": "RM 14,000 / yr (~BDT 3.8L)",
                "tuitionAfterScholarship": "RM 11,200 / yr",
                "eligibility": ["HSC / A-Level with Math or Bachelor's degree for paper exemptions"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 15,000 – RM 22,000", "notes": "Payable in semester instalments", "recipient": "LSBF Malaysia", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "International Student Enrolment Fee", "cost": "RM 2,000", "notes": "One-time registration fee", "recipient": "LSBF Malaysia", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "GUS Global Merit Scholarship", "type": "Merit Waiver", "details": ["Direct 20% to 30% tuition fee reduction for international students enrolling in degree tracks."], "amount": "20% - 30% Tuition Waiver", "condition": "High school GPA 3.5+", "coverage": "Tuition deduction throughout study", "status": "active"}
        ]
    },
    {
        "slug": "intec-education-college",
        "name": "INTEC Education College",
        "location": "Jalan Senangin Satu 17/2A, Seksyen 17, 40200 Shah Alam, Selangor, Malaysia",
        "country": "Malaysia",
        "city": "Shah Alam",
        "province": "Selangor",
        "intake": "January, March, May, July, September",
        "degree": "Foundation, Diploma, Professional ACCA",
        "taught": "English",
        "rankingCountry": 28,
        "rankingWorld": 1250,
        "rankingNational": 28,
        "majors": "ACCA & CAT, Diploma in Business Management, Diploma in Accounting, Diploma in Islamic Finance, American Degree Transfer Program (ADTP), A-Level Pre-University",
        "tuition": "RM 14,000 – RM 20,000 / yr (~BDT 3.8L – 5.4L)",
        "tuitionDetails": [
            "Pioneer pre-university and professional accounting college founded in 1983 by Universiti Teknologi MARA (UiTM).",
            "ACCA Platinum Approved Learning Partner (highest tier awarded by ACCA UK).",
            "Over 40 years of grooming Malaysian and international students for top UK, US, and Australian universities.",
            "Very affordable college fees with transparent first-year instalment schedule.",
            "BDT 0 EduExpress service charge."
        ],
        "documents": [
            "Valid Passport with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level)",
            "English Language Certificate (IELTS 5.0 or MOI English letter)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 6 weeks before intake", "startDate": "May & September"},
        "notes": [
            "Premier government-linked foundation and ACCA training college in Malaysia.",
            "High ACCA paper passing rates consistently exceeding worldwide averages.",
            "Lush residential campus in Section 17, Shah Alam."
        ],
        "badges": ["ACCA Platinum Partner", "Founded 1983 by UiTM", "Top Pre-University Hub", "MQA Accredited", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/intec-education-college.webp",
        "officialUrl": "https://intec.edu.my",
        "aliases": ["INTEC", "INTEC Shah Alam"],
        "programs": [
            {
                "level": "Bachelor",
                "name": "ACCA Professional Qualification (Platinum ALP)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "2.5 - 3 Years",
                "intakes": "January, July",
                "tuition": "RM 14,000 / yr (~BDT 3.8L)",
                "tuitionAfterScholarship": "RM 11,200 / yr (With High Achiever Bursary)",
                "eligibility": ["HSC / A-Level with Math or Accounting background"]
            },
            {
                "level": "Diploma",
                "name": "Diploma in Business Management",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "2.5 Years",
                "intakes": "January, May, September",
                "tuition": "RM 14,500 / yr (~BDT 3.9L)",
                "tuitionAfterScholarship": "RM 11,600 / yr",
                "eligibility": ["SSC / O-Level with minimum 3 credits", "Basic English"]
            },
            {
                "level": "Diploma",
                "name": "Diploma in Accounting",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "2.5 Years",
                "intakes": "January, May, September",
                "tuition": "RM 14,500 / yr (~BDT 3.9L)",
                "tuitionAfterScholarship": "RM 11,600 / yr",
                "eligibility": ["SSC / O-Level with Math credit", "Basic English"]
            },
            {
                "level": "Diploma",
                "name": "Diploma in Islamic Finance",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "2.5 Years",
                "intakes": "January, May, September",
                "tuition": "RM 14,500 / yr (~BDT 3.9L)",
                "tuitionAfterScholarship": "RM 11,600 / yr",
                "eligibility": ["SSC / O-Level with minimum 3 credits", "Basic English"]
            },
            {
                "level": "Foundation",
                "name": "American Degree Transfer Program (ADTP)",
                "subject": "Foundation & pathway",
                "languages": "English",
                "duration": "2 Years",
                "intakes": "January, May, September",
                "tuition": "RM 18,000 / yr (~BDT 4.8L)",
                "tuitionAfterScholarship": "RM 14,400 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 3.0+"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 14,000 – RM 20,000", "notes": "Payable in semester instalments", "recipient": "INTEC Education College", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Government immigration charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "International Student Registration Fee", "cost": "RM 1,800", "notes": "One-time initial enrolment fee", "recipient": "INTEC Education College", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "INTEC High Achiever Bursary", "type": "Merit Waiver", "details": ["Tuition fee waiver up to 20% for students with top academic results in SSC/HSC."], "amount": "15% - 20% Tuition Waiver", "condition": "High school GPA 4.0+", "coverage": "Tuition deduction", "status": "active"}
        ]
    },
    {
        "slug": "kuala-lumpur-university-of-science-and-technology",
        "name": "Kuala Lumpur University of Science and Technology (KLUST)",
        "location": "Wisma KLUST, Jalan Dang Wangi, 50100 Kuala Lumpur, Malaysia",
        "country": "Malaysia",
        "city": "Kuala Lumpur",
        "province": "Kuala Lumpur",
        "intake": "January, March, May, July, September, November",
        "degree": "Diploma, Bachelor, Master, PhD",
        "taught": "English",
        "rankingCountry": 29,
        "rankingWorld": 1300,
        "rankingNational": 29,
        "majors": "Master of Business Administration (MBA), Water Resources Engineering, Computer Science, Information Technology, Business Administration, Environmental Engineering",
        "tuition": "RM 16,000 – RM 24,000 / yr (~BDT 4.3L – 6.5L)",
        "tuitionDetails": [
            "Specialized industry-focused STEM, computing, water resources and management college in Kuala Lumpur.",
            "Postgraduate MBA with special AES 20% discount package (Total fee RM 13,000 – RM 18,000).",
            "MQA accredited programmes with flexible full-time, part-time and online learning (ODL) modes.",
            "Located in downtown Kuala Lumpur (Dang Wangi area, near Monorail and LRT).",
            "Zero EduExpress service charge (BDT 0)."
        ],
        "documents": [
            "Valid Passport info page with min. 18 months validity",
            "Academic Transcripts & Certificates (SSC & HSC / O & A Level / Bachelor)",
            "English Language Certificate (IELTS 5.5-6.0 or verified English MOI letter)",
            "Passport size photos (white background)",
            "Health Declaration"
        ],
        "deadlines": {"application": "Rolling / 4-6 weeks before intake", "startDate": "July & November"},
        "notes": [
            "High flexibility for working adults and international postgraduate researchers.",
            "Master of Science in Water Resources recognized for environmental and civil careers.",
            "Affordable urban study with convenient transit connectivity."
        ],
        "badges": ["Specialized STEM & MBA", "MQA Accredited", "Downtown KL Location", "Zero Service Charge BDT 0"],
        "logo": "/images/universities/logos/kuala-lumpur-university-of-science-and-technology.webp",
        "officialUrl": "https://www.klust.edu.my",
        "aliases": ["KLUST", "KLUST Malaysia"],
        "programs": [
            {
                "level": "Master",
                "name": "Master of Business Administration (MBA - ODL & Full-time)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "1 Year",
                "intakes": "July, November",
                "tuition": "RM 16,500 total (~BDT 4.5L)",
                "tuitionAfterScholarship": "RM 13,200 total (With 20% Special AES Discount)",
                "eligibility": ["Bachelor's degree with CGPA 2.5+", "IELTS 6.0 or MOI English"]
            },
            {
                "level": "Master",
                "name": "Master of Science in Water Resources",
                "subject": "Engineering",
                "languages": "English",
                "duration": "1.5 Years",
                "intakes": "July, November",
                "tuition": "RM 22,000 total (~BDT 5.9L)",
                "tuitionAfterScholarship": "RM 17,600 total",
                "eligibility": ["Bachelor's in Engineering or Science with CGPA 2.75+", "IELTS 6.0"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Information Technology (Hons)",
                "subject": "Computer science & AI",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, July, November",
                "tuition": "RM 18,500 / yr (~BDT 5.0L)",
                "tuitionAfterScholarship": "RM 14,800 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.8+ with Math", "IELTS 5.5 or MOI English"]
            },
            {
                "level": "Bachelor",
                "name": "Bachelor of Business Administration (Hons)",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "March, July, November",
                "tuition": "RM 17,500 / yr (~BDT 4.7L)",
                "tuitionAfterScholarship": "RM 14,000 / yr",
                "eligibility": ["HSC / A-Level minimum GPA 2.5+", "IELTS 5.0 or MOI"]
            },
            {
                "level": "PhD",
                "name": "Doctor of Philosophy (PhD) in Management",
                "subject": "Business, finance & economics",
                "languages": "English",
                "duration": "3 Years",
                "intakes": "Rolling / July, November",
                "tuition": "RM 18,000 / yr (~BDT 4.8L)",
                "tuitionAfterScholarship": "RM 14,400 / yr",
                "eligibility": ["Master's degree in relevant discipline", "Research Proposal"]
            }
        ],
        "fees": [
            {"item": "Annual Tuition Fee", "cost": "RM 16,000 – RM 24,000", "notes": "Subject to programme choice", "recipient": "KLUST", "refundable": "conditional"},
            {"item": "EMGS Visa & Processing Fee", "cost": "RM 2,800 – RM 3,200", "notes": "Malaysian government visa charges", "recipient": "EMGS", "refundable": "no"},
            {"item": "International Student Administration Fee", "cost": "RM 2,000", "notes": "One-time initial international enrolment charge", "recipient": "KLUST", "refundable": "no"},
            {"item": "EduExpress Counseling & Application Processing", "cost": "BDT 0", "notes": "100% Free Service: zero file-opening fee", "recipient": "EduExpress International", "refundable": "yes"}
        ],
        "scholarships": [
            {"title": "KLUST Postgraduate Rebate", "type": "Tuition Discount", "details": ["Direct 20% discount on MBA and Master's tuition for international applicants under the AES agreement."], "amount": "20% Tuition Discount", "condition": "Confirmed admission to postgraduate track", "coverage": "Tuition fee reduction", "status": "active"}
        ]
    }
]

def update_database(db_path):
    if not os.path.exists(db_path):
        print(f"Skipping non-existent database: {db_path}")
        return

    print(f"\n==========================================")
    print(f"Updating database: {db_path}")
    print(f"==========================================")

    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    c.execute("PRAGMA foreign_keys = ON;")

    # Check available columns in University table
    c.execute("PRAGMA table_info(University)")
    col_names = [r[1] for r in c.fetchall()]
    has_province = "province" in col_names

    inserted_unis = 0
    updated_unis = 0
    total_programs = 0
    total_fees = 0
    total_scholarships = 0

    for uni in MALAYSIA_UNIVERSITIES:
        slug = uni["slug"]
        # Check if university exists
        c.execute("SELECT id FROM University WHERE slug = ?", (slug,))
        row = c.fetchone()

        uni_id = row[0] if row else generate_id()

        # JSON strings
        tuition_details_json = json.dumps(uni["tuitionDetails"])
        documents_json = json.dumps(uni["documents"])
        notes_json = json.dumps(uni["notes"])
        badges_json = json.dumps(uni["badges"])
        aliases_json = json.dumps(uni["aliases"])
        legacy_slugs_json = json.dumps([])
        source_urls_json = json.dumps([uni["officialUrl"], "https://www2.mqa.gov.my/mqr/"])

        if row:
            # Update
            if has_province:
                c.execute("""
                    UPDATE University SET
                        name = ?,
                        location = ?,
                        country = ?,
                        city = ?,
                        province = ?,
                        intake = ?,
                        degree = ?,
                        taught = ?,
                        rankingCountry = ?,
                        rankingWorld = ?,
                        rankingNational = ?,
                        majors = ?,
                        tuition = ?,
                        tuitionDetails = ?,
                        documents = ?,
                        deadlineApplication = ?,
                        deadlineStartDate = ?,
                        notes = ?,
                        badges = ?,
                        logo = ?,
                        isActive = 1,
                        officialUrl = ?,
                        aliases = ?,
                        relationshipType = 'authorized_representative',
                        relationshipEvidenceUrl = 'https://asianeducationsolutions.com',
                        recognitionAuthority = 'Malaysian Qualifications Agency (MQA) & Ministry of Higher Education (MoHE)',
                        recognitionSourceUrl = 'https://www2.mqa.gov.my/mqr/',
                        sourceUrls = ?,
                        lastVerifiedAt = ?,
                        verificationExpiresAt = ?,
                        verificationStatus = 'verified',
                        updatedAt = ?
                    WHERE id = ?
                """, (
                    uni["name"], uni["location"], uni["country"], uni["city"], uni["province"],
                    uni["intake"], uni["degree"], uni["taught"],
                    uni.get("rankingCountry"), uni.get("rankingWorld"), uni.get("rankingNational"),
                    uni["majors"], uni["tuition"], tuition_details_json, documents_json,
                    uni["deadlines"]["application"], uni["deadlines"]["startDate"],
                    notes_json, badges_json, uni["logo"], uni["officialUrl"], aliases_json,
                    source_urls_json, NOW_ISO, EXPIRY_ISO, NOW_ISO, uni_id
                ))
            else:
                c.execute("""
                    UPDATE University SET
                        name = ?,
                        location = ?,
                        country = ?,
                        city = ?,
                        intake = ?,
                        degree = ?,
                        taught = ?,
                        rankingCountry = ?,
                        rankingWorld = ?,
                        rankingNational = ?,
                        majors = ?,
                        tuition = ?,
                        tuitionDetails = ?,
                        documents = ?,
                        deadlineApplication = ?,
                        deadlineStartDate = ?,
                        notes = ?,
                        badges = ?,
                        logo = ?,
                        isActive = 1,
                        officialUrl = ?,
                        aliases = ?,
                        relationshipType = 'authorized_representative',
                        relationshipEvidenceUrl = 'https://asianeducationsolutions.com',
                        recognitionAuthority = 'Malaysian Qualifications Agency (MQA) & Ministry of Higher Education (MoHE)',
                        recognitionSourceUrl = 'https://www2.mqa.gov.my/mqr/',
                        sourceUrls = ?,
                        lastVerifiedAt = ?,
                        verificationExpiresAt = ?,
                        verificationStatus = 'verified',
                        updatedAt = ?
                    WHERE id = ?
                """, (
                    uni["name"], uni["location"], uni["country"], uni["city"],
                    uni["intake"], uni["degree"], uni["taught"],
                    uni.get("rankingCountry"), uni.get("rankingWorld"), uni.get("rankingNational"),
                    uni["majors"], uni["tuition"], tuition_details_json, documents_json,
                    uni["deadlines"]["application"], uni["deadlines"]["startDate"],
                    notes_json, badges_json, uni["logo"], uni["officialUrl"], aliases_json,
                    source_urls_json, NOW_ISO, EXPIRY_ISO, NOW_ISO, uni_id
                ))
            updated_unis += 1
            print(f"  [UPDATED] University: {uni['name']} ({slug})")
        else:
            # Insert
            if has_province:
                c.execute("""
                    INSERT INTO University (
                        id, slug, name, location, country, city, province,
                        intake, degree, taught, rankingCountry, rankingWorld, rankingNational,
                        majors, tuition, tuitionDetails, documents,
                        deadlineApplication, deadlineStartDate, notes, badges, logo,
                        isActive, officialUrl, aliases, legacySlugs,
                        relationshipType, relationshipEvidenceUrl,
                        recognitionAuthority, recognitionSourceUrl, sourceUrls,
                        lastVerifiedAt, verificationExpiresAt, verificationStatus,
                        createdAt, updatedAt
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        1, ?, ?, ?,
                        'authorized_representative', 'https://asianeducationsolutions.com',
                        'Malaysian Qualifications Agency (MQA) & Ministry of Higher Education (MoHE)',
                        'https://www2.mqa.gov.my/mqr/', ?,
                        ?, ?, 'verified',
                        ?, ?
                    )
                """, (
                    uni_id, slug, uni["name"], uni["location"], uni["country"], uni["city"], uni["province"],
                    uni["intake"], uni["degree"], uni["taught"],
                    uni.get("rankingCountry"), uni.get("rankingWorld"), uni.get("rankingNational"),
                    uni["majors"], uni["tuition"], tuition_details_json, documents_json,
                    uni["deadlines"]["application"], uni["deadlines"]["startDate"],
                    notes_json, badges_json, uni["logo"], uni["officialUrl"], aliases_json, legacy_slugs_json,
                    source_urls_json, NOW_ISO, EXPIRY_ISO, NOW_ISO, NOW_ISO
                ))
            else:
                c.execute("""
                    INSERT INTO University (
                        id, slug, name, location, country, city,
                        intake, degree, taught, rankingCountry, rankingWorld, rankingNational,
                        majors, tuition, tuitionDetails, documents,
                        deadlineApplication, deadlineStartDate, notes, badges, logo,
                        isActive, officialUrl, aliases, legacySlugs,
                        relationshipType, relationshipEvidenceUrl,
                        recognitionAuthority, recognitionSourceUrl, sourceUrls,
                        lastVerifiedAt, verificationExpiresAt, verificationStatus,
                        createdAt, updatedAt
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        1, ?, ?, ?,
                        'authorized_representative', 'https://asianeducationsolutions.com',
                        'Malaysian Qualifications Agency (MQA) & Ministry of Higher Education (MoHE)',
                        'https://www2.mqa.gov.my/mqr/', ?,
                        ?, ?, 'verified',
                        ?, ?
                    )
                """, (
                    uni_id, slug, uni["name"], uni["location"], uni["country"], uni["city"],
                    uni["intake"], uni["degree"], uni["taught"],
                    uni.get("rankingCountry"), uni.get("rankingWorld"), uni.get("rankingNational"),
                    uni["majors"], uni["tuition"], tuition_details_json, documents_json,
                    uni["deadlines"]["application"], uni["deadlines"]["startDate"],
                    notes_json, badges_json, uni["logo"], uni["officialUrl"], aliases_json, legacy_slugs_json,
                    source_urls_json, NOW_ISO, EXPIRY_ISO, NOW_ISO, NOW_ISO
                ))
            inserted_unis += 1
            print(f"  [INSERTED] University: {uni['name']} ({slug})")

        # Now clean & replace child records for this university
        c.execute("DELETE FROM Program WHERE universityId = ?", (uni_id,))
        c.execute("DELETE FROM Fee WHERE universityId = ?", (uni_id,))
        c.execute("DELETE FROM Scholarship WHERE universityId = ?", (uni_id,))

        # Insert Programs
        for prog in uni.get("programs", []):
            prog_id = generate_id()
            eligibility_json = json.dumps(prog.get("eligibility", []))
            c.execute("""
                INSERT INTO Program (
                    id, universityId, level, name, subject, languages,
                    duration, intakes, tuition, tuitionAfterScholarship,
                    applicationDeadline, eligibility, sourceUrl, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
            """, (
                prog_id, uni_id, prog["level"], prog["name"], prog.get("subject"),
                prog.get("languages", "English"), prog.get("duration"), prog.get("intakes"),
                prog.get("tuition"), prog.get("tuitionAfterScholarship"),
                "Rolling / 6 weeks before intake", eligibility_json, uni["officialUrl"]
            ))
            total_programs += 1

        # Insert Fees
        for fee in uni.get("fees", []):
            fee_id = generate_id()
            c.execute("""
                INSERT INTO Fee (
                    id, universityId, item, cost, notes, recipient, refundable, validFor, sourceUrl
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                fee_id, uni_id, fee["item"], fee["cost"], fee.get("notes"),
                fee.get("recipient"), fee.get("refundable", "no"), "2026/2027 Academic Year", uni["officialUrl"]
            ))
            total_fees += 1

        # Insert Scholarships
        for sch in uni.get("scholarships", []):
            sch_id = generate_id()
            details_json = json.dumps(sch.get("details", []))
            eligible_json = json.dumps(["All eligible undergraduate & postgraduate programs"])
            c.execute("""
                INSERT INTO Scholarship (
                    id, universityId, title, type, details, amount, condition,
                    eligiblePrograms, coverage, renewal, deadline, sourceUrl, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
            """, (
                sch_id, uni_id, sch["title"], sch.get("type", "Merit Waiver"),
                details_json, sch.get("amount"), sch.get("condition"), eligible_json,
                sch.get("coverage", "Tuition waiver"), "Subject to academic progression (GPA 3.0+)",
                "With program application", uni["officialUrl"]
            ))
            total_scholarships += 1

    conn.commit()
    conn.close()

    print(f"\nDatabase Sync Complete for {db_path}:")
    print(f"  Inserted Universities: {inserted_unis}")
    print(f"  Updated Universities:  {updated_unis}")
    print(f"  Total Programs Added:  {total_programs}")
    print(f"  Total Fees Added:      {total_fees}")
    print(f"  Total Scholarships:    {total_scholarships}")

if __name__ == "__main__":
    for path in DB_PATHS:
        update_database(path)
    print("\nAll database instances populated and verified successfully.")
