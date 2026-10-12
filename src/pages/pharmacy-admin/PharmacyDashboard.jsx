import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { inventoryService } from '../../services/inventoryService';
import { prescriptionService } from '../../services/prescriptionService';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Pill, 
  AlertTriangle, 
  Clock, 
  FileCheck, 
  Truck, 
  Package, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  TrendingUp 
} from 'lucide-react';

const PharmacyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStockMeds, setLowStockMeds] = useState([]);
  const [pendingPrescriptions, setPendingPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, lowStockRes, rxRes] = await Promise.all([
          adminService.getDashboardStats().catch(() => ({ data: {} })),
          inventoryService.getLowStockMedicines(10).catch(() => ({ data: [] })),
          prescriptionService.getPendingPrescriptions({ page: 0, size: 5 }).catch(() => ({ data: { content: [] } }))
        ]);
        setStats(statsRes?.data || {});
        setLowStockMeds(lowStockRes?.data || []);
        setPendingPrescriptions(rxRes?.data?.content || []);
      } catch (err) {
        console.error('Failed to load pharmacy dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading pharmacy operations dashboard..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Operations Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '24px',
          padding: '2.5rem',
          color: '#ffffff',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          border: '1px solid #334155'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.75rem' }}>
              <ShieldCheck size={14} /> Licensed Pharmacy Operations Hub
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem' }}>
              Pharmacy Manager Dashboard
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', maxWidth: '540px' }}>
              Manage FEFO batch inventory, inspect and verify uploaded doctor prescriptions, and coordinate fulfillment.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/pharmacy-admin/prescriptions" className="btn btn-primary" style={{ borderRadius: '12px' }}>
              <FileCheck size={18} /> Review Prescriptions
            </Link>
            <Link to="/pharmacy-admin/inventory" className="btn btn-secondary" style={{ borderRadius: '12px' }}>
              <Layers size={18} /> Batch Inventory
            </Link>
          </div>
        </div>

        {/* 4 Top KPI Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Prescriptions Pending</span>
              <Clock size={22} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              {pendingPrescriptions.length}
            </div>
            <Link to="/pharmacy-admin/prescriptions" style={{ fontSize: '0.78rem', color: '#0284c7', textDecoration: 'none', fontWeight: '600', marginTop: '0.4rem', display: 'inline-block' }}>
              Review pending &rarr;
            </Link>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Low Stock Medicines</span>
              <AlertTriangle size={22} color="#ef4444" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              {lowStockMeds.length}
            </div>
            <Link to="/pharmacy-admin/inventory" style={{ fontSize: '0.78rem', color: '#ef4444', textDecoration: 'none', fontWeight: '600', marginTop: '0.4rem', display: 'inline-block' }}>
              View reorder list &rarr;
            </Link>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Total Medicines</span>
              <Pill size={22} color="#0284c7" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              {stats?.totalMedicines || 13}
            </div>
            <Link to="/pharmacy-admin/medicines" style={{ fontSize: '0.78rem', color: '#0284c7', textDecoration: 'none', fontWeight: '600', marginTop: '0.4rem', display: 'inline-block' }}>
              Manage catalogue &rarr;
            </Link>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Total Revenue</span>
              <TrendingUp size={22} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
              ₹{Number(stats?.totalRevenue || 0).toFixed(2)}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '600', marginTop: '0.4rem', display: 'inline-block' }}>
              Processed orders
            </span>
          </div>
        </div>

        {/* 2 Column Operations Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {/* Pending Prescription Queue */}
          <div className="card" style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                Prescription Review Queue
              </h3>
              <Link to="/pharmacy-admin/prescriptions" style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: '700', textDecoration: 'none' }}>
                All ({pendingPrescriptions.length}) &rarr;
              </Link>
            </div>

            {pendingPrescriptions.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                No prescriptions currently awaiting pharmacist review.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {pendingPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: '#fffbeb',
                      border: '1px solid #fef3c7',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#92400e' }}>
                        Rx #{rx.id} • Dr. {rx.doctorName || 'Prescriber'}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#b45309' }}>
                        Uploaded {new Date(rx.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link to="/pharmacy-admin/prescriptions" className="btn btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                      Inspect
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Warnings */}
          <div className="card" style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                Low Stock Threshold Alerts
              </h3>
              <Link to="/pharmacy-admin/inventory" style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: '700', textDecoration: 'none' }}>
                Inventory &rarr;
              </Link>
            </div>

            {lowStockMeds.length === 0 ? (
              <p style={{ color: '#10b981', fontSize: '0.9rem', margin: 0, fontWeight: '600' }}>
                ✓ All catalog medicines maintain sufficient batch levels.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {lowStockMeds.map((med) => (
                  <div
                    key={med.id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: '#fef2f2',
                      border: '1px solid #fee2e2',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#991b1b' }}>
                        {med.name}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#b91c1c' }}>
                        Stock: {med.totalStock} units available
                      </span>
                    </div>

                    <Link to="/pharmacy-admin/suppliers" className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                      Reorder
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
