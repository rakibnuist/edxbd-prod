import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  displayName?: string;
  location: string;
  university: string;
  program: string;
  quote: string;
  rating: number;
  image?: string;
  country: string;
  isActive: boolean;
  featured: boolean;
  academicProfile?: string;
  decisionFactors?: string;
  applicationTimeline?: string;
  serviceProvided?: string;
  studentPaid?: string;
  currentUpdate?: string;
  consentVerified: boolean;
  consentEvidenceId?: string;
  consentRecordedAt?: Date;
  consentExpiresAt?: Date;
  consentRevokedAt?: Date;
  consentImageApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  university: {
    type: String,
    required: true,
    trim: true
  },
  program: {
    type: String,
    required: true,
    trim: true
  },
  quote: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  image: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  academicProfile: { type: String, trim: true },
  decisionFactors: { type: String, trim: true },
  applicationTimeline: { type: String, trim: true },
  serviceProvided: { type: String, trim: true },
  studentPaid: { type: String, trim: true },
  currentUpdate: { type: String, trim: true },
  consentVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  consentEvidenceId: { type: String, trim: true },
  consentRecordedAt: Date,
  consentExpiresAt: Date,
  consentRevokedAt: Date,
  consentImageApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
TestimonialSchema.index({ isActive: 1, featured: -1 });
TestimonialSchema.index({ country: 1 });
TestimonialSchema.index({ rating: -1 });
TestimonialSchema.index({ country: 1, consentVerified: 1, consentExpiresAt: 1 });

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
