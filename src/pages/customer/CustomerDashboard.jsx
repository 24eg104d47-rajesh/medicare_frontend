import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { prescriptionService } from '../../services/prescriptionService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Package, 
  FileText, 
  MapPin, 
  Bot, 
  ArrowRight, 
  Clock, 
  ShoppingBag, 
  Plus 
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersRes, rxRes] = await Promise.all([
          orderService.getMyOrders({ page: 0, size: 5 }),
          prescriptionService.getMyPrescriptions()
        ]);
        setRecentOrders(ordersRes?.data?.content || []);
        setPrescriptions(rxRes?.data || []);
      } catch (err) {
        console.error('Failed to load customer dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading your dashboard..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
          borderRadius: '24px',
          padding: '2.5rem',
          color: '#ffffff',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: '0 12px 24px rgba(2, 132, 199, 0.2)'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
              Customer Portal
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0.25rem 0 0.5rem' }}>
              Welcome back, {user?.fullName?.split(' ')[0] || user?.firstName || 'Valued Patient'}!
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem', maxWidth: '500px' }}>
              Track medicine dispatches, manage verified medical prescriptions, and consult MediCare AI.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/medicines" className="btn" style={{ background: '#ffffff', color: '#0284c7', fontWeight: '700', borderRadius: '12px' }}>
              <ShoppingBag size={18} /> Shop Medicines
            </Link>
            <Link to="/ai-assistant" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: '700', borderRadius: '12px' }}>
              <Bot size={18} /> Ask AI Assistant
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <Link to="/orders" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Active Orders</span>
                <Package size={22} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
                {recentOrders.length}
              </div>
            </div>
          </Link>

          <Link to="/prescriptions" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Prescriptions</span>
                <FileText size={22} color="#e11d48" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
                {prescriptions.length}
              </div>
            </div>
          </Link>

          <Link to="/addresses" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Saved Addresses</span>
                <MapPin size={22} color="#0d9488" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
                Manage
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="card" style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid #e2e8f0',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Recent Orders
            </h3>
            <Link to="/orders" style={{ textDecoration: 'none', color: '#0284c7', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All Orders <ArrowRight size={16} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              No orders placed recently.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    background: '#f8fafc',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>
                        Order #{order.orderNumber || order.id}
                      </span>
                      <StatusBadge status={order.orderStatus} size="sm" />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(order.createdAt).toLocaleDateString()} • ₹{Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>

                  <Link to={`/orders/${order.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                    Track Order &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
