import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Users, Shield, UserCheck, UserX, Search } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers({ page, size: 10 });
      const raw = res?.data;
      const list = Array.isArray(raw) ? raw : (raw?.content || []);
      setUsers(list);
      setTotalPages(raw?.totalPages || Math.ceil(list.length / 10) || 1);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      await adminService.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      setUpdatingId(userId);
      await adminService.updateUserStatus(userId, !currentStatus);
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to toggle status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
            User Access & Roles
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            Manage registered accounts, grant pharmacist or administrative privileges, and toggle active status.
          </p>
        </div>

        {/* Users Table */}
        <div className="card" style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {loading ? (
            <LoadingSpinner fullPage message="Fetching user accounts..." />
          ) : users.length === 0 ? (
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <Users size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h3>No users found</h3>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '1rem 1.5rem' }}>User</th>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>Current Role</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isUpdating = updatingId === u.id;
                      const isActive = u.enabled !== undefined ? u.enabled : (u.active !== undefined ? u.active : true);
                      const displayName = u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'User';

                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#0f172a' }}>
                            {displayName}
                          </td>
                          <td style={{ padding: '1rem', color: '#475569' }}>
                            {u.email}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <select
                              value={u.role}
                              disabled={isUpdating}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="form-control"
                              style={{ width: 'auto', fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                            >
                              <option value="CUSTOMER">CUSTOMER</option>
                              <option value="PHARMACY_ADMIN">PHARMACY_ADMIN</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                              {isActive ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                            <button
                              onClick={() => handleStatusToggle(u.id, isActive)}
                              disabled={isUpdating}
                              className={`btn ${isActive ? 'btn-outline' : 'btn-primary'}`}
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                            >
                              {isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
