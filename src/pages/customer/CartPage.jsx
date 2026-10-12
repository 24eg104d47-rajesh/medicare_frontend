import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  Pill, 
  ArrowLeft 
} from 'lucide-react';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart, requiresPrescription } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const subtotal = Number(cart?.subtotal || 0);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: '4rem 0', background: '#f8fafc', minHeight: '80vh' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '520px', margin: '0 auto', padding: '3.5rem 2rem', borderRadius: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <ShoppingBag size={40} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              Your Cart is Empty
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Explore our wide range of certified pharmaceuticals, health supplements, and OTC essentials.
            </p>
            <Link to="/medicines" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.85rem 2rem' }}>
              Browse Medicines
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
              Shopping Cart
            </h1>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'} in your healthcare basket
            </span>
          </div>

          <button
            onClick={clearCart}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={15} /> Clear Basket
          </button>
        </div>

        {/* Prescription Notice if applicable */}
        {requiresPrescription && (
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <AlertTriangle size={24} color="#e11d48" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.95rem', fontWeight: '700', color: '#9f1239' }}>
                Prescription Required for Items in Cart
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#be123c', lineHeight: '1.4' }}>
                One or more items require a doctor's prescription. You can attach an existing prescription or upload a new one at checkout.
              </p>
            </div>
          </div>
        )}

        {/* Layout Grid: Items List & Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Items List */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className="card" style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    padding: '1.5rem',
                    borderBottom: index !== items.length - 1 ? '1px solid #f1f5f9' : 'none',
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'center'
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '14px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#0284c7'
                  }}>
                    {item.medicineImageUrl ? (
                      <img src={item.medicineImageUrl} alt={item.medicineName} style={{ maxHeight: '56px', maxWidth: '56px', objectFit: 'contain' }} />
                    ) : (
                      <Pill size={32} />
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                        {item.medicineName}
                      </h3>
                      {item.prescriptionRequired ? (
                        <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>℞ Rx</span>
                      ) : (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>OTC</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      ₹{Number(item.unitPrice).toFixed(2)} per unit
                    </span>
                  </div>

                  {/* Quantity Counter */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        background: '#f8fafc',
                        border: 'none',
                        padding: '0.35rem 0.65rem',
                        cursor: 'pointer',
                        color: '#475569'
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0.35rem 0.85rem', fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        background: '#f8fafc',
                        border: 'none',
                        padding: '0.35rem 0.65rem',
                        cursor: 'pointer',
                        color: '#475569'
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div style={{ textAlign: 'right', minWidth: '90px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                      ₹{Number(item.itemTotal || (item.unitPrice * item.quantity)).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '0.4rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/medicines" style={{ textDecoration: 'none', color: '#0284c7', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="card" style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Items Subtotal</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Charges</span>
                  <span style={{ fontWeight: '700', color: deliveryFee === 0 ? '#16a34a' : '#0f172a' }}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <span style={{ fontSize: '0.75rem', color: '#0284c7' }}>
                    Tip: Add ₹{(500 - subtotal).toFixed(2)} more for Free Express Delivery!
                  </span>
                )}
              </div>

              <div style={{
                paddingTop: '1.25rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '1.75rem'
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Total Amount</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0284c7' }}>₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', justifyContent: 'center', borderRadius: '12px' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#64748b', justifyContent: 'center' }}>
                <ShieldCheck size={16} color="#16a34a" /> 256-bit Secure Pharmacist Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
