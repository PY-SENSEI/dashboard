import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
      default: 'new',
    },
    value: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      enum: ['website', 'referral', 'social', 'email', 'phone', 'event', 'partner'],
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    lastContact: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdBy: 1 });
leadSchema.index({ assignedTo: 1 });

export default mongoose.model('Lead', leadSchema);
