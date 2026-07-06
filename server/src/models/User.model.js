import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type:     String,
    required: [true, 'First name is required'],
    trim:     true,
  },
  lastName: {
    type:     String,
    required: [true, 'Last name is required'],
    trim:     true,
  },
  email: {
    type:      String,
    required:  [true, 'Email is required'],
    unique:    true,
    lowercase: true,
    trim:      true,
    match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type:     String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select:   false,
  },
  role: {
    type:    String,
    enum:    ['intern', 'admin'],
    default: 'intern',
  },
  department: {
    type:  String,
    trim:  true,
  },
  refreshToken: {
    type:   String,
    select: false,
  },
}, { timestamps: true });

//  Pre-save hook
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

//  Instance method 
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

//  Virtual: full name 
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model('User', userSchema);