import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Activity, ShieldAlert, Clock, Search } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAuditLogs({ page, size: 15 });
      setLogs(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
            System Security & Audit Trail
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            Immutable logging of sensitive operations: prescription reviews, stock modifications, and authentications.
          </p>
        </div>

        {/* Logs Table */}
        <div className="card" style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {loading ? (
            <LoadingSpinner fullPage message="Fetching compliance audit logs..." />
          ) : logs.length === 0 ? (
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <Activity size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h3>No audit entries recorded</h3>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '1rem 1.25rem' }}>Action</th>
                      <th style={{ padding: '1rem' }}>User / Initiator</th>
                      <th style={{ padding: '1rem' }}>Resource</th>
                      <th style={{ padding: '1rem' }}>Event Details</th>
                      <th style={{ padding: '1rem' }}>IP Address</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#0f172a' }}>
                          <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#334155' }}>
                          {log.userEmail || `User #${log.userId || 'System'}`}
                        </td>
                        <td style={{ padding: '1rem', color: '#64748b' }}>
                          {log.entityType ? `${log.entityType} #${log.entityId || ''}` : '-'}
                        </td>
                        <td style={{ padding: '1rem', color: '#475569' }}>
                          {log.details || 'Operation completed'}
                        </td>
                        <td style={{ padding: '1rem', color: '#64748b', fontFamily: 'monospace' }}>
                          {log.ipAddress || '127.0.0.1'}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
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

export default AuditLogs;
