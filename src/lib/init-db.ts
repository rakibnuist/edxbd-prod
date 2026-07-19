import prisma from '@/lib/prisma';

export async function initializeDatabase() {
  try {
    // Database connected successfully

    // Check if we have any data
    const leadCount = await prisma.lead.count();
    const testimonialCount = await prisma.testimonial.count();
    const countryCount = await prisma.country.count();
    const contentCount = await prisma.content.count();

    // Current data summary

    // If no countries exist, add some sample data
    if (countryCount === 0) {
      // Adding sample countries
      const sampleCountries = [
        {
          name: 'United Kingdom',
          slug: 'united-kingdom',
          flag: '🇬🇧',
          description: 'World-class education with prestigious universities and rich cultural heritage',
          universities: JSON.stringify(['University of Oxford', 'University of Cambridge', 'Imperial College London']),
          programs: JSON.stringify(['Business Administration', 'Engineering', 'Medicine', 'Law', 'Arts & Humanities']),
          requirements: JSON.stringify({
            language: ['IELTS 6.5+', 'TOEFL 90+', 'PTE 62+'],
            documents: ['Academic Transcripts', 'English Proficiency', 'Personal Statement', 'References'],
            visa: ['Student Visa (Tier 4)', 'Financial Documents', 'CAS Letter']
          }),
          costs: JSON.stringify({
            tuition: '£15,000 - £35,000 per year',
            living: '£12,000 - £15,000 per year',
            currency: 'GBP'
          }),
          scholarships: JSON.stringify(['Chevening Scholarships', 'Commonwealth Scholarships', 'University-specific Scholarships']),
          isActive: true,
          featured: true
        },
        {
          name: 'China',
          slug: 'china',
          flag: '🇨🇳',
          description: 'Rapidly growing education system with modern facilities and affordable costs',
          universities: JSON.stringify(['Tsinghua University', 'Peking University', 'Fudan University']),
          programs: JSON.stringify(['Engineering', 'Business Administration', 'Computer Science', 'Medicine', 'Chinese Language']),
          requirements: JSON.stringify({
            language: ['HSK 4+', 'IELTS 6.0+', 'TOEFL 80+'],
            documents: ['Academic Transcripts', 'Language Proficiency', 'Personal Statement', 'Health Certificate'],
            visa: ['Student Visa (X1/X2)', 'JW201/JW202 Form', 'Financial Documents']
          }),
          costs: JSON.stringify({
            tuition: '$3,000 - $8,000 per year',
            living: '$2,000 - $4,000 per year',
            currency: 'USD'
          }),
          scholarships: JSON.stringify(['Chinese Government Scholarship', 'Confucius Institute Scholarship', 'University Scholarships']),
          isActive: true,
          featured: true
        }
      ];

      await prisma.country.createMany({ data: sampleCountries });
      // Sample countries added
    }

    // If no testimonials exist, add some sample data
    if (testimonialCount === 0) {
      // Adding sample testimonials
      const sampleTestimonials = [
        {
          studentName: 'Rahman Ahmed',
          university: 'University of Manchester, UK',
          content: 'EduExpress International made my dream of studying in the UK come true. Their guidance was like having a personal mentor throughout the entire process.',
          rating: 5,
          country: 'United Kingdom',
          isPublished: true,
        },
        {
          studentName: 'Fatima Khan',
          university: 'Seoul National University, South Korea',
          content: 'The team at EduExpress understood my goals and helped me secure a full scholarship. I couldn\'t have done it without them!',
          rating: 5,
          country: 'South Korea',
          isPublished: true,
        }
      ];

      await prisma.testimonial.createMany({ data: sampleTestimonials });
      // Sample testimonials added
    }

    // If no content exists, add some sample data
    if (contentCount === 0) {
      // Adding sample content
      const sampleContent = [
        {
          title: 'Welcome to EduExpress International',
          slug: 'welcome-to-eduexpress-international',
          content: `
            <div class="prose max-w-none">
              <h1>Welcome to EduExpress International</h1>
              <p>Your trusted partner for study abroad opportunities with FREE scholarship assistance. We have been helping students achieve their international education dreams since 2018.</p>
              
              <h2>Why Choose EduExpress International?</h2>
              <ul>
                <li><strong>Free Scholarship Assistance:</strong> We help you find and apply for scholarships to reduce your education costs.</li>
                <li><strong>Expert Guidance:</strong> Our experienced team provides personalized guidance throughout your application process.</li>
                <li><strong>Wide Network:</strong> We have partnerships with universities across multiple countries.</li>
                <li><strong>Proven Success:</strong> Over 1000+ successful student placements since 2018.</li>
              </ul>
              
              <h2>Our Services</h2>
              <p>We offer comprehensive services to make your study abroad journey smooth and successful:</p>
              <ul>
                <li>University selection and application assistance</li>
                <li>Scholarship search and application support</li>
                <li>Visa application guidance</li>
                <li>Document preparation and review</li>
                <li>Pre-departure orientation</li>
              </ul>
            </div>
          `,
          type: 'page',
          categories: JSON.stringify(['Announcement']),
          tags: JSON.stringify(['welcome', 'about', 'services']),
          featuredImage: '/logo.png',
          metaDescription: 'Welcome to EduExpress International - Your trusted partner for study abroad opportunities with FREE scholarship assistance since 2018.',
          author: 'Admin',
          isPublished: true,
          isFeatured: true
        },
        {
          title: 'Study in the United Kingdom - Complete Guide',
          slug: 'study-in-united-kingdom-guide',
          content: `
            <div class="prose max-w-none">
              <h1>Study in the United Kingdom - Complete Guide</h1>
              <p>The United Kingdom offers world-class education with prestigious universities and rich cultural heritage. Here's everything you need to know about studying in the UK.</p>
              
              <h2>Top Universities</h2>
              <ul>
                <li>University of Oxford</li>
                <li>University of Cambridge</li>
                <li>Imperial College London</li>
                <li>London School of Economics</li>
                <li>University College London</li>
              </ul>
              
              <h2>Popular Programs</h2>
              <ul>
                <li>Business Administration</li>
                <li>Engineering</li>
                <li>Medicine</li>
                <li>Law</li>
                <li>Arts & Humanities</li>
              </ul>
              
              <h2>Requirements</h2>
              <h3>Language Requirements</h3>
              <ul>
                <li>IELTS 6.5+</li>
                <li>TOEFL 90+</li>
                <li>PTE 62+</li>
              </ul>
              
              <h3>Documents Required</h3>
              <ul>
                <li>Academic Transcripts</li>
                <li>English Proficiency Certificate</li>
                <li>Personal Statement</li>
                <li>References</li>
              </ul>
              
              <h2>Costs</h2>
              <ul>
                <li>Tuition: £15,000 - £35,000 per year</li>
                <li>Living Expenses: £12,000 - £15,000 per year</li>
              </ul>
              
              <h2>Scholarships Available</h2>
              <ul>
                <li>Chevening Scholarships</li>
                <li>Commonwealth Scholarships</li>
                <li>University-specific Scholarships</li>
              </ul>
            </div>
          `,
          type: 'destination',
          categories: JSON.stringify(['University']),
          tags: JSON.stringify(['uk', 'united-kingdom', 'study-abroad', 'universities']),
          featuredImage: '/uploads/uk-flag.jpg',
          metaDescription: 'Complete guide to studying in the United Kingdom including top universities, requirements, costs, and scholarships.',
          author: 'Admin',
          isPublished: true,
          isFeatured: true
        },
        {
          title: 'Success Story: Rahman Ahmed - University of Manchester',
          slug: 'success-story-rahman-ahmed-manchester',
          content: `
            <div class="prose max-w-none">
              <h1>Success Story: Rahman Ahmed</h1>
              <p><strong>University:</strong> University of Manchester, UK<br>
              <strong>Program:</strong> Computer Science<br>
              <strong>From:</strong> Dhaka, Bangladesh</p>
              
              <blockquote>
                "EduExpress International made my dream of studying in the UK come true. Their guidance was like having a personal mentor throughout the entire process. They helped me with everything from university selection to visa application. I couldn't have done it without their support!"
              </blockquote>
              
              <h2>Journey Overview</h2>
              <p>Rahman Ahmed came to us with a dream to study Computer Science in the UK. With our guidance, he successfully secured admission to the University of Manchester with a partial scholarship.</p>
              
              <h2>Challenges Overcome</h2>
              <ul>
                <li>Language proficiency requirements</li>
                <li>Complex application process</li>
                <li>Visa documentation</li>
                <li>Financial planning</li>
              </ul>
              
              <h2>Results</h2>
              <ul>
                <li>✅ Admitted to University of Manchester</li>
                <li>✅ Secured partial scholarship</li>
                <li>✅ Visa approved successfully</li>
                <li>✅ Currently pursuing Computer Science</li>
              </ul>
            </div>
          `,
          type: 'blog',
          categories: JSON.stringify(['Success']),
          tags: JSON.stringify(['success-story', 'uk', 'computer-science', 'manchester']),
          featuredImage: '/uploads/success-story-1.jpg',
          metaDescription: 'Success story of Rahman Ahmed who secured admission to University of Manchester with EduExpress International assistance.',
          author: 'Admin',
          isPublished: true,
          isFeatured: true
        }
      ];

      await prisma.content.createMany({ data: sampleContent });
      // Sample content added
    }

    // Database initialization complete
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}
