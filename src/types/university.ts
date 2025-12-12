export interface IUniversityFee {
    item: string;
    cost: string;
    notes?: string;
}

export interface IUniversityScholarship {
    title: string;
    type?: string;
    details: string[];
    amount?: string;
    condition?: string;
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
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
