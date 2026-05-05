const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['grant', 'accelerator', 'investment'],
      required: true,
    },
    title: { type: String, required: true },
    provider: { type: String, required: true },
    amount: { type: String, required: true },
    deadline: { type: String, default: 'Rolling' },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    goals: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    contactEmail: { type: String, default: '' },
    applyUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', OpportunitySchema);
