import React, { useState, useEffect } from 'react';
import { medicineService, categoryService } from '../../services/medicineService';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Pill, Plus, Search, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    categoryId: '',
    dosageForm: 'Tablet',
    strength: '500mg',
    price: '',
    mrp: '',
    prescriptionRequired: false,
    description: '',
    sideEffects: '',
    precautions: '',
    storageInstructions: 'Store below 25°C in a dry place.',
    usageInstructions: 'As directed by physician.',
    active: true
  });

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const params = { page, size: 10 };
      if (search) params.search = search;
      const res = await medicineService.getMedicines(params);
      setMedicines(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load medicines', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoryService.getAllCategories().then(res => setCategories(res.data || []));
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [page, search]);

  const handleOpenAdd = () => {
    setEditingMed(null);
    setFormData({
      name: '',
      genericName: '',
      manufacturer: '',
      categoryId: categories[0]?.id || '',
      dosageForm: 'Tablet',
      strength: '500mg',
      price: '',
      mrp: '',
      prescriptionRequired: false,
      description: '',
      sideEffects: '',
      precautions: '',
      storageInstructions: 'Store below 25°C in a dry place.',
      usageInstructions: 'As directed by physician.',
      active: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (med) => {
    setEditingMed(med);
    setFormData({
      name: med.name,
      genericName: med.genericName || '',
      manufacturer: med.manufacturer || '',
      categoryId: med.categoryId || '',
      dosageForm: med.dosageForm || 'Tablet',
      strength: med.strength || '',
      price: med.price,
      mrp: med.mrp || med.price,
      prescriptionRequired: med.prescriptionRequired,
      description: med.description || '',
      sideEffects: med.sideEffects || '',
      precautions: med.precautions || '',
      storageInstructions: med.storageInstructions || '',
      usageInstructions: med.usageInstructions || '',
      active: med.active !== false
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingMed) {
        await medicineService.updateMedicine(editingMed.id, formData);
      } else {
        await medicineService.createMedicine(formData);
      }
      setShowModal(false);
      fetchMedicines();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to save medicine');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete/deactivate this medicine?')) return;
    try {
      await medicineService.deleteMedicine(id);
      fetchMedicines();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete medicine');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
              Medicine Catalogue Management
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
              Add, update and configure active pharmaceutical items and scheduling.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary" style={{ borderRadius: '12px' }}>
            <Plus size={18} /> Add New Medicine
          </button>
        </div>

        {/* Filter bar */}
        <div className="card" style={{ background: '#fff', borderRadius: '16px', padding: '1rem 1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search by name, salt, or brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>
        </div>

        {/* Table Card */}
        <div className="card" style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {loading ? (
            <LoadingSpinner fullPage message="Fetching catalogue..." />
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '1rem 1.5rem' }}>Medicine</th>
                      <th style={{ padding: '1rem' }}>Category</th>
                      <th style={{ padding: '1rem' }}>Price / MRP</th>
                      <th style={{ padding: '1rem' }}>Stock</th>
                      <th style={{ padding: '1rem' }}>Schedule</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med) => (
                      <tr key={med.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{med.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            {med.strength} • {med.dosageForm} • {med.manufacturer}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#475569' }}>
                          {med.categoryName || 'General'}
                        </td>
                        <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '600' }}>
                          ₹{Number(med.price).toFixed(2)}
                          {med.mrp && <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '6px' }}>(₹{Number(med.mrp).toFixed(2)})</span>}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span className={`badge ${(med.totalStock ?? med.availableStock ?? 0) > 0 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                            {med.totalStock ?? med.availableStock ?? 0} units
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {(med.prescriptionRequired ?? med.requiresPrescription) ? (
                            <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>℞ Rx Required</span>
                          ) : (
                            <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>OTC</span>
                          )}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenEdit(med)}
                              style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', padding: '0.3rem' }}
                              title="Edit Medicine"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(med.id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.3rem' }}
                              title="Delete Medicine"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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

      {/* Add / Edit Modal */}
      {showModal && (
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
          padding: '1rem',
          overflowY: 'auto'
        }}>
          <div className="card" style={{ background: '#fff', borderRadius: '24px', padding: '2rem', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
              {editingMed ? 'Edit Medicine' : 'Add New Medicine'}
            </h3>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Brand / Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Generic Composition *</label>
                  <input
                    type="text"
                    required
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="form-control"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Form</label>
                  <select
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                    className="form-control"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Strength</label>
                  <input
                    type="text"
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', color: '#e11d48' }}>
                  <input
                    type="checkbox"
                    checked={formData.prescriptionRequired}
                    onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
                  />
                  Prescription Mandatory (Schedule H / X)
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Clinical Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Side Effects</label>
                  <textarea
                    rows="2"
                    value={formData.sideEffects}
                    onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Precautions</label>
                  <textarea
                    rows="2"
                    value={formData.precautions}
                    onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineManagement;
