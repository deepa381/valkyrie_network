const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['founder', 'investor', 'mentor'],
      default: 'founder',
    },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    avatar: { type: String, default: null },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    goals: { type: [String], default: [] },
    experience: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Compare password
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Safe public profile (no passwordHash)
UserSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  obj.id = obj._id.toString();
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
