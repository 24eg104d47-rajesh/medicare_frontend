import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Upload, 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Pill, 
  FileText,
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { medicineService } from '../../services/medicineService';
import { categoryService } from '../../services/medicineService';
import MedicineCard from '../../components/MedicineCard';
import CategoryCard from '../../components/CategoryCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setApiError(null);
        const [catsRes, medsRes] = await Promise.all([
          categoryService.getAllCategories(),
          medicineService.getFeaturedMedicines()
        ]);
        setCategories(catsRes?.data || []);
        setFeaturedMedicines(medsRes?.data || []);
      } catch (err) {
        console.error('Failed to load home data', err);
        setApiError(err.message || 'Unable to connect to backend server');
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #f8fafc 100%)',
        padding: '5rem 0 4rem',
        borderBottom: '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left Hero Text */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                background: '#e0f2fe',
                color: '#0284c7',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={16} /> AI-Powered Next Gen Healthcare
              </div>

              <h1 style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
                fontWeight: '800',
                color: '#0f172a',
                lineHeight: '1.15',
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem'
              }}>
                Your Health Essentials, <br />
                <span style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Delivered with Care.
                </span>
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: '#475569',
                lineHeight: '1.6',
                marginBottom: '2rem',
                maxWidth: '560px'
              }}>
                Order certified medicines online with FEFO verified inventory, express cold-chain delivery, licensed pharmacist prescription review, and intelligent 24/7 AI guidance.
              </p>

              {/* Hero Search Box */}
              <form onSubmit={handleSearchSubmit} style={{
                display: 'flex',
                background: '#ffffff',
                padding: '0.5rem',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.15), 0 8px 10px -6px rgba(2, 132, 199, 0.1)',
                border: '1px solid #cbd5e1',
                maxWidth: '540px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1rem', color: '#64748b', flex: 1 }}>
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search by medicine, brand, salt, or symptom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      padding: '0.65rem 0.85rem',
                      width: '100%',
                      fontSize: '0.95rem',
                      color: '#0f172a'
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.75rem 1.5rem' }}>
                  Search
                </button>
              </form>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                <Link to="/prescriptions" className="btn btn-outline" style={{ background: '#fff', borderColor: '#0284c7', color: '#0284c7' }}>
                  <Upload size={18} /> Upload Prescription
                </Link>
                <Link to="/ai-assistant" className="btn btn-secondary">
                  <Bot size={18} /> Ask AI Assistant
                </Link>
              </div>
            </div>

            {/* Right Hero Graphic Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '460px',
                background: '#ffffff',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.12)',
                border: '1px solid #e2e8f0'
              }}>
                {/* Floating Badge 1 */}
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '20px',
                  background: '#10b981',
                  color: '#ffffff',
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <CheckCircle2 size={16} /> 100% Genuine Certified
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                  <div style={{
                    width: '84px',
                    height: '84px',
                    margin: '0 auto 1rem',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 12px 24px rgba(2, 132, 199, 0.3)'
                  }}>
                    <Pill size={44} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
                    MediCare Smart Dispatch
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                    Powered by First-Expiry-First-Out (FEFO) Inventory Routing
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{
                    padding: '0.85rem 1rem',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Cold Chain Storage</span>
                    <span className="badge badge-success">2°C - 8°C Monitored</span>
                  </div>
                  <div style={{
                    padding: '0.85rem 1rem',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Prescription Verification</span>
                    <span className="badge badge-info">Double Pharmacist Signoff</span>
                  </div>
                  <div style={{
                    padding: '0.85rem 1rem',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>AI Drug Safety</span>
                    <span className="badge badge-warning">Zero Adverse Interaction</span>
                  </div>
                </div>

                <div style={{
                  marginTop: '1.5rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <Link to="/medicines" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Explore All Medicines <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Trust Metrics Strip */}
      <section style={{ background: '#ffffff', padding: '2rem 0', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0284c7' }}>15,000+</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Certified Medicines</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0d9488' }}>100%</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>FEFO Freshness Guaranteed</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#6366f1' }}>45 Mins</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Express City Delivery</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>24/7</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>AI Pharmacist Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Browse by Healthcare Categories */}
      <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Curated Health Categories
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.25rem 0 0' }}>
                Browse by Therapeutic Need
              </h2>
            </div>
            <Link to="/categories" style={{ fontWeight: '700', color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              View All Categories <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading health categories..." />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}>
              {categories.slice(0, 8).map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Featured Best-Selling Medicines */}
      <section style={{ padding: '4rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verified Quality Essentials
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.25rem 0 0' }}>
                Featured & Popular Medicines
              </h2>
            </div>
            <Link to="/medicines" style={{ fontWeight: '700', color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Browse Complete Catalog <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching featured medicines..." />
          ) : apiError ? (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '16px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center'
            }}>
              <AlertCircle size={36} color="#ef4444" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#991b1b', margin: '0 0 0.4rem' }}>
                Backend Server Is Not Reachable
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.25rem' }}>
                Could not connect to Spring Boot at <code>http://localhost:8080</code>. Please ensure the backend server is running.
              </p>
              <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', margin: '0 auto' }}>
                <RefreshCw size={15} /> Retry
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}>
              {featuredMedicines.map((med) => (
                <MedicineCard key={med.id} medicine={med} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Prescription Upload Guide & Promotion */}
      <section style={{
        padding: '4.5rem 0',
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        color: '#ffffff'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                <FileText size={16} /> Fast Prescription Validation
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1rem' }}>
                Have a Doctor's Prescription? <br />
                We'll Handle the Rest.
              </h2>
              <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '2rem', maxWidth: '500px' }}>
                Simply snap a clear photo or upload your PDF prescription. Our licensed in-house pharmacists inspect each script, verify dosage correctness, and prepare your package safely.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/prescriptions"
                  className="btn"
                  style={{
                    background: '#ffffff',
                    color: '#0284c7',
                    fontWeight: '700',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Upload size={18} /> Upload Prescription Now
                </Link>
                <Link
                  to="/medicines"
                  className="btn"
                  style={{
                    background: 'transparent',
                    border: '2px solid #ffffff',
                    color: '#ffffff',
                    fontWeight: '700',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '12px'
                  }}
                >
                  Order OTC First
                </Link>
              </div>
            </div>

            {/* 3 Step Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ffffff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  1
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: '700' }}>Upload Prescription</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.85 }}>Attach digital image or PDF file directly in portal.</p>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ffffff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  2
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: '700' }}>Pharmacist Review</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.85 }}>Our licensed team reviews and approves within 15 minutes.</p>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ffffff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  3
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: '700' }}>Express Dispatch</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.85 }}>Track door-to-door temperature-monitored package delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI Assistant Teaser */}
      <section style={{ padding: '4.5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdfa 100%)',
            border: '1px solid #bfdbfe',
            borderRadius: '24px',
            padding: '3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#dbeafe',
                color: '#1d4ed8',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                <Bot size={18} /> MediCare Assistant
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
                Ask AI About Medicines, Usage & Safety
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Unsure which OTC medicine suits a mild headache? Need to check food interactions or generic brand equivalents? MediCare AI queries our real pharmaceutical catalog with clinical safety guardrails.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/ai-assistant" className="btn btn-primary" style={{ padding: '0.85rem 1.5rem' }}>
                  Open AI Chatbot <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Simulated Chat bubble preview */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
                  U
                </div>
                <div style={{ background: '#f1f5f9', padding: '0.75rem 1rem', borderRadius: '14px', fontSize: '0.85rem', color: '#1e293b' }}>
                  What is the difference between Paracetamol and Ibuprofen?
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} />
                </div>
                <div style={{ background: '#e0f2fe', padding: '0.75rem 1rem', borderRadius: '14px', fontSize: '0.85rem', color: '#0369a1' }}>
                  Paracetamol (e.g. Dolo 650) is an analgesic & antipyretic for pain/fever without anti-inflammatory action, making it gentler on the stomach. Ibuprofen is an NSAID that also targets inflammation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
