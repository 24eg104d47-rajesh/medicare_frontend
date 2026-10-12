import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Pill, Plus, Check, AlertCircle, ShoppingCart } from 'lucide-react';

const MedicineCard = ({ medicine }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!medicine) return null;

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
    slug
  } = medicine;

  const rxNeeded = requiresPrescription !== undefined ? requiresPrescription : prescriptionRequired;
  const stock = availableStock !== undefined ? availableStock : totalStock;
  const img = productImageUrl || imageUrl;
  const isOutOfStock = stock <= 0;
  const discountPercent = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    setAdding(true);
    const success = await addToCart(id, 1);
    setAdding(false);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  return (
    <div className="card medicine-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      background: '#fff'
    }}>
      {/* Top Badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        {rxNeeded ? (
          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
            <span style={{ fontSize: '0.85em', fontWeight: '900' }}>℞</span> Rx Required
          </span>
        ) : (
          <span className="badge badge-success">OTC</span>
        )}

        {discountPercent > 0 && (
          <span className="badge badge-warning" style={{ fontWeight: '800' }}>
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Image / Fallback Container */}
      <Link to={`/medicines/${slug || id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          height: '180px',
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '1.5rem',
          borderBottom: '1px solid #f1f5f9'
        }}>
          {img ? (
            <img
              src={img}
              alt={name}
              style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div
            style={{
              display: img ? 'none' : 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem'
            }}>
              <Pill size={32} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
              {dosageForm || 'Medicine'}
            </span>
          </div>
        </div>
      </Link>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
            {manufacturer || 'Certified Pharma'}
          </span>
          {strength && (
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0284c7', background: '#f0f9ff', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
              {strength}
            </span>
          )}
        </div>

        <Link to={`/medicines/${slug || id}`} style={{ textDecoration: 'none', color: '#0f172a' }}>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: '700',
            lineHeight: '1.35',
            margin: '0.25rem 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {name}
          </h3>
        </Link>

        {genericName && (
          <p style={{
            fontSize: '0.8rem',
            color: '#64748b',
            margin: '0 0 0.75rem',
            fontStyle: 'italic',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Composition: {genericName}
          </p>
        )}

        {/* Stock status indicator */}
        <div style={{ marginTop: 'auto', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
          {isOutOfStock ? (
            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              <AlertCircle size={14} /> Out of Stock
            </span>
          ) : (
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
              In Stock ({stock} units)
            </span>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f1f5f9'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                ₹{Number(price).toFixed(2)}
              </span>
              {mrp && mrp > price && (
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                  ₹{Number(mrp).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`btn ${justAdded ? 'btn-success' : 'btn-primary'}`}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              gap: '0.35rem',
              opacity: isOutOfStock ? 0.5 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            {justAdded ? (
              <>
                <Check size={16} /> Added
              </>
            ) : adding ? (
              <span className="spinner-border spinner-border-sm" role="status" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
            ) : (
              <>
                <Plus size={16} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
