export interface IUniversityFee {
    id?: string;
    item: string;
    cost: string;
    notes?: string;
    recipient?: string;
    refundable?: 'yes' | 'no' | 'conditional' | '';
    validFor?: string;
    sourceUrl?: string;
}

export interface IUniversityProgram {
    id?: string;
    level: string;
    name: string;
    subject?: string;
    languages: string[];
    duration?: string;
    intakes: string[];
    tuition?: string;
    tuitionAfterScholarship?: string;
    applicationDeadline?: string;
    eligibility: string[];
    sourceUrl?: string;
    status: 'active' | 'planned' | 'paused';
}

export interface IUniversityScholarship {
    id?: string;
    title: string;
    type?: string;
    details: string[];
    amount?: string;
    condition?: string;
    eligiblePrograms?: string[];
    coverage?: string;
    renewal?: string;
    deadline?: string;
    sourceUrl?: string;
    status?: 'active' | 'planned' | 'closed';
}

export interface IUniversityCostPlan {
    id?: string;
    title: string;
    programName?: string;
    scholarshipTitle?: string;
    programId?: string;
    scholarshipId?: string;
    intake?: string;
    currency: string;
    tuitionBeforeScholarship?: string;
    scholarshipValue?: string;
    tuitionAfterScholarship?: string;
    applicationFee?: string;
    hostel?: string;
    insurance?: string;
    medical?: string;
    visa?: string;
    travel?: string;
    living?: string;
    serviceFee?: string;
    otherCosts?: string[];
    totalEstimate?: string;
    notes?: string[];
    sourceUrl?: string;
    lastVerifiedAt?: Date | string;
    isPublished: boolean;
}

export interface IUniversity {
    id: string;
    slug: string; // Used as ID in frontend (e.g. 'sichuan-university')
    name: string;
    location: string;
    country: string;
    city: string;
    intake: string[];
    degree: string[];
    taught: string[];
    rankings: {
        country?: number;
        world?: number;
        national?: number;
    };
    details: {
        majors: string[];
        tuition: string; // Base or range
        tuitionDetails?: string[];
    };
    fees: IUniversityFee[];
    scholarships: IUniversityScholarship[];
    documents: string[];
    deadlines: {
        application: string;
        startDate: string;
    };
    notes?: string[];
    badges?: string[];
    logo?: string;
    programs?: IUniversityProgram[];
    costPlans?: IUniversityCostPlan[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    officialUrl?: string;
    aliases?: string[];
    legacySlugs?: string[];
    relationshipType?: 'direct_partner' | 'authorized_representative' | 'network_access' | 'public_direct_application' | 'unverified';
    relationshipEvidenceUrl?: string;
    recognitionAuthority?: string;
    recognitionSourceUrl?: string;
    sourceUrls?: string[];
    lastVerifiedAt?: Date;
    verificationExpiresAt?: Date;
    verificationStatus?: 'verified' | 'under_verification' | 'expired';
}
