import { Schema, model } from 'mongoose';
import { IRole, PERMISSIONS } from './role.types';

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Role name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    permissions: [
      {
        type: String,
        enum: Object.values(PERMISSIONS),
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
roleSchema.index({ name: 1 });
roleSchema.index({ isActive: 1 });

export const Role = model<IRole>('Role', roleSchema);
