import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { medicineService } from '../../services/medicineService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Layers, Plus, AlertTriangle, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const BatchInventory = () => {
  const [batches, setBatches] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, EXPIRING, LOW_STOCK
  const [showAddModal, setShowAddModal] = useState(false);

  const [newBatch, setNewBatch] = useState({
    medicineId: '',
    batchNumber: '',
    manufacturingDate: '',
    expiryDate: '',
    quantityReceived: 100,
    purchasePricePerUnit: 25.0
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [medsRes, expiringRes] = await Promise.all([
        medicineService.getMedicines({ page: 0, size: 50 }),
        inventoryService.getExpiringBatches(90).catch(() => ({ data: [] }))
      ]);
      setMedicines(medsRes?.data?.content || []);

      // If activeTab is EXPIRING, show expiring batches; otherwise load all batches from first medicine or custom endpoint
      if (activeTab === 'EXPIRING') {
        setBatches(expiringRes?.data || []);
      } else {
        // We can fetch batches for each medicine or overall
        const allBatches = [];
        for (const med of (medsRes?.data?.content || []).slice(0, 10)) {
          const bRes = await inventoryService.getMedicineBatches(med.id).catch(() => ({ data: [] }));
          if (bRes?.data) {
            bRes.data.forEach(b => allBatches.push({ ...b, medicineName: med.name }));
          }
        }
        setBatches(allBatches);
      }
    } catch (err) {
      console.error('Failed to load batch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleAddBatch = async (e) => {
    e.preventDefault();
    if (!newBatch.medicineId) {
      alert('Please select a medicine');
      return;
    }
    try {
      await inventoryService.addBatch(newBatch.medicineId, newBatch);
      setShowAddModal(false);
      setNewBatch({
        medicineId: '',
        batchNumber: '',
        manufacturingDate: '',
        expiryDate: '',
        quantityReceived: 100,
        purchasePricePerUnit: 25.0
      });
      loadData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add batch');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
              FEFO Batch Inventory Control
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
              First-Expiry-First-Out pharmaceutical stock allocation and cold-chain batch management.
            </p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ borderRadius: '12px' }}>
            <Plus size={18} /> Receive New Batch
          </button>
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`btn ${activeTab === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
          >
            All Active Batches
          </button>
          <button
            onClick={() => setActiveTab('EXPIRING')}
            className={`btn ${activeTab === 'EXPIRING' ? 'btn-danger' : 'btn-outline'}`}
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
          >
            Near Expiry Alert (Within 90 Days)
          </button>
        </div>

        {/* Table Card */}
        <div className="card" style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {loading ? (
            <LoadingSpinner fullPage message="Auditing FEFO batches..." />
          ) : batches.length === 0 ? (
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <Layers size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h3>No batches found in this category</h3>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '1rem 1.5rem' }}>Batch Number</th>
                    <th style={{ padding: '1rem' }}>Medicine</th>
                    <th style={{ padding: '1rem' }}>Expiry Date (FEFO)</th>
                    <th style={{ padding: '1rem' }}>Available Units</th>
                    <th style={{ padding: '1rem' }}>Unit Cost</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b) => {
                    const expiry = new Date(b.expiryDate);
                    const isNearExpiry = (expiry - new Date()) / (1000 * 60 * 60 * 24) < 90;

                    return (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#0f172a' }}>
                          {b.batchNumber}
                        </td>
                        <td style={{ padding: '1rem', color: '#334155' }}>
                          {b.medicineName || `Medicine #${b.medicineId}`}
                        </td>
                        <td style={{ padding: '1rem', color: isNearExpiry ? '#dc2626' : '#0f172a', fontWeight: '600' }}>
                          {expiry.toLocaleDateString()}
                          {isNearExpiry && (
                            <span className="badge badge-danger" style={{ marginLeft: '8px', fontSize: '0.68rem' }}>
                              Near Expiry
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', fontWeight: '700', color: '#0f172a' }}>
                          {b.quantityAvailable} / {b.quantityReceived}
                        </td>
                        <td style={{ padding: '1rem', color: '#475569' }}>
                          ₹{Number(b.purchasePricePerUnit || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span className={`badge ${b.active ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                            {b.active ? 'Active FEFO' : 'Retired'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddModal && (
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
          <div className="card" style={{ background: '#fff', borderRadius: '24px', padding: '2rem', maxWidth: '520px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
              Receive Inventory Batch
            </h3>

            <form onSubmit={handleAddBatch}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Medicine *</label>
                <select
                  required
                  value={newBatch.medicineId}
                  onChange={(e) => setNewBatch({ ...newBatch, medicineId: e.target.value })}
                  className="form-control"
                >
                  <option value="">Select Medicine</option>
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.strength})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Batch Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL-2026-90"
                    value={newBatch.batchNumber}
                    onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={newBatch.expiryDate}
                    onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Units Received *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newBatch.quantityReceived}
                    onChange={(e) => setNewBatch({ ...newBatch, quantityReceived: parseInt(e.target.value, 10) })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Unit Cost (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newBatch.purchasePricePerUnit}
                    onChange={(e) => setNewBatch({ ...newBatch, purchasePricePerUnit: parseFloat(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Receive & Register Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchInventory;
