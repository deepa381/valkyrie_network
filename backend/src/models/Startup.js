const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
});

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Co-founder' },
  avatar: { type: String, default: null },
});

const StartupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    stage: {
      type: String,
      enum: ['Idea', 'MVP', 'Seed', 'Series A', 'Series B', 'Growth'],
      default: 'Idea',
    },
    industry: { type: String, default: 'Technology' },
    founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: [TeamMemberSchema], default: [] },
    techStack: { type: [String], default: [] },
    milestones: { type: [MilestoneSchema], default: [] },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    website: { type: String, default: '' },
    fundingGoal: { type: Number, default: 0 },
    fundingRaised: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

StartupSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

module.exports = mongoose.model('Startup', StartupSchema);
