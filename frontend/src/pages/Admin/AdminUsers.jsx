import React, { useState, useEffect } from 'react';
import { Users, Edit, Trash2, Award } from 'lucide-react';
import api from '../../services/api.js';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin users:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (window.confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) {
      try {
        await api.put(`/users/${userId}`, { role: nextRole });
        toast.success('User role updated successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update user role');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action is irreversible.')) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-5 mb-5 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Registered Users</h2>
        <p className="text-xs text-slate-400">Manage customer accounts and administrative roles</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading user accounts...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider dark:bg-slate-900/50 dark:border-slate-700">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Account Created</th>
                  <th className="p-4">System Role</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                    <td className="p-4 font-bold text-slate-850 dark:text-slate-100">{user.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-350">{user.email}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        user.role === 'admin'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleRoleToggle(user._id, user.role)}
                        className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900"
                        title="Change user role"
                      >
                        <Award className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user.role === 'admin'}
                        className="p-1.5 border border-slate-200 rounded-lg text-rose-500 hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-rose-950/20 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
