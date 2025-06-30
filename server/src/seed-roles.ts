import mongoose from 'mongoose';
import { Role } from './modules/role/role.model';
import dotenv from 'dotenv';
import { PERMISSIONS } from './modules/role/role.types';

dotenv.config();

const ROLES = [
  {
    name: 'Admin',
    description: 'System Administrator with full access',
    permissions: Object.values(PERMISSIONS), // All permissions
    isActive: true,
  },
  {
    name: 'Executive Assistant',
    description: 'Default Executive Assistant role',
    permissions: [
      PERMISSIONS.USER_READ,
      PERMISSIONS.TODO_READ,
      PERMISSIONS.TODO_WRITE,
      PERMISSIONS.TODO_DELETE,
    ],
    isActive: true,
    isDefault: true, // Mark as default role
  },
];

async function seedRoles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    // Delete existing roles if needed
    await Role.deleteMany({});

    // Create roles
    const roles = await Role.insertMany(ROLES);

    console.log(
      'Created roles:',
      roles.map((r) => r.name)
    );
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedRoles();
