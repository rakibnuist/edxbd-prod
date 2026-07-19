import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: 'page' | 'blog' | 'update' | 'service' | 'destination';
  category?: string;
  tags?: string[];
  categories?: string[];
  featuredImage?: string;
  isPublished: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  author: string;
  publishedAt?: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  reviewer?: string;
  sourceUrls: string[];
  lastVerifiedAt?: Date;
  nextReviewAt?: Date;
  complianceApprovedAt?: Date;
  seoApprovedAt?: Date;
}

const ContentSchema = new Schema<IContent>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['page', 'blog', 'update', 'service', 'destination'],
    required: true
  },
  category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  categories: [{
    type: String,
    trim: true,
    enum: ['Announcement', 'University', 'Success', 'Partnership', 'News']
  }],
  featuredImage: {
    type: String,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  reviewer: { type: String, trim: true },
  sourceUrls: [{ type: String, trim: true }],
  lastVerifiedAt: Date,
  nextReviewAt: Date,
  complianceApprovedAt: Date,
  seoApprovedAt: Date,
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
// Note: slug index is automatically created due to unique: true
ContentSchema.index({ type: 1, isPublished: 1 });
ContentSchema.index({ category: 1 });
ContentSchema.index({ tags: 1 });
ContentSchema.index({ categories: 1 });
ContentSchema.index({ publishedAt: -1 });

export default mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);
