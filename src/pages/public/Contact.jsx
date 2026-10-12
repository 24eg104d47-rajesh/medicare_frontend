import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '3rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Customer Support
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0 1rem' }}>
            We're Here to Help
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Have questions about an ongoing order, prescription verification, or delivery timeline? Our pharmacy team is available 24/7.
          </p>
        </div>

        {/* Emergency Alert Banner */}
        <div style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '16px',
          padding: '1rem 1.5rem',
          maxWidth: '900px',
          margin: '0 auto 2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <AlertTriangle size={24} color="#e11d48" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: '#9f1239', lineHeight: '1.4' }}>
            <strong>Medical Emergency Notice:</strong> If you or a loved one is experiencing a medical emergency, acute chest pain, shortness of breath, or allergic reaction, please dial <strong>112 / 911</strong> or visit your nearest hospital emergency department immediately.
          </div>
        </div>

        {/* 2 Column Layout: Info Cards on Left, Form on Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Left: Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>Toll-Free Pharmacy Helpline</h4>
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: '#475569' }}>1800-MEDICARE (1800-633-4227)</p>
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>Available 24 hours a day, 7 days a week</span>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ccfbf1', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>Email Support</h4>
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: '#475569' }}>support@medicareai.com</p>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Average response time: under 15 minutes</span>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ede9fe', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>Central Pharmacy & Hub</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                  452 Healthcare Boulevard, Medical District, Tech Park, Suite 400
                </p>
              </div>
            </div>
          </div>

          {/* Right: Send Message Form */}
          <div className="card" style={{ padding: '2rem', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle2 size={56} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                  Message Received!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  Thank you for reaching out. A registered pharmacist or care agent will contact you shortly at <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="btn btn-outline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
                  Send a Support Inquiry
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                    Inquiry Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Order #ORD-1234 status"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Describe your question, medicine inquiry, or feedback..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-control"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', justifyContent: 'center' }}>
                  <Send size={18} /> Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
