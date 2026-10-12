import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { User, Shield, Phone, Mail, Heart, AlertCircle, CheckCircle2, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.fullName ? user.fullName.split(' ')[0] : '',
    lastName: user?.fullName ? user.fullName.split(' ').slice(1).join(' ') : '',
    phoneNumber: user?.phone || '',
    gender: 'MALE',
    dateOfBirth: '',
    bloodGroup: '',
    allergies: '',
    chronicConditions: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setInitialLoading(true);
        const res = await authService.getMe();
        if (res?.data) {
          const p = res.data;
          const parts = (p.fullName || '').split(' ');
          setFormData(prev => ({
            ...prev,
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || '',
            phoneNumber: p.phone || '',
            gender: p.gender || 'MALE',
            dateOfBirth: p.dateOfBirth || '',
            bloodGroup: p.bloodGroup || '',
            allergies: p.allergies || '',
            chronicConditions: p.chronicConditions || '',
            emergencyContactName: p.emergencyContactName || '',
            emergencyContactPhone: p.emergencyContactPhone || ''
          }));
        }
      } catch (err) {
        console.error('Failed to load profile details', err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setLoading(true);
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim() || formData.firstName.trim();
      const res = await authService.updateProfile({
        fullName,
        phone: formData.phoneNumber?.trim() || '',
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || null,
        bloodGroup: formData.bloodGroup || null,
        allergies: formData.allergies || null,
        chronicConditions: formData.chronicConditions || null,
        emergencyContactName: formData.emergencyContactName || null,
        emergencyContactPhone: formData.emergencyContactPhone || null
      });
      if (res?.data) {
        updateUser(res.data);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner fullPage message="Loading profile information..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
            Account & Health Profile
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            Manage contact information, emergency blood group, and allergy alerts.
          </p>
        </div>

        <div className="card" style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid #e2e8f0' }}>
          {success && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#166534',
              fontSize: '0.85rem'
            }}>
              <CheckCircle2 size={18} />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#991b1b',
              fontSize: '0.85rem'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="#0284c7" /> Personal Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="form-control"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="form-control"
                  style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={18} color="#ef4444" /> Medical Background (Disclosed to Pharmacists)
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="form-control"
                style={{ maxWidth: '240px' }}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Known Drug / Food Allergies
              </label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Sulfa drugs, Peanuts..."
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="form-control"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Chronic Conditions / Medical Notes
              </label>
              <textarea
                rows="3"
                placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma..."
                value={formData.chronicConditions}
                onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                className="form-control"
              />
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="#059669" /> Emergency Contact
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma (Spouse)"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="form-control"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Contact Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', borderRadius: '12px' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <>
                  <Save size={18} /> Save Profile Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
