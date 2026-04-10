const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  refreshToken: { type: String, default: null },
}, { timestamps: true });

// Never store plain password — hash before save
userSchema.pre('save', async function() {
  if (!this.isModified('passwordHash')) return;
  if (this.passwordHash.startsWith('$2')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

userSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);