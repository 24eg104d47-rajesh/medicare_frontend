import React from 'react';
import { ShieldCheck, Award, Truck, Bot, CheckCircle, Database, Lock, Cpu } from 'lucide-react';

const About = () => {
  return (
    <div style={{ padding: '3rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            About MediCare AI
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0 1rem', lineHeight: '1.2' }}>
            Revolutionizing Safe & Intelligent Healthcare Access
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
            MediCare AI is a comprehensive pharmacy management and online medicine delivery platform combining enterprise-grade First-Expiry-First-Out (FEFO) inventory tracking with licensed pharmacist oversight and safe catalog-grounded AI assistance.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          <div className="card" style={{ padding: '2rem', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Database size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              FEFO Batch Inventory Tracking
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>
              Our proprietary inventory engine automatically allocates stock strictly by the earliest valid expiration date (First-Expiry-First-Out), guaranteeing patients never receive near-expiry or compromised medicines.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ccfbf1', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              Licensed Pharmacist Verification
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>
              Every prescription uploaded is verified by a state-registered pharmacist prior to order release. Potential drug interactions, contraindications, and incorrect dosages are flagged proactively.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ede9fe', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Bot size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              Catalog-Grounded AI Guidance
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>
              Our AI chatbot answers questions grounded in real pharmaceutical records, offering dosage info, common side effects, and OTC recommendations with clinical disclaimers.
            </p>
          </div>
        </div>

        {/* Regulatory & Safety Box */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '3rem',
          border: '1px solid #334155'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <ShieldCheck size={36} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>
              Strict Regulatory & Quality Standards
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.7', marginBottom: '2rem' }}>
              MediCare AI operates in full compliance with Pharmacy Practice Regulations, Drug and Cosmetic Rules, and HIPAA security guidelines. All customer health information and prescription documents are encrypted in transit and at rest with role-restricted audit trails.
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.5rem',
              fontSize: '0.85rem',
              color: '#cbd5e1'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={16} color="#38bdf8" /> CDSCO & FDA Standards
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={16} color="#38bdf8" /> ISO 9001:2015 Quality Management
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={16} color="#38bdf8" /> 256-bit SSL Data Encryption
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
