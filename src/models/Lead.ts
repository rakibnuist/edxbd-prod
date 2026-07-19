import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
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
    enum: ['new', 'contacted', 'consultation_scheduled', 'consultation_completed', 'qualified', 'application_started', 'application_submitted', 'admission_received', 'visa_applied', 'visa_approved', 'enrolled', 'converted', 'not_interested', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    required: true,
    trim: true
  },
  assignedTo: {
    type: String,
    trim: true
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

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
