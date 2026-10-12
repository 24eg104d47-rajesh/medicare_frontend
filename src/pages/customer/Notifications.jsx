import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Bell, Check, Clock, AlertCircle } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getMyNotifications({ page: 0, size: 20 });
      setNotifications(res.data?.content || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Fetching notifications..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
              Notifications
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
              Stay updated on order status changes, prescription reviews & offers.
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
            >
              <Check size={16} /> Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="card" style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <Bell size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              No notifications yet
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              You're all caught up! Order status updates and prescription alerts will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                className="card"
                style={{
                  background: n.isRead ? '#ffffff' : '#f0f9ff',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  border: n.isRead ? '1px solid #e2e8f0' : '1px solid #bae6fd',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: n.isRead ? '#f1f5f9' : '#e0f2fe',
                    color: n.isRead ? '#64748b' : '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bell size={18} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                      {n.title || 'System Notification'}
                    </h4>
                    <p style={{ margin: '0 0 0.35rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', flexShrink: 0 }}
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
