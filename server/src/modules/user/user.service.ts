import mongoose, { Types } from 'mongoose';
import { User } from './user.model';
import { Role } from '../role/role.model';
import {
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserQueryParams,
} from './user.types';
import { createUserSchema, updateUserSchema, changePasswordSchema } from './user.validation';
import { IUser } from './user.types';
import { PERMISSIONS } from '../role/role.types';

export class UserService {
  /**
   * Get or create default role
   */
  private static async getDefaultRole(): Promise<Types.ObjectId> {
    // Try to find Executive Assistant role first
    let defaultRole = await Role.findOne({ name: 'Executive Assistant' });

    // If not found, try to find Admin role as fallback
    if (!defaultRole) {
      defaultRole = await Role.findOne({ name: 'Admin' });
    }

    // If still not found, create Executive Assistant role
    if (!defaultRole) {
      defaultRole = await Role.create({
        name: 'Executive Assistant',
        description: 'Default role for executive assistants',
        permissions: [PERMISSIONS.TODO_READ, PERMISSIONS.TODO_WRITE, PERMISSIONS.TODO_MANAGE],
        isActive: true,
      });
    }

    return defaultRole._id instanceof Types.ObjectId
      ? defaultRole._id
      : new Types.ObjectId(defaultRole._id.toString());
  }

  /**
   * Create a new user
   */
  static async createUser(data: CreateUserRequest): Promise<IUser> {
    await createUserSchema.parseAsync(data);

    // 1. Check if email exists
    if (await User.findOne({ email: data.email })) {
      throw new Error('Email already in use');
    }

    // 2. Get the EA role (we'll ensure it exists)
    const eaRole = await Role.findOne({ name: 'Executive Assistant' });
    if (!eaRole) {
      // Emergency fallback - create if missing
      const newRole = await Role.create({
        name: 'Executive Assistant',
        description: 'Default Executive Assistant role',
        permissions: [
          PERMISSIONS.USER_READ,
          PERMISSIONS.TODO_READ,
          PERMISSIONS.TODO_WRITE,
          PERMISSIONS.TODO_DELETE,
        ],
        isActive: true,
      });
      console.warn('Created missing EA role:', newRole._id);
    }

    // 3. Create user with explicit role assignment
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      roles: [eaRole!._id], // Non-null assertion since we ensured it exists
      isActive: true,
    });

    // 4. Verify the created user
    const createdUser = await User.findById(user._id).populate('roles');
    if (!createdUser) {
      throw new Error('User creation verification failed');
    }

    console.log('Created user with roles:', {
      userId: createdUser._id,
    });

    return createdUser.toObject();
  }

  /**
   * Get all users
   */
  static async getUsers(query: UserQueryParams): Promise<IUser[]> {
    const { isActive, role, search } = query;

    const filter: any = {};
    if (isActive !== undefined) filter.isActive = isActive;
    if (role) filter.roles = new Types.ObjectId(role);
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).populate('roles').lean();
    return users;
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: Types.ObjectId | string): Promise<IUser | null> {
    const userId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const user = await User.findById(userId).populate('roles').lean();
    return user;
  }

  /**
   * Update user
   */
  static async updateUser(
    id: Types.ObjectId | string,
    data: UpdateUserRequest
  ): Promise<IUser | null> {
    await updateUserSchema.parseAsync(data);

    const userId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const user = await User.findById(userId);
    if (!user) return null;

    if (data.email && data.email !== user.email) {
      if (await User.findOne({ email: data.email })) {
        throw new Error('Email already in use');
      }
      user.email = data.email;
    }

    if (data.roles) {
      const roleIds = data.roles.map((id) => new Types.ObjectId(id));
      const rolesExist = await Role.countDocuments({ _id: { $in: roleIds } });
      if (rolesExist !== roleIds.length) {
        throw new Error('One or more roles do not exist');
      }
      user.roles = roleIds;
    }

    if (data.firstName) user.firstName = data.firstName;
    if (data.lastName) user.lastName = data.lastName;
    if (data.isActive !== undefined) user.isActive = data.isActive;

    await user.save();
    return user.toObject();
  }

  /**
   * Delete user (soft delete)
   */
  static async deleteUser(id: Types.ObjectId | string): Promise<boolean> {
    const userId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const result = await User.findByIdAndUpdate(userId, { isActive: false });
    return !!result;
  }

  /**
   * Change user password
   */
  static async changePassword(
    id: Types.ObjectId | string,
    data: ChangePasswordRequest
  ): Promise<boolean> {
    await changePasswordSchema.parseAsync(data);

    const userId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const user = await User.findById(userId).select('+password');
    if (!user) throw new Error('User not found');

    const isMatch = await user.comparePassword(data.currentPassword);
    if (!isMatch) throw new Error('Current password is incorrect');

    user.password = data.newPassword;
    await user.save();
    return true;
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select('+password').lean();
  }

  /**
   * Fix existing users without default role
   */
  static async fixUsersWithoutDefaultRole(): Promise<void> {
    const defaultRoleId = await this.getDefaultRole();

    // Find users with empty roles array
    const usersWithoutRoles = await User.find({
      $or: [{ roles: { $exists: false } }, { roles: { $size: 0 } }],
    });

    // Update each user to have the default role
    for (const user of usersWithoutRoles) {
      user.roles = [defaultRoleId];
      await user.save();
      console.log(`Fixed user ${user.email} - added default role`);
    }
  }
}
