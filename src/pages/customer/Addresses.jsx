import React, { useState, useEffect } from 'react';
import { addressService } from '../../services/addressService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Building } from 'lucide-react';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    addressType: 'HOME',
    isDefault: false
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await (addressService.getAllAddresses ? addressService.getAllAddresses() : addressService.getMyAddresses());
      setAddresses(res?.data || res || []);
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        recipientName: formData.recipientName,
        phone: formData.phoneNumber,
        phoneNumber: formData.phoneNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state || 'Karnataka',
        postalCode: formData.postalCode,
        country: 'India',
        defaultAddress: formData.isDefault,
        isDefault: formData.isDefault,
        addressType: formData.addressType || 'HOME'
      };
      await addressService.createAddress(payload);
      setShowModal(false);
      setFormData({
        recipientName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        addressType: 'HOME',
        isDefault: false
      });
      fetchAddresses();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to save address');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery address?')) return;
    try {
      await addressService.deleteAddress(id);
      fetchAddresses();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to delete address');
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading delivery addresses..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
              Saved Addresses
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
              Manage shipping and delivery locations for speedy medicine fulfillment.
            </p>
          </div>

          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ borderRadius: '12px' }}>
            <Plus size={18} /> Add New Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="card" style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <MapPin size={40} color="#0284c7" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              No addresses saved
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Save your home or work address for easy one-click checkout.
            </p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus size={16} /> Add Address
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {addresses.map((addr) => (
              <div
                key={addr.id}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>
                        {addr.recipientName}
                      </span>
                      {(addr.isDefault || addr.defaultAddress) && (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                          Default
                        </span>
                      )}
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {addr.addressType || 'HOME'}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                    {addr.addressLine1} {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>

                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Phone: {addr.phoneNumber || addr.phone || 'N/A'}
                  </span>
                </div>

                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={15} /> Delete Address
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
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
          padding: '1rem'
        }}>
          <div className="card" style={{ background: '#fff', borderRadius: '24px', padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
              Add Delivery Address
            </h3>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Address Line 1 *</label>
                <input
                  type="text"
                  required
                  placeholder="Flat/House No., Society, Road..."
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>PIN *</label>
                  <input
                    type="text"
                    required
                    placeholder="PIN Code"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
