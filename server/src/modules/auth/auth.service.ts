// src/modules/auth/auth.service.ts
import { Types } from 'mongoose';
import jwt, { SignOptions } from 'jsonwebtoken';
import httpStatus from 'http-status';

import { User } from '../user/user.model';
import { IUserDoc } from '../user/user.types';
import { IRole } from '../role/role.types';
import { LoginRequest, RegisterRequest, AuthResponse, AuthUserResponse } from './auth.types';
import { ApiError } from '../../utils/ApiError';
import { JWT_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION } from '../../config/env';
import ms from 'ms';

/** ⬇️ helper: cast a role (ObjectId | IRole) to ObjectId */
const toObjectId = (role: Types.ObjectId | IRole): Types.ObjectId => {
  if (role instanceof Types.ObjectId) {
    return role;
  }
  // If it's an IRole object, get its _id
  return role._id as Types.ObjectId;
};

/** ⬇️ helper: convert any "roles" array to ObjectId[] */
const normalizeRoles = (roles: Types.ObjectId[] | IRole[]): Types.ObjectId[] => {
  return roles.map((role) => toObjectId(role));
};

export class AuthService {
  /* ---------------------------------------------------------------------- */
  /* LOGIN                                                                  */
  /* ---------------------------------------------------------------------- */
  static async login(loginData: LoginRequest): Promise<AuthResponse> {
    const user = (await User.findOne({ email: loginData.email }).select(
      '+password'
    )) as IUserDoc | null;
    if (!user || !(await user.comparePassword(loginData.password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    if (!user.isActive) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Account is deactivated');
    }

    const tokens = this.generateAuthTokens(user);
    return {
      user: this.buildUserResponse(user),
      tokens,
    };
  }

  /* ---------------------------------------------------------------------- */
  /* REGISTER                                                                */
  /* ---------------------------------------------------------------------- */
  static async register(registerData: RegisterRequest): Promise<AuthResponse> {
    if (await User.exists({ email: registerData.email })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    // ⬇️ Create user with empty roles array for now, or fetch default role
    const user = (await User.create({
      ...registerData,
      roles: [], // Start with empty roles, assign roles separately
    })) as IUserDoc;

    const tokens = this.generateAuthTokens(user);
    return {
      user: this.buildUserResponse(user),
      tokens,
    };
  }

  /* ---------------------------------------------------------------------- */
  /* REFRESH TOKEN                                                           */
  /* ---------------------------------------------------------------------- */
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = jwt.verify(refreshToken, JWT_SECRET as string) as {
        userId: string;
        roles: string[];
      };

      const user = (await User.findById(payload.userId)) as IUserDoc | null;
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
      }

      const tokens = this.generateAuthTokens(user);
      return {
        user: this.buildUserResponse(user),
        tokens,
      };
    } catch {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }
  }

  /* ---------------------------------------------------------------------- */
  /* PRIVATE UTILS                                                           */
  /* ---------------------------------------------------------------------- */
  private static buildUserResponse(user: IUserDoc): AuthUserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: normalizeRoles(user.roles),
    };
  }

  private static generateAuthTokens(user: IUserDoc) {
    const roleIds = normalizeRoles(user.roles).map((id) => id.toString());
    const userId = user._id.toString();

    // Type assertion (if you're confident the strings are valid)
    const access = jwt.sign({ userId, roles: roleIds }, JWT_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRATION as ms.StringValue,
    });

    const refresh = jwt.sign({ userId, roles: roleIds }, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRATION as ms.StringValue,
    });

    return { access, refresh };
  }
}
