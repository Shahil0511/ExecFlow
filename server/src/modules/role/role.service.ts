import { Role } from './role.model';
import { IRole, CreateRoleRequest, UpdateRoleRequest } from './role.types';
import { AppError } from '@/utils/app-error';

export class RoleService {
  async createRole(data: CreateRoleRequest): Promise<IRole> {
    const existingRole = await Role.findOne({ name: data.name });
    if (existingRole) {
      throw new AppError('Role with this name already exists', 400);
    }

    const role = new Role(data);
    return await role.save();
  }

  async getRoles(): Promise<IRole[]> {
    return await Role.find({ isActive: true }).sort({ name: 1 });
  }

  async getAllRoles(): Promise<IRole[]> {
    return await Role.find().sort({ name: 1 });
  }

  async getRoleById(id: string): Promise<IRole> {
    const role = await Role.findById(id);
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    return role;
  }

  async updateRole(id: string, data: UpdateRoleRequest): Promise<IRole> {
    if (data.name) {
      const existingRole = await Role.findOne({ name: data.name, _id: { $ne: id } });
      if (existingRole) {
        throw new AppError('Role with this name already exists', 400);
      }
    }

    const role = await Role.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    return role;
  }

  async deleteRole(id: string): Promise<void> {
    const role = await Role.findById(id);
    if (!role) {
      throw new AppError('Role not found', 404);
    }

    // Check if role is being used by any users
    const { User } = await import('@/modules/user/user.model');
    const usersWithRole = await User.countDocuments({ roles: id });

    if (usersWithRole > 0) {
      throw new AppError('Cannot delete role that is assigned to users', 400);
    }

    await Role.findByIdAndDelete(id);
  }

  async initializeDefaultRoles(): Promise<void> {
    const adminRole = await Role.findOne({ name: 'Admin' });
    const eaRole = await Role.findOne({ name: 'EA' });

    if (!adminRole) {
      await Role.create({
        name: 'Admin',
        description: 'Full system administrator with all permissions',
        permissions: Object.values(require('./role.types').PERMISSIONS),
      });
    }

    if (!eaRole) {
      await Role.create({
        name: 'EA',
        description: 'Executive Assistant with limited administrative permissions',
        permissions: [
          'user:read',
          'user:write',
          'todo:read',
          'todo:write',
          'todo:delete',
          'role:read',
        ],
      });
    }
  }
}
