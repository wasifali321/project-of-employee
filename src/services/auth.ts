import type { User as IUser, Role as IRole } from '../types/index';

interface LoginCredentials {
  username: string;
  password?: string;
}

const rolePermissions: Record<IRole, string[]> = {
  admin: ['*'],
  manager: ['read.*', 'write.transactions', 'write.workers'],
  user: ['read.transactions', 'read.workers']
};

export const authService = {
  async login({ username }: LoginCredentials): Promise<IUser> {
    console.log('Login attempt:', { username });
    
    // Simplified login - just check username
    if (username === 'admin') {
      const user: IUser = {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        permissions: ['*'],
        isActive: true,
        lastLogin: new Date().toISOString()
      };
      console.log('Login successful:', user);
      localStorage.setItem('auth_token', 'temp_token');
      return user;
    }
    console.log('Login failed: Invalid username');
    throw new Error('Invalid username');
  },

  logout() {
    console.log('Logging out');
    localStorage.removeItem('auth_token');
  },

  hasPermission(role: IRole, permission: string): boolean {
    const permissions = rolePermissions[role];
    return permissions.includes('*') || permissions.includes(permission);
  }
};