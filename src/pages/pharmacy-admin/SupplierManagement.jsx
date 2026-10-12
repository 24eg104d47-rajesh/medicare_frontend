import React, { useState, useEffect } from 'react';
import { supplierService } from '../../services/supplierService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Truck, Plus, Mail, Phone, MapPin, CheckCircle, Package } from 'lucide-react';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  });

  const [newPO, setNewPO] = useState({
    supplierId: '',
    notes: '',
    items: [
      { medicineId: 1, quantityOrdered: 100, unitPrice: 20.0 }
    ]
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [supRes, poRes] = await Promise.all([
        supplierService.getAllSuppliers().catch(() => ({ data: [] })),
        supplierService.getAllPurchaseOrders({ page: 0, size: 20 }).catch(() => ({ data: { content: [] } }))
      ]);
      setSuppliers(supRes?.data || []);
      setPurchaseOrders(poRes?.data?.content || []);
    } catch (err) {
      console.error('Failed to load supplier data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    try {
      await supplierService.createSupplier(newSupplier);
      setShowSupplierModal(false);
      setNewSupplier({ name: '', contactPerson: '', email: '', phone: '', address: '', city: '', state: '' });
      loadData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to save supplier');
    }
  };

  const handleSavePO = async (e) => {
    e.preventDefault();
    if (!newPO.supplierId) {
      alert('Please select a supplier');
      return;
    }
    try {
      await supplierService.createPurchaseOrder(newPO);
      setShowPOModal(false);
      alert('Purchase order created successfully!');
      loadData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to create purchase order');
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading pharmaceutical suppliers..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
              Pharmaceutical Suppliers & Procurement
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
              Manage certified pharma manufacturers and draft purchase orders.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setShowSupplierModal(true)} className="btn btn-primary" style={{ borderRadius: '12px' }}>
              <Plus size={18} /> Add Supplier
            </button>
            <button onClick={() => setShowPOModal(true)} className="btn btn-secondary" style={{ borderRadius: '12px' }}>
              <Package size={18} /> New Purchase Order
            </button>
          </div>
        </div>

        {/* Suppliers Grid */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
          Certified Suppliers ({suppliers.length})
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {suppliers.map((s) => (
            <div
              key={s.id}
              className="card"
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>
                    {s.name}
                  </span>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    Active Vendor
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  Contact: <strong>{s.contactPerson || 'Vendor Rep'}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: '#475569' }}>
                  {s.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} color="#0284c7" /> {s.email}</div>}
                  {s.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} color="#0284c7" /> {s.phone}</div>}
                  {s.city && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#0284c7" /> {s.city}, {s.state}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Purchase Orders Table */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
          Recent Purchase Orders ({purchaseOrders.length})
        </h3>

        <div className="card" style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {purchaseOrders.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
              No purchase orders recorded yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '1rem 1.5rem' }}>PO Number</th>
                    <th style={{ padding: '1rem' }}>Supplier</th>
                    <th style={{ padding: '1rem' }}>Date</th>
                    <th style={{ padding: '1rem' }}>Amount</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#0f172a' }}>
                        #{po.poNumber || po.id}
                      </td>
                      <td style={{ padding: '1rem', color: '#334155' }}>
                        {po.supplierName || `Supplier #${po.supplierId}`}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        {new Date(po.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '700', color: '#0f172a' }}>
                        ₹{Number(po.totalAmount || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                          {po.status || 'DRAFT'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showSupplierModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="card" style={{ background: '#fff', borderRadius: '24px', padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
              Register Pharmaceutical Supplier
            </h3>

            <form onSubmit={handleSaveSupplier}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Supplier / Company Name *</label>
                <input
                  type="text"
                  required
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Contact Person</label>
                  <input
                    type="text"
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Phone</label>
                  <input
                    type="tel"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Email</label>
                <input
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowSupplierModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {showPOModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="card" style={{ background: '#fff', borderRadius: '24px', padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
              Create Purchase Order
            </h3>

            <form onSubmit={handleSavePO}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Select Supplier *</label>
                <select
                  required
                  value={newPO.supplierId}
                  onChange={(e) => setNewPO({ ...newPO, supplierId: e.target.value })}
                  className="form-control"
                >
                  <option value="">Select Vendor</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Procurement Notes</label>
                <textarea
                  rows="3"
                  placeholder="Notes for order fulfillment, cold-chain delivery requirement..."
                  value={newPO.notes}
                  onChange={(e) => setNewPO({ ...newPO, notes: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowPOModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Draft Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;
