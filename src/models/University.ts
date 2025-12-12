
import mongoose, { Document, Model, Schema } from 'mongoose';

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
        fees: [{
            item: String,
            cost: String,
            notes: String,
        }],
        scholarships: [{
            title: String,
            type: { type: String },
            details: [String],
            amount: String,
            condition: String,
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
