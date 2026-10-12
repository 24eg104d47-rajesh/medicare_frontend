import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Pill, 
  ShieldCheck, 
  AlertTriangle, 
  Truck, 
  Check, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Sparkles, 
  Bot, 
  Info,
  Calendar,
  Thermometer,
  ShieldAlert
} from 'lucide-react';
import { medicineService } from '../../services/medicineService';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const MedicineDetails = () => {
  const { slugOrId } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        let res;
        // Check if numeric or slug
        if (/^\d+$/.test(slugOrId)) {
          res = await medicineService.getMedicineById(slugOrId);
        } else {
          res = await medicineService.getMedicineBySlug(slugOrId);
        }
        setMedicine(res?.data || null);
      } catch (err) {
        console.error('Failed to load medicine details', err);
        setError('Medicine not found or failed to load details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [slugOrId]);

  if (loading) {
    return <LoadingSpinner fullPage message="Fetching medicine details..." />;
  }

  if (error || !medicine) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <ShieldAlert size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Product Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            {error || "The requested medicine could not be found in our database."}
          </p>
          <Link to="/medicines" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const {
    id,
    name,
    genericName,
    manufacturer,
    strength,
    dosageForm,
    price,
    mrp,
    prescriptionRequired,
    requiresPrescription,
    totalStock = 0,
    availableStock,
    imageUrl,
    productImageUrl,
    description,
    sideEffects,
    precautions,
    storageInstructions,
    usageInstructions,
    categoryName
  } = medicine;

  const rxNeeded = requiresPrescription !== undefined ? requiresPrescription : prescriptionRequired;
  const stock = availableStock !== undefined ? availableStock : totalStock;
  const img = productImageUrl || imageUrl;
  const isOutOfStock = stock <= 0;
  const discountPercent = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || adding) return;
    setAdding(true);
    const success = await addToCart(id, quantity);
    setAdding(false);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  return (
    <div style={{ padding: '2rem 0 4rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
          <Link to="/medicines" style={{ color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} /> Back to Medicines
          </Link>
          <span>/</span>
          {categoryName && (
            <>
              <Link to={`/medicines?category=${encodeURIComponent(categoryName)}`} style={{ color: '#64748b', textDecoration: 'none' }}>
                {categoryName}
              </Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: '#0f172a', fontWeight: '600' }}>{name}</span>
        </div>

        {/* Main Product Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid #e2e8f0',
          marginBottom: '2.5rem'
        }}>
          {/* Left Column: Image Container */}
          <div>
            <div style={{
              width: '100%',
              height: '380px',
              borderRadius: '20px',
              background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '2rem'
            }}>
              {/* Badges on top */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '0.5rem' }}>
                {rxNeeded ? (
                  <span className="badge badge-danger" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                    ℞ Prescription Required
                  </span>
                ) : (
                  <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                    OTC General Sale
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="badge badge-warning" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {img ? (
                <img
                  src={img}
                  alt={name}
                  style={{ maxHeight: '280px', maxWidth: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}

              <div style={{
                display: img ? 'none' : 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7'
              }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Pill size={48} />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
                  {dosageForm} • {strength}
                </span>
              </div>
            </div>

            {/* Quick trust strip under image */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1.25rem', textAlign: 'center' }}>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <ShieldCheck size={20} color="#0284c7" style={{ margin: '0 auto 0.25rem' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#334155' }}>100% Genuine</div>
              </div>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Thermometer size={20} color="#0d9488" style={{ margin: '0 auto 0.25rem' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#334155' }}>Cold Monitored</div>
              </div>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Truck size={20} color="#6366f1" style={{ margin: '0 auto 0.25rem' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#334155' }}>Express Dispatch</div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {manufacturer || 'Licensed Pharmaceutical'}
              </span>
              {categoryName && (
                <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                  {categoryName}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem' }}>
              {name}
            </h1>

            {genericName && (
              <p style={{ fontSize: '1rem', color: '#475569', fontStyle: 'italic', margin: '0 0 1.25rem' }}>
                Composition: <strong>{genericName}</strong>
              </p>
            )}

            {/* Strength and Form Pills */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {strength && (
                <div style={{ padding: '0.4rem 0.85rem', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                  Strength: {strength}
                </div>
              )}
              {dosageForm && (
                <div style={{ padding: '0.4rem 0.85rem', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                  Form: {dosageForm}
                </div>
              )}
            </div>

            {/* Price Box */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
                    ₹{Number(price).toFixed(2)}
                  </span>
                  {mrp && mrp > price && (
                    <span style={{ fontSize: '1.1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                      ₹{Number(mrp).toFixed(2)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span style={{ fontSize: '0.9rem', color: '#16a34a', fontWeight: '700' }}>
                      Save {discountPercent}%
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Inclusive of all statutory taxes</span>
              </div>

              {/* Stock Status */}
              <div>
                {isOutOfStock ? (
                  <span className="badge badge-danger">Out of Stock</span>
                ) : (
                  <span className="badge badge-success">
                    In Stock ({stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Prescription Warning Box if required */}
            {rxNeeded && (
              <div style={{
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}>
                <AlertTriangle size={20} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.85rem', color: '#9f1239', lineHeight: '1.4' }}>
                  <strong>Prescription Mandatory:</strong> This medicine cannot be dispatched without a valid prescription from a registered medical practitioner. You can upload it during checkout or from your dashboard.
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart button */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
              {/* Quantity Counter */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                overflow: 'hidden',
                background: '#ffffff'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  style={{
                    border: 'none',
                    background: '#f8fafc',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    color: '#334155'
                  }}
                >
                  <Minus size={16} />
                </button>
                <span style={{
                  padding: '0.75rem 1.25rem',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#0f172a'
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  disabled={quantity >= stock || isOutOfStock}
                  style={{
                    border: 'none',
                    background: '#f8fafc',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    color: '#334155'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className={`btn ${added ? 'btn-success' : 'btn-primary'}`}
                style={{
                  flex: 1,
                  padding: '0.85rem 1.5rem',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  justifyContent: 'center'
                }}
              >
                {added ? (
                  <>
                    <Check size={20} /> Added to Cart!
                  </>
                ) : adding ? (
                  <span className="spinner-border spinner-border-sm" role="status" />
                ) : (
                  <>
                    <Plus size={20} /> Add to Cart (₹{(price * quantity).toFixed(2)})
                  </>
                )}
              </button>
            </div>

            {/* Link to AI Assistant for Questions */}
            <div style={{
              background: '#f0f9ff',
              border: '1px dashed #38bdf8',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Bot size={22} color="#0284c7" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0369a1' }}>
                    Have questions about {name}?
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Check interactions, dosage guidelines & alternatives with AI.
                  </div>
                </div>
              </div>
              <Link
                to={`/ai-assistant?query=Tell me about ${encodeURIComponent(name)} dosage and side effects`}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
              >
                Ask Assistant &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Medical Information Tabs / Sections */}
        <div className="card" style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
            Clinical & Usage Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {description && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={16} /> Product Overview
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                  {description}
                </p>
              </div>
            )}

            {usageInstructions && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pill size={16} /> How to Use
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                  {usageInstructions}
                </p>
              </div>
            )}

            {sideEffects && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} /> Possible Side Effects
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                  {sideEffects}
                </p>
              </div>
            )}

            {precautions && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#d97706', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={16} /> Precautions & Warnings
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                  {precautions}
                </p>
              </div>
            )}

            {storageInstructions && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0d9488', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Thermometer size={16} /> Storage Instructions
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                  {storageInstructions}
                </p>
              </div>
            )}
          </div>

          {/* Legal Compliance Disclaimer */}
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.78rem',
            color: '#64748b',
            lineHeight: '1.5'
          }}>
            <strong>Important Medical Disclaimer:</strong> The content provided here is solely for informational purposes and should not be construed as medical diagnosis, treatment, or advice. Always consult a qualified registered medical practitioner or licensed pharmacist before initiating or altering any medicine regimen.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;
