import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../../services/prescriptionService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [doctorName, setDoctorName] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await prescriptionService.getMyPrescriptions();
      setPrescriptions(res.data || []);
    } catch (err) {
      console.error('Failed to load prescriptions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a prescription document (image or PDF).');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      if (doctorName) formData.append('doctorName', doctorName);
      if (patientNotes) formData.append('patientNotes', patientNotes);

      await prescriptionService.uploadPrescription(formData);
      setShowModal(false);
      setFile(null);
      setDoctorName('');
      setPatientNotes('');
      fetchPrescriptions();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to upload prescription.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Fetching your prescriptions..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
              My Prescriptions
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
              Upload and manage doctor prescriptions for Schedule H & X prescription medicines.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
            style={{ borderRadius: '12px' }}
          >
            <Upload size={18} /> Upload Prescription
          </button>
        </div>

        {/* Prescription List */}
        {prescriptions.length === 0 ? (
          <div className="card" style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
            maxWidth: '520px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <FileText size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              No prescriptions uploaded yet
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Upload doctor prescriptions to quickly attach them when ordering regulated medicines.
            </p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Upload size={16} /> Upload Now
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {prescriptions.map((rx) => {
              const uploadDate = new Date(rx.uploadedAt || Date.now()).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={rx.id}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>
                        Prescription #{rx.id}
                      </span>
                      <StatusBadge status={rx.status} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#475569' }}>
                      <div>
                        <strong>Doctor:</strong> {rx.doctorName || 'Not specified'}
                      </div>
                      <div>
                        <strong>Uploaded:</strong> {uploadDate}
                      </div>
                      {rx.patientNotes && (
                        <div style={{ fontStyle: 'italic', color: '#64748b', marginTop: '0.25rem' }}>
                          "{rx.patientNotes}"
                        </div>
                      )}
                    </div>

                    {/* Pharmacist Review Feedback */}
                    {rx.pharmacistNotes && (
                      <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: rx.status === 'VERIFIED' ? '#f0fdf4' : '#fef2f2',
                        borderRadius: '10px',
                        border: rx.status === 'VERIFIED' ? '1px solid #bbf7d0' : '1px solid #fecaca',
                        fontSize: '0.8rem'
                      }}>
                        <strong style={{ color: rx.status === 'VERIFIED' ? '#166534' : '#991b1b' }}>
                          Pharmacist Note:
                        </strong>
                        <p style={{ margin: '0.2rem 0 0', color: '#334155' }}>
                          {rx.pharmacistNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Document Link */}
                  {rx.fileUrl && (
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                      <a
                        href={rx.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.85rem',
                          color: '#0284c7',
                          fontWeight: '600',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ExternalLink size={15} /> View Uploaded Document
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
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
          <div className="card" style={{ background: '#fff', borderRadius: '24px', padding: '2rem', maxWidth: '480px', width: '100%' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
              Upload Prescription
            </h3>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                color: '#991b1b',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                  Document File (PNG, JPG, PDF) *
                </label>
                <input
                  type="file"
                  required
                  accept="image/*,application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                  Doctor's Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. A. K. Patel"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                  Notes / Instructions
                </label>
                <textarea
                  rows="3"
                  placeholder="Additional context or prescribed duration..."
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={uploading} className="btn btn-primary">
                  {uploading ? 'Uploading...' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
