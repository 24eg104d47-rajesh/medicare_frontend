import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../../services/prescriptionService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FileCheck, CheckCircle2, XCircle, ExternalLink, Clock, AlertTriangle } from 'lucide-react';

const PrescriptionReview = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRx, setSelectedRx] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await prescriptionService.getPendingPrescriptions({ page: 0, size: 20 });
      setPrescriptions(res.data?.content || []);
    } catch (err) {
      console.error('Failed to load pending prescriptions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleReview = async (status) => {
    if (!selectedRx) return;
    if (status === 'REJECTED' && !reviewNotes.trim()) {
      alert('Please provide a reason for rejecting the prescription.');
      return;
    }

    try {
      setSubmitting(true);
      await prescriptionService.reviewPrescription(selectedRx.id, {
        status,
        pharmacistNotes: reviewNotes
      });
      setSelectedRx(null);
      setReviewNotes('');
      fetchPending();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading pending prescriptions..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
            Pharmacist Prescription Review
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            Inspect doctor prescriptions, verify patient safety, and release regulated orders.
          </p>
        </div>

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
            <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              All caught up!
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              There are no pending prescriptions awaiting validation right now.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {prescriptions.map((rx) => (
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
                      <strong>Patient Name:</strong> {rx.customerName || `Customer #${rx.customerId}`}
                    </div>
                    <div>
                      <strong>Prescribing Doctor:</strong> {rx.doctorName || 'Not recorded'}
                    </div>
                    <div>
                      <strong>Uploaded:</strong> {new Date(rx.uploadedAt).toLocaleString()}
                    </div>
                    {rx.patientNotes && (
                      <div style={{ fontStyle: 'italic', color: '#64748b', marginTop: '0.25rem' }}>
                        Patient notes: "{rx.patientNotes}"
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  {rx.fileUrl ? (
                    <a
                      href={rx.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ExternalLink size={15} /> View Script
                    </a>
                  ) : <span />}

                  <button
                    onClick={() => {
                      setSelectedRx(rx);
                      setReviewNotes('');
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
                  >
                    Review & Decide
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decision Modal */}
      {selectedRx && (
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
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
              Verify Prescription #{selectedRx.id}
            </h3>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div><strong>Patient:</strong> {selectedRx.customerName || `Customer #${selectedRx.customerId}`}</div>
              <div><strong>Doctor:</strong> {selectedRx.doctorName || 'Not stated'}</div>
              {selectedRx.fileUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <a href={selectedRx.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', fontWeight: '700' }}>
                    Click here to open prescription document &rarr;
                  </a>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Pharmacist Verification Notes / Rejection Reason
              </label>
              <textarea
                rows="3"
                placeholder="e.g. Validated with doctor's registration. Dosage matches clinical guidelines."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="form-control"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setSelectedRx(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleReview('REJECTED')}
                className="btn btn-danger"
              >
                <XCircle size={16} /> Reject
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleReview('VERIFIED')}
                className="btn btn-success"
              >
                <CheckCircle2 size={16} /> Approve & Sign Off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionReview;
