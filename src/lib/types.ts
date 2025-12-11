// Shared interfaces to eliminate duplicates across the application

export interface Testimonial {
  _id: string;
  name: string;
  location: string;
  university: string;
  program: string;
  quote: string;
  rating: number;
  image?: string;
  country: string;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Update {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaDescription?: string;
  category?: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: string;
  isFeatured: boolean;
  author: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
}

export interface UpdatesResponse {
  updates: Update[];
  totalCount: number;
  categories: string[];
  authors: string[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface University {
  name: string;
  ranking: string;
  globalRanking?: string;
  programs: string[];
  location?: string;
  founded?: string;
  students?: string;
  description?: string;
  logo?: string;
}

export interface Scholarship {
  name: string;
  amount: string;
  coverage: string[];
  eligibility: string[];
  deadline: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  program: string;
  message?: string;
  status: 'new' | 'contacted' | 'consultation_scheduled' | 'consultation_completed' | 'qualified' | 'application_started' | 'application_submitted' | 'admission_received' | 'visa_applied' | 'visa_approved' | 'enrolled' | 'converted' | 'not_interested' | 'closed';
  source: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  _id: string;
  title: string;
  slug: string;
  content: string;
  type: string;
  category?: string;
  excerpt?: string;
  featuredImage?: string;
  isPublished: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  categories?: string[];
  author: string;
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  _id: string;
  name: string;
  slug: string;
  flag: string;
  description: string;
  universities: string[];
  programs: string[];
  requirements: {
    language: string[];
    documents: string[];
    visa: string[];
  };
  costs: {
    tuition: string;
    living: string;
    currency: string;
  };
  scholarships: string[];
  isActive: boolean;
  featured: boolean;
  images: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Partnership {
  _id: string;
  // Company Information
  companyName?: string;
  businessType: 'individual' | 'consultancy' | 'agency' | 'institution' | 'other';
  businessRegistrationNumber?: string;
  businessLicense?: string;
  website?: string;
  yearsInBusiness: number;
  
  // Contact Information
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  
  // Business Details
  partnershipType: 'individual_agent' | 'company';
  targetCountries: string[];
  currentClients: number;
  monthlyTarget: number;
  experience: string;
  currentPartners?: string[];
  
  // Financial Information
  annualRevenue?: string;
  investmentCapacity: string;
  expectedCommission: string;
  
  // Marketing & Network
  marketingChannels: string[];
  socialMediaPresence: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  localNetwork: string;
  referralSources: string[];
  
  // Documents
  documents: {
    businessLicense?: string;
    taxCertificate?: string;
    bankStatement?: string;
    identityProof?: string;
    portfolio?: string;
  };
  
  // Additional Information
  motivation: string;
  expectations: string;
  additionalInfo?: string;
  
  // Status & Management
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'on_hold';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  reviewNotes?: string;
  followUpDate?: string;
  
  // System Fields
  source: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalTestimonials: number;
  totalCountries: number;
  totalPartnerships: number;
  newPartnerships: number;
  recentLeads: Array<{
    _id: string;
    name: string;
    email: string;
    country: string;
    program: string;
    status: string;
    createdAt: string;
  }>;
  recentPartnerships: Array<{
    _id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    country: string;
    partnershipType: string;
    status: string;
    createdAt: string;
  }>;
}

// Common page props
export interface PageProps {
  params: Promise<{
    [key: string]: string;
  }>;
}

export interface CountryPageProps extends PageProps {
  params: Promise<{
    country: string;
  }>;
}

export interface UpdatePageProps extends PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Component props
export interface ConsultationButtonProps {
  text: string;
  className?: string;
  source: string;
}

export interface UpdateClientProps {
  update: Update;
}
