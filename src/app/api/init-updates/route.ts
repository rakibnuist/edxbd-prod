
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export async function GET(_request: Request) {
  try {
    await connectDB();

    // Check if updates already exist
    const existingUpdates = await Content.countDocuments({ type: 'update' });
    if (existingUpdates > 0) {
      return NextResponse.json({
        message: 'Updates already exist in database',
        count: existingUpdates
      });
    }

    const sampleUpdates = [
      {
        title: "New Scholarship Opportunities for 2024",
        slug: "new-scholarship-opportunities-2024",
        content: `
  < h2 > Exciting Scholarship Opportunities for Bangladeshi Students </h2>
    < p > We're thrilled to announce several new scholarship opportunities for Bangladeshi students looking to study abroad in 2024.</p>

    < h3 > UK Universities - 50 % Tuition Waivers </h3>
      < p > Top UK universities are offering generous tuition waivers for students in STEM fields.This includes: </p>
        < ul >
        <li>University of Manchester - Computer Science programs </li>
          < li > Imperial College London - Engineering programs </li>
            < li > University of Edinburgh - Data Science programs </li>
              </ul>

              < h3 > Application Requirements </h3>
                < p > To be eligible for these scholarships, students must: </p>
                  < ul >
                  <li>Have a minimum GPA of 3.5 / 4.0 </li>
                    < li > IELTS score of 6.5 or above </li>
                      < li > Submit a compelling personal statement </li>
                        < li > Provide two academic references </li>
                          </ul>

                          < p > <strong>Application Deadline: </strong> March 15, 2024</p >
                            <p>Contact our team today to start your application process! </p>
                              `,
        excerpt: "UK universities are offering 50% tuition waivers for Bangladeshi students in STEM fields. Apply now for the spring 2024 intake.",
        type: "update",
        category: "Scholarships",
        tags: ["scholarship", "UK", "STEM", "tuition waiver", "2024"],
        isPublished: true,
        isFeatured: true,
        author: "edXBD Team",
        publishedAt: new Date("2024-12-20"),
        metaTitle: "New Scholarship Opportunities for 2024 - Study Abroad",
        metaDescription: "Discover new scholarship opportunities for Bangladeshi students in UK universities with 50% tuition waivers for STEM programs."
      },
      {
        title: "IELTS Preparation Workshop - Free Session",
        slug: "ielts-preparation-workshop-free-session",
        content: `
                              < h2 > Free IELTS Preparation Workshop </h2>
                                < p > Join our expert - led IELTS preparation session designed specifically for students targeting a 7.0 + band score.</p>

                                  < h3 > What You'll Learn</h3>
                                    < ul >
                                    <li>Reading strategies for different question types </li>
                                      < li > Writing task 1 and 2 techniques </li>
                                        < li > Listening skills and note - taking </li>
                                          < li > Speaking test preparation and practice </li>
                                            </ul>

                                            < h3 > Workshop Details </h3>
                                              < p > <strong>Date: </strong> December 25, 2024</p >
                                                <p><strong>Time: </strong> 2:00 PM - 5:00 PM (BST)</p >
                                                  <p><strong>Location: </strong> Online via Zoom</p >
                                                    <p><strong>Cost: </strong> Completely FREE</p >

                                                      <h3>What's Included</h3>
                                                        < ul >
                                                        <li>Expert instruction from certified IELTS trainers </li>
                                                          < li > Practice tests with detailed feedback </li>
                                                            < li > Study materials and resources </li>
                                                              < li > Q & A session with our experts </li>
                                                                </ul>

                                                                < p > Limited seats available! Register now to secure your spot.</p>
                                                                  `,
        excerpt: "Join our free IELTS preparation session for students targeting 7.0+ band score. Expert tips and practice tests included.",
        type: "update",
        category: "Events",
        tags: ["IELTS", "workshop", "free", "preparation", "English test"],
        isPublished: true,
        isFeatured: true,
        author: "IELTS Team",
        publishedAt: new Date("2024-12-18"),
        metaTitle: "Free IELTS Preparation Workshop - Expert Training",
        metaDescription: "Join our free IELTS preparation workshop with expert trainers. Learn strategies to achieve 7.0+ band score."
      },
      {
        title: "Visa Success Rate Update - December 2024",
        slug: "visa-success-rate-update-december-2024",
        content: `
                                                                  < h2 > Outstanding Visa Success Rate for December 2024 </h2>
                                                                    < p > We're proud to announce our exceptional visa approval rates for December 2024, demonstrating our expertise and commitment to student success.</p>

                                                                    < h3 > Success Rate Breakdown </h3>
                                                                      < ul >
                                                                      <li><strong>UK Student Visas: </strong> 98% approval rate</li >
                                                                        <li><strong>Canada Study Permits: </strong> 97% approval rate</li >
                                                                          <li><strong>Australia Student Visas: </strong> 96% approval rate</li >
                                                                            <li><strong>Germany Student Visas: </strong> 99% approval rate</li >
                                                                              </ul>

                                                                              < h3 > What Makes Us Different </h3>
                                                                                < p > Our high success rate is attributed to: </p>
                                                                                  < ul >
                                                                                  <li>Thorough document preparation and verification </li>
                                                                                    < li > Expert guidance on application procedures </li>
                                                                                      < li > Personalized support throughout the process </li>
                                                                                        < li > Regular updates on policy changes </li>
                                                                                          </ul>

                                                                                          < h3 > Recent Success Stories </h3>
                                                                                            < p > This month alone, we've helped over 150 students secure their study visas. Our team's attention to detail and personalized approach ensures the best possible outcome for every application.</p>

                                                                                              < p > Ready to start your study abroad journey ? Contact us today for a free consultation! </p>
                                                                                                `,
        excerpt: "Our December visa approval rate reaches 98% for UK and Canada applications. Trust our expertise for your visa success.",
        type: "update",
        category: "Visa Updates",
        tags: ["visa", "success rate", "approval", "UK", "Canada", "Australia"],
        isPublished: true,
        isFeatured: false,
        author: "Visa Team",
        publishedAt: new Date("2024-12-15"),
        metaTitle: "Visa Success Rate Update - 98% Approval Rate",
        metaDescription: "Our December 2024 visa approval rate reaches 98% for UK and Canada applications. Trust our expertise for visa success."
      },
      {
        title: "New University Partnership - 5 European Universities",
        slug: "new-university-partnership-5-european-universities",
        content: `
                                                                                                < h2 > Exciting New Partnerships with European Universities </h2>
                                                                                                  < p > We're delighted to announce new partnerships with 5 prestigious European universities, opening up more opportunities for our students.</p>

                                                                                                    < h3 > Partner Universities </h3>
                                                                                                      < ul >
                                                                                                      <li><strong>University of Amsterdam, Netherlands < /strong> - Business and Economics programs</li >
                                                                                                        <li><strong>Technical University of Munich, Germany < /strong> - Engineering and Technology</li >
                                                                                                          <li><strong>University of Barcelona, Spain < /strong> - Arts and Humanities</li >
                                                                                                            <li><strong>University of Vienna, Austria < /strong> - Social Sciences</li >
                                                                                                              <li><strong>University of Helsinki, Finland < /strong> - Environmental Studies</li >
                                                                                                                </ul>

                                                                                                                < h3 > Benefits of These Partnerships </h3>
                                                                                                                  < ul >
                                                                                                                  <li>Direct admission pathways </li>
                                                                                                                    < li > Exclusive scholarship opportunities </li>
                                                                                                                      < li > Reduced application fees </li>
                                                                                                                        < li > Priority processing </li>
                                                                                                                          < li > Dedicated support services </li>
                                                                                                                            </ul>

                                                                                                                            < h3 > Available Programs </h3>
                                                                                                                              < p > These partnerships cover a wide range of undergraduate and postgraduate programs across various disciplines.Our students now have access to world - class education at these renowned institutions.</p>

                                                                                                                                < p > Interested in studying at any of these universities ? Contact our team to learn more about the application process and available scholarships.</p>
                                                                                                                                  `,
        excerpt: "We've partnered with 5 top European universities offering direct admission and scholarship opportunities for our students.",
        type: "update",
        category: "Partnerships",
        tags: ["partnership", "European universities", "direct admission", "scholarships"],
        isPublished: true,
        isFeatured: false,
        author: "Partnerships Team",
        publishedAt: new Date("2024-12-12"),
        metaTitle: "New University Partnerships - 5 European Universities",
        metaDescription: "New partnerships with 5 prestigious European universities offering direct admission and exclusive scholarship opportunities."
      },
      {
        title: "Success Story: Student Gets Full Scholarship to MIT",
        slug: "success-story-student-gets-full-scholarship-mit",
        content: `
                                                                                                                                  < h2 > Inspiring Success: Full Scholarship to MIT </h2>
                                                                                                                                    < p > We're thrilled to share the incredible success story of Sarah Ahmed, who secured a full scholarship to the Massachusetts Institute of Technology (MIT) with our guidance and support.</p>

                                                                                                                                      < h3 > Sarah's Journey</h3>
                                                                                                                                        < p > Sarah, a brilliant student from Dhaka, came to us with a dream of studying Computer Science at one of the world's top universities. With her exceptional academic record and our expert guidance, she achieved what seemed impossible.</p>

                                                                                                                                          < h3 > Key Achievements </h3>
                                                                                                                                            < ul >
                                                                                                                                            <li>Perfect SAT score of 1600 </li>
                                                                                                                                              < li > Outstanding academic record(GPA 4.0) </li>
                                                                                                                                                < li > Strong extracurricular activities </li>
                                                                                                                                                  < li > Compelling personal statement </li>
                                                                                                                                                    < li > Excellent recommendation letters </li>
                                                                                                                                                      </ul>

                                                                                                                                                      < h3 > Our Support </h3>
                                                                                                                                                        < p > Our team provided comprehensive support including: </p>
                                                                                                                                                          < ul >
                                                                                                                                                          <li>Application strategy development </li>
                                                                                                                                                            < li > Essay writing assistance </li>
                                                                                                                                                              < li > Interview preparation </li>
                                                                                                                                                                < li > Documentation support </li>
                                                                                                                                                                  < li > Scholarship application guidance </li>
                                                                                                                                                                    </ul>

                                                                                                                                                                    < h3 > Sarah's Message</h3>
                                                                                                                                                                      <blockquote>
"edXBD made my MIT dream a reality. Their expert guidance and unwavering support throughout the application process were invaluable. I couldn't have done it without them!"
  </blockquote>

  < p > Your success is our mission.Let us help you achieve your study abroad dreams too! </p>
    `,
        excerpt: "Read how our student secured a full scholarship to MIT with our guidance and support. Your success is our mission.",
        type: "update",
        category: "Success Stories",
        tags: ["success story", "MIT", "scholarship", "computer science", "achievement"],
        isPublished: true,
        isFeatured: true,
        author: "Success Stories Team",
        publishedAt: new Date("2024-12-08"),
        metaTitle: "Success Story: Full Scholarship to MIT - Student Achievement",
        metaDescription: "Inspiring success story of a student who secured a full scholarship to MIT with our expert guidance and support."
      }
    ];

    // Insert sample updates
    const insertedUpdates = await Content.insertMany(sampleUpdates);

    return NextResponse.json({
      message: 'Sample updates created successfully',
      count: insertedUpdates.length,
      updates: insertedUpdates.map(update => ({
        id: update._id,
        title: update.title,
        slug: update.slug
      }))
    });
  } catch (error) {
    console.error('Error creating sample updates:', error);
    return NextResponse.json(
      { error: 'Failed to create sample updates' },
      { status: 500 }
    );
  }
}
