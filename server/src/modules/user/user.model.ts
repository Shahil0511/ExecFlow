import mongoose, { Schema, Types, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './user.types';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ roles: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ firstName: 1, lastName: 1 });

// Pre-save hook to assign default role if no roles are provided
userSchema.pre('save', async function (next) {
  // Only assign default role if this is a new user and no roles are set
  if (this.isNew && (!this.roles || this.roles.length === 0)) {
    try {
      const defaultRole = await getDefaultRole();
      if (defaultRole) {
        this.roles = [defaultRole];
      }
    } catch (error: any) {
      console.error('Error assigning default role:', error);
      return next(error);
    }
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Helper function to get default role
async function getDefaultRole(): Promise<Types.ObjectId | null> {
  try {
    // Try to find Executive Assistant role first
    let defaultRole = await mongoose.model('Role').findOne({
      name: 'Executive Assistant',
      isActive: true,
    });

    // If not found, try to find Admin role as fallback
    if (!defaultRole) {
      defaultRole = await mongoose.model('Role').findOne({
        name: 'Admin',
        isActive: true,
      });
    }

    // If still not found, create Executive Assistant role
    if (!defaultRole) {
      const { PERMISSIONS } = await import('../role/role.types');
      defaultRole = await mongoose.model('Role').create({
        name: 'Executive Assistant',
        description: 'Default role for executive assistants',
        permissions: [
          PERMISSIONS.USER_READ,
          PERMISSIONS.TODO_READ,
          PERMISSIONS.TODO_WRITE,
          PERMISSIONS.TODO_DELETE,
        ],
        isActive: true,
      });
    }

    return defaultRole._id;
  } catch (error) {
    console.error('Error getting default role:', error);
    return null;
  }
}

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name method
userSchema.methods.getFullName = function (): string {
  return `${this.firstName} ${this.lastName}`;
};

userSchema.statics.isEmailTaken = async function (
  email: string,
  excludeUserId?: Types.ObjectId
): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

// Static method to create user with default role
userSchema.statics.createWithDefaultRole = async function (userData: any) {
  const defaultRole = await getDefaultRole();

  const userToCreate = {
    ...userData,
    roles: userData.roles && userData.roles.length > 0 ? userData.roles : [defaultRole],
  };

  return this.create(userToCreate);
};

userSchema.post('save', function (doc, next) {
  console.log('User saved with roles:', doc.roles);
  next();
});

export const User = model<IUser>('User', userSchema);
