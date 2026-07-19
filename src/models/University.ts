
import mongoose, { Document, Model, Schema } from 'mongoose';

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

export interface IUniversity extends Document {
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
    programs: IUniversityProgram[];
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
    createdAt: Date;
    updatedAt: Date;
    officialUrl?: string;
    aliases: string[];
    legacySlugs: string[];
    relationshipType: 'direct_partner' | 'authorized_representative' | 'network_access' | 'public_direct_application' | 'unverified';
    relationshipEvidenceUrl?: string;
    recognitionAuthority?: string;
    recognitionSourceUrl?: string;
    sourceUrls: string[];
    lastVerifiedAt?: Date;
    verificationExpiresAt?: Date;
    verificationStatus: 'verified' | 'under_verification' | 'expired';
}

const UniversitySchema = new Schema<IUniversity>(
    {
        slug: {
            type: String,
            required: [true, 'Please provide a slug (ID)'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide the university name'],
            trim: true,
        },
        officialUrl: { type: String, trim: true },
        aliases: [{ type: String, trim: true }],
        legacySlugs: [{ type: String, trim: true, lowercase: true }],
        relationshipType: {
            type: String,
            enum: ['direct_partner', 'authorized_representative', 'network_access', 'public_direct_application', 'unverified'],
            default: 'unverified',
        },
        relationshipEvidenceUrl: { type: String, trim: true },
        recognitionAuthority: { type: String, trim: true },
        recognitionSourceUrl: { type: String, trim: true },
        sourceUrls: [{ type: String, trim: true }],
        lastVerifiedAt: Date,
        verificationExpiresAt: Date,
        verificationStatus: {
            type: String,
            enum: ['verified', 'under_verification', 'expired'],
            default: 'under_verification',
        },
        location: {
            type: String,
            required: [true, 'Please provide the location string'],
        },
        country: {
            type: String,
            required: [true, 'Please provide the country'],
        },
        city: {
            type: String,
            required: [true, 'Please provide the city'],
        },
        intake: {
            type: [String],
            required: true,
        },
        degree: {
            type: [String],
            required: true,
        },
        taught: {
            type: [String],
            required: true,
        },
        rankings: {
            country: Number,
            world: Number,
            national: Number,
        },
        details: {
            majors: [String],
            tuition: { type: String, required: true },
            tuitionDetails: [String],
        },
        programs: [{
            level: { type: String, required: true, trim: true },
            name: { type: String, required: true, trim: true },
            subject: { type: String, trim: true },
            languages: [{ type: String, trim: true }],
            duration: { type: String, trim: true },
            intakes: [{ type: String, trim: true }],
            tuition: { type: String, trim: true },
            tuitionAfterScholarship: { type: String, trim: true },
            applicationDeadline: { type: String, trim: true },
            eligibility: [{ type: String, trim: true }],
            sourceUrl: { type: String, trim: true },
            status: { type: String, enum: ['active', 'planned', 'paused'], default: 'active' },
        }],
        fees: [{
            item: String,
            cost: String,
            notes: String,
            recipient: String,
            refundable: { type: String, enum: ['yes', 'no', 'conditional', ''], default: '' },
            validFor: String,
            sourceUrl: String,
        }],
        scholarships: [{
            title: String,
            type: { type: String },
            details: [String],
            amount: String,
            condition: String,
            eligiblePrograms: [String],
            coverage: String,
            renewal: String,
            deadline: String,
            sourceUrl: String,
            status: { type: String, enum: ['active', 'planned', 'closed'], default: 'active' },
        }],
        documents: [String],
        deadlines: {
            application: String,
            startDate: String,
        },
        notes: [String],
        badges: [String],
        logo: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, collection: 'universityv2s' }
);

// Prevent overwrite on hot reload
const University: Model<IUniversity> = mongoose.models.UniversityV2 || mongoose.model<IUniversity>('UniversityV2', UniversitySchema);

export default University;
