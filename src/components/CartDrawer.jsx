import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertTriangle, Pill } from 'lucide-react';

const CartDrawer = () => {
  const { cart, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem, clearCart, requiresPrescription } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const items = cart?.items || [];
  const subtotal = Number(cart?.subtotal || 0);

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Background click to dismiss */}
      <div
        style={{ flex: 1 }}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer content */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        background: '#ffffff',
        boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.25s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>
                Your Cart
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Prescription notice banner if needed */}
        {requiresPrescription && (
          <div style={{
            background: '#fef2f2',
            borderBottom: '1px solid #fee2e2',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.8rem', color: '#991b1b', lineHeight: '1.4' }}>
              <strong>Rx Required:</strong> Your cart includes prescription medicines. You can attach a prescription at checkout.
            </div>
          </div>
        )}

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#64748b',
              padding: '2rem'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                marginBottom: '1rem'
              }}>
                <ShoppingBag size={34} />
              </div>
              <h4 style={{ color: '#0f172a', fontWeight: '700', marginBottom: '0.4rem' }}>
                Your cart is empty
              </h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem', color: '#64748b' }}>
                Looks like you haven't added any medicines yet.
              </p>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/medicines');
                }}
                className="btn btn-primary"
              >
                Browse Medicines
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #f1f5f9',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Medicine Icon / Thumb */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#0284c7'
                  }}>
                    {item.medicineImageUrl ? (
                      <img src={item.medicineImageUrl} alt={item.medicineName} style={{ maxHeight: '48px', maxWidth: '48px', objectFit: 'contain' }} />
                    ) : (
                      <Pill size={24} />
                    )}
                  </div>

                  {/* Info & Quantity controls */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '180px'
                      }}>
                        {item.medicineName}
                      </h4>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                        ₹{Number(item.itemTotal || (item.unitPrice * item.quantity)).toFixed(2)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.2rem 0 0.5rem' }}>
                      {item.prescriptionRequired ? (
                        <span className="badge badge-danger" style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                          ℞ Rx
                        </span>
                      ) : (
                        <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                          OTC
                        </span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        ₹{Number(item.unitPrice).toFixed(2)} each
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            background: '#f8fafc',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#475569'
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{
                          padding: '0.2rem 0.75rem',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          color: '#0f172a'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            background: '#f8fafc',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#475569'
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s'
                        }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal and Checkout button */}
        {items.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
              <span>Items Subtotal:</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
              <span>Total Amount:</span>
              <span style={{ color: '#0284c7' }}>₹{subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={handleCheckout}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', justifyContent: 'center' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/cart');
                }}
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                View Full Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
