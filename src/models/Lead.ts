import mongoose, { Document, Schema } from 'mongoose';

// Evidence-First Plan, Section 15 — 16-stage CRM pipeline.
export const CRM_STAGES = [
  'new',
  'contacted',
  'assessment_scheduled',
  'assessment_completed',
  'decision_report_delivered',
  'shortlisted',
  'documents_pending',
  'application_submitted',
  'offer_received',
  'visa_preparation',
  'visa_submitted',
  'visa_approved',
  'visa_refused',
  'pre_departure',
  'enrolled',
  'alumni',
  // Terminal / housekeeping states kept alongside the pipeline.
  'not_interested',
  'closed',
] as const;
export type CrmStage = (typeof CRM_STAGES)[number];

// Routing outcomes (Evidence-First Plan, Section 15 lead-routing rules).
export const LEAD_TEAMS = ['china', 'wave1_owner', 'launching_interest', 'senior_review', 'general'] as const;
export type LeadTeam = (typeof LEAD_TEAMS)[number];

export interface IAssessment {
  academicLevel?: string;
  academicResults?: string;
  subject?: string;
  budget?: string;
  intake?: string;
  language?: string;
  careerGoal?: string;
  preferredCountries?: string[];
}

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  country: string;
  program: string;
  message?: string;
  status: CrmStage;
  source: string;
  leadType: 'contact' | 'assessment' | 'partnership' | 'campaign';
  destinationInterest?: string;
  assignedTeam: LeadTeam;
  assignedTo?: string;
  riskFlag: boolean;
  medicalProgram: boolean;
  assessment?: IAssessment;
  notes?: string;
  consentTimestamp: Date;
  consentPolicyVersion: string;
  landingPage?: string;
  utm?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  program: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: [...CRM_STAGES,
      // Legacy statuses retained so historical leads still validate on write.
      'consultation_scheduled', 'consultation_completed', 'qualified',
      'application_started', 'admission_received', 'visa_applied', 'converted'],
    default: 'new'
  },
  source: {
    type: String,
    required: true,
    trim: true
  },
  leadType: {
    type: String,
    enum: ['contact', 'assessment', 'partnership', 'campaign'],
    default: 'contact'
  },
  destinationInterest: {
    type: String,
    trim: true
  },
  assignedTeam: {
    type: String,
    enum: LEAD_TEAMS,
    default: 'general'
  },
  assignedTo: {
    type: String,
    trim: true
  },
  riskFlag: {
    type: Boolean,
    default: false
  },
  medicalProgram: {
    type: Boolean,
    default: false
  },
  assessment: {
    academicLevel: { type: String, trim: true },
    academicResults: { type: String, trim: true },
    subject: { type: String, trim: true },
    budget: { type: String, trim: true },
    intake: { type: String, trim: true },
    language: { type: String, trim: true },
    careerGoal: { type: String, trim: true },
    preferredCountries: { type: [String], default: undefined },
  },
  notes: {
    type: String,
    trim: true
  },
  consentTimestamp: {
    type: Date,
    required: true
  },
  consentPolicyVersion: {
    type: String,
    required: true,
    trim: true
  },
  landingPage: {
    type: String,
    trim: true
  },
  utm: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for better query performance
LeadSchema.index({ email: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ assignedTeam: 1, status: 1 });
LeadSchema.index({ destinationInterest: 1 });

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
