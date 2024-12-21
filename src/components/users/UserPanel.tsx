import React, { useState } from 'react';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { Users, UserPlus } from 'lucide-react';
import type { User, Role } from '../../types';

interface UserPanelProps {
  users: User[];
  currentUser: User;
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserPanel({
  users,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}: UserPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSubmit = (userData: Omit<User, 'id'>) => {
    if (editingUser) {
      onUpdateUser({ ...userData, id: editingUser.id });
    } else {
      onAddUser(userData);
    }
    setShowForm(false);
    setEditingUser(null);
  };

  const canManageUsers = currentUser.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        </div>
        {canManageUsers && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            {showForm ? 'Cancel' : 'Add User'}
          </button>
        )}
      </div>

      {showForm && canManageUsers && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <UserForm
            onSubmit={handleSubmit}
            initialData={editingUser}
          />
        </div>
      )}

      <UserList
        users={users}
        currentUser={currentUser}
        onEdit={handleEdit}
        onDelete={onDeleteUser}
      />
    </div>
  );
}