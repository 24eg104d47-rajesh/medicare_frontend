import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, Truck, Clock, Award, Phone, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#cbd5e1', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        {/* Trust Badges Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid #334155',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(2, 132, 199, 0.15)', padding: '0.75rem', borderRadius: '12px', color: '#38bdf8' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>100% Genuine Medicines</h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Direct from certified pharma manufacturers</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(13, 148, 136, 0.15)', padding: '0.75rem', borderRadius: '12px', color: '#2dd4bf' }}>
              <Truck size={28} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>Express Cold-Chain Delivery</h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Temperature-monitored safe shipping</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.75rem', borderRadius: '12px', color: '#818cf8' }}>
              <Award size={28} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>Licensed Pharmacists</h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Every prescription verified manually</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(234, 88, 12, 0.15)', padding: '0.75rem', borderRadius: '12px', color: '#fb923c' }}>
              <Clock size={28} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>24/7 AI Guidance</h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Catalog-grounded instant support</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid #1e293b'
        }}>
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Pill size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                MediCare <span style={{ color: '#38bdf8' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Next-generation AI-assisted online pharmacy delivering certified pharmaceuticals, accurate dosage guidance, and verified prescription validation directly to your doorstep.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} color="#38bdf8" /> 452 Healthcare Boulevard, Medical District
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="#38bdf8" /> 1800-MEDICARE (Toll-Free 24/7)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="#38bdf8" /> support@medicareai.com
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>Shop Medicines</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link to="/medicines" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}>All Medicines</Link></li>
              <li><Link to="/medicines?category=Antibiotics" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Antibiotics</Link></li>
              <li><Link to="/medicines?category=Cardiovascular" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Cardiovascular Care</Link></li>
              <li><Link to="/medicines?category=Diabetes+Care" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Diabetes Management</Link></li>
              <li><Link to="/medicines?category=Vitamins+%26+Supplements" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Vitamins & Wellness</Link></li>
              <li><Link to="/categories" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Browse Categories</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>Customer Care</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link to="/prescriptions" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Upload Prescription</Link></li>
              <li><Link to="/orders" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Track Your Order</Link></li>
              <li><Link to="/ai-assistant" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>AI Pharmacy Assistant</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>About MediCare AI</Link></li>
              <li><Link to="/contact" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Contact & Helpdesk</Link></li>
            </ul>
          </div>

          {/* Legal & Medical Compliance */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>Compliance & Safety</h4>
            <p style={{ fontSize: '0.8rem', lineHeight: '1.6', color: '#94a3b8' }}>
              All prescription drugs require a valid medical prescription from a registered medical practitioner prior to dispatch.
            </p>
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#fca5a5', marginBottom: '0.2rem' }}>
                MEDICAL DISCLAIMER
              </span>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                Information provided is for educational reference and does not replace medical advice, diagnosis, or treatment. In emergencies, call your local emergency number immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            &copy; {new Date().getFullYear()} MediCare AI Inc. All rights reserved. Licensed Pharmacy Reg #PHA-2026-99814.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Crafted with <Heart size={14} color="#ef4444" fill="#ef4444" /> for safer, faster healthcare access.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
