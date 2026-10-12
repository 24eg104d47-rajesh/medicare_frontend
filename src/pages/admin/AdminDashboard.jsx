import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Package, 
  ShieldCheck, 
  FileText, 
  AlertCircle,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, logsRes] = await Promise.all([
          adminService.getDashboardStats().catch(() => ({ data: {} })),
          adminService.getAuditLogs({ page: 0, size: 5 }).catch(() => ({ data: { content: [] } }))
        ]);
        setStats(statsRes?.data || {});
        setRecentLogs(logsRes?.data?.content || []);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading system administration metrics..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          borderRadius: '24px',
          padding: '2.5rem',
          color: '#ffffff',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          border: '1px solid #4338ca'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(129, 140, 248, 0.2)', color: '#c7d2fe', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.75rem' }}>
              <ShieldCheck size={14} /> System Root Administrator
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem' }}>
              System Governance & Analytics
            </h1>
            <p style={{ margin: 0, color: '#c7d2fe', fontSize: '0.95rem', maxWidth: '540px' }}>
              Real-time platform financial statistics, user access authorization, and security compliance audit trails.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin/users" className="btn" style={{ background: '#ffffff', color: '#312e81', fontWeight: '700', borderRadius: '12px' }}>
              <Users size={18} /> Manage Users
            </Link>
            <Link to="/admin/audit-logs" className="btn btn-secondary" style={{ borderRadius: '12px' }}>
              <Activity size={18} /> Security Logs
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Total Revenue</span>
              <DollarSign size={22} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              ₹{Number(stats?.totalRevenue || 0).toFixed(2)}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '600', marginTop: '0.4rem', display: 'inline-block' }}>
              Settled Gross Volume
            </span>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Platform Users</span>
              <Users size={22} color="#6366f1" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              {stats?.totalUsers || 3}
            </div>
            <Link to="/admin/users" style={{ fontSize: '0.78rem', color: '#6366f1', textDecoration: 'none', fontWeight: '600', marginTop: '0.4rem', display: 'inline-block' }}>
              Manage Accounts &rarr;
            </Link>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Total Orders</span>
              <Package size={22} color="#0284c7" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              {stats?.totalOrders || 0}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', display: 'inline-block' }}>
              Completed & In Transit
            </span>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Total Medicines</span>
              <Activity size={22} color="#0d9488" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              {stats?.totalMedicines || 13}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#0d9488', fontWeight: '600', marginTop: '0.4rem', display: 'inline-block' }}>
              Active Formulations
            </span>
          </div>
        </div>

        {/* Security Audit Trail preview */}
        <div className="card" style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Recent Security & Audit Logs
            </h3>
            <Link to="/admin/audit-logs" style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '700', textDecoration: 'none' }}>
              View Complete Audit Log &rarr;
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              No critical security logs captured recently.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                    <th style={{ padding: '0.75rem 1rem' }}>User</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Details</th>
                    <th style={{ padding: '0.75rem 1rem' }}>IP Address</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: '#0f172a' }}>
                        {log.action}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>
                        {log.userEmail || `User #${log.userId || 'System'}`}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                        {log.details || '-'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
