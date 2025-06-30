import { Request, Response } from 'express';
import { RoleService } from './role.service';
import { CreateRoleRequest, UpdateRoleRequest } from './role.types';

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  createRole = async (req: Request<{}, {}, CreateRoleRequest>, res: Response): Promise<void> => {
    const role = await this.roleService.createRole(req.body);
    res.status(201).json({
      status: 'success',
      data: { role },
    });
  };

  getRoles = async (req: Request, res: Response): Promise<void> => {
    const roles = await this.roleService.getRoles();
    res.status(200).json({
      status: 'success',
      data: { roles },
    });
  };

  getAllRoles = async (req: Request, res: Response): Promise<void> => {
    const roles = await this.roleService.getAllRoles();
    res.status(200).json({
      status: 'success',
      data: { roles },
    });
  };

  getRoleById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const role = await this.roleService.getRoleById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { role },
    });
  };

  updateRole = async (
    req: Request<{ id: string }, {}, UpdateRoleRequest>,
    res: Response
  ): Promise<void> => {
    const role = await this.roleService.updateRole(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: { role },
    });
  };

  deleteRole = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    await this.roleService.deleteRole(req.params.id);
    res.status(204).send();
  };
}
