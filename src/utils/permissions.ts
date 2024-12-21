import type { Role, Permission, RolePermissions } from '../types';

export const DEFAULT_PERMISSIONS: Permission[] = [
  {
    id: 'workers-full',
    name: 'Manage Workers',
    description: 'Full access to worker management',
    module: 'workers',
    actions: ['create', 'read', 'update', 'delete']
  },
  {
    id: 'workers-read',
    name: 'View Workers',
    description: 'View worker information',
    module: 'workers',
    actions: ['read']
  },
  {
    id: 'organizations-full',
    name: 'Manage Organizations',
    description: 'Full access to organization management',
    module: 'organizations',
    actions: ['create', 'read', 'update', 'delete']
  },
  {
    id: 'organizations-read',
    name: 'View Organizations',
    description: 'View organization information',
    module: 'organizations',
    actions: ['read']
  },
  {
    id: 'services-full',
    name: 'Manage Services',
    description: 'Full access to service management',
    module: 'services',
    actions: ['create', 'read', 'update', 'delete']
  },
  {
    id: 'services-read',
    name: 'View Services',
    description: 'View service information',
    module: 'services',
    actions: ['read']
  },
  {
    id: 'users-full',
    name: 'Manage Users',
    description: 'Full access to user management',
    module: 'users',
    actions: ['create', 'read', 'update', 'delete']
  },
  {
    id: 'users-read',
    name: 'View Users',
    description: 'View user information',
    module: 'users',
    actions: ['read']
  }
];

export const ROLE_PERMISSIONS: RolePermissions = {
  admin: DEFAULT_PERMISSIONS,
  manager: DEFAULT_PERMISSIONS.filter(p => 
    p.module !== 'users' || p.actions.length === 1
  ),
  user: DEFAULT_PERMISSIONS.filter(p => 
    p.actions.length === 1 && p.actions[0] === 'read'
  )
};

export function hasPermission(
  userRole: Role,
  module: Permission['module'],
  action: Permission['actions'][number]
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions.some(p => 
    p.module === module && p.actions.includes(action)
  );
}