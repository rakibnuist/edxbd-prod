export interface IUniversityFee {
    item: string;
    cost: string;
    notes?: string;
    recipient?: string;
    refundable?: 'yes' | 'no' | 'conditional' | '';
    validFor?: string;
    sourceUrl?: string;
}

export interface IUniversityProgram {
    _id?: string;
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

export interface IUniversity {
    _id: string;
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
