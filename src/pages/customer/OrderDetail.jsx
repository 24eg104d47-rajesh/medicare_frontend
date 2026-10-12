import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Package, 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  AlertTriangle 
} from 'lucide-react';

const orderTimelineSteps = [
  { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle2 },
  { key: 'PROCESSING', label: 'Pharmacy Processing', icon: Package },
  { key: 'DISPATCHED', label: 'Dispatched for Delivery', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered Safely', icon: CheckCircle2 }
];

const statusWeight = {
  PENDING_PRESCRIPTION_REVIEW: 0,
  PAYMENT_PENDING: 0.5,
  CONFIRMED: 1,
  PROCESSING: 2,
  DISPATCHED: 3,
  DELIVERED: 4
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }
    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(order.id, cancelReason);
      setOrder(res.data);
      setShowCancelModal(false);
      alert('Order cancelled successfully.');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Fetching order tracking..." />;
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <h2 style={{ color: '#0f172a', marginBottom: '1rem' }}>Order Not Found</h2>
          <Link to="/orders" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'CANCELLED' || order.orderStatus === 'REJECTED';
  const currentStep = statusWeight[order.orderStatus] || 0;
  const canCancel = ['PENDING_PRESCRIPTION_REVIEW', 'PAYMENT_PENDING', 'CONFIRMED'].includes(order.orderStatus);

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Breadcrumb & Navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/orders" style={{ textDecoration: 'none', color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
            <ArrowLeft size={16} /> Back to My Orders
          </Link>
        </div>

        {/* Header Card */}
        <div className="card" style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Order #{order.orderNumber || order.id}
              </h1>
              <StatusBadge status={order.orderStatus} size="lg" />
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Placed on {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="btn btn-outline"
                style={{ color: '#ef4444', borderColor: '#fca5a5' }}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Visual Progress Timeline (if not cancelled) */}
        {!isCancelled && (
          <div className="card" style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem' }}>
              Dispatch & Fulfillment Timeline
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              position: 'relative'
            }}>
              {orderTimelineSteps.map((step, idx) => {
                const isPassed = currentStep >= idx + 1;
                const isCurrent = Math.floor(currentStep) === idx + 1;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: isPassed ? '#10b981' : isCurrent ? '#0284c7' : '#f1f5f9',
                      color: isPassed || isCurrent ? '#ffffff' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem',
                      boxShadow: isCurrent ? '0 0 0 4px #e0f2fe' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      <StepIcon size={20} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: isPassed || isCurrent ? '700' : '500', color: isPassed || isCurrent ? '#0f172a' : '#94a3b8' }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2 Column Details: Items on Left, Shipping/Payment on Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Items Table */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className="card" style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                  Items Ordered
                </h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.85rem 1.5rem' }}>Medicine</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Unit Price</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Quantity</th>
                      <th style={{ padding: '0.85rem 1.5rem', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.orderItems || []).map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.medicineName}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            {item.dosageForm} {item.strength ? `• ${item.strength}` : ''}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#334155' }}>₹{Number(item.unitPrice).toFixed(2)}</td>
                        <td style={{ padding: '1rem', color: '#334155', fontWeight: '600' }}>{item.quantity}</td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                          ₹{Number(item.totalPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Calculations */}
              <div style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '320px', marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{Number(order.subtotal || order.totalAmount).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Delivery Charge:</span>
                    <span style={{ fontWeight: '700', color: Number(order.deliveryFee || 0) === 0 ? '#16a34a' : '#0f172a' }}>
                      {Number(order.deliveryFee || 0) === 0 ? 'FREE' : `₹${Number(order.deliveryFee).toFixed(2)}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                    <span>Grand Total:</span>
                    <span style={{ color: '#0284c7' }}>₹{Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery & Payment Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Delivery Address */}
            <div className="card" style={{ background: '#ffffff', borderRadius: '18px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0284c7', fontWeight: '700' }}>
                <MapPin size={18} /> Delivery Address
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                <strong>{order.deliveryAddress?.recipientName}</strong><br />
                {order.deliveryAddress?.addressLine1} {order.deliveryAddress?.addressLine2 ? `, ${order.deliveryAddress?.addressLine2}` : ''}<br />
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.postalCode}<br />
                Phone: {order.deliveryAddress?.phoneNumber}
              </p>
            </div>

            {/* Payment Details */}
            <div className="card" style={{ background: '#ffffff', borderRadius: '18px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#7c3aed', fontWeight: '700' }}>
                <CreditCard size={18} /> Payment Information
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Method:</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>{order.paymentMethod || 'RAZORPAY_SANDBOX'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b' }}>Status:</span>
                  <StatusBadge status={order.paymentStatus || 'COMPLETED'} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
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
          <div className="card" style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '440px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              Cancel Order
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Are you sure you want to cancel Order #{order.orderNumber || order.id}? If payment was made, a refund will be initiated to your source account.
            </p>
            <textarea
              rows="3"
              required
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="form-control"
              style={{ marginBottom: '1.25rem' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowCancelModal(false)} className="btn btn-outline">
                Keep Order
              </button>
              <button onClick={handleCancelOrder} disabled={cancelling} className="btn btn-danger">
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
