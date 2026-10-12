import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { addressService } from '../../services/addressService';
import { prescriptionService } from '../../services/prescriptionService';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { 
  MapPin, 
  Plus, 
  FileText, 
  Upload, 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Pill, 
  ArrowRight,
  Clock
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const Checkout = () => {
  const { cart, requiresPrescription, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY_SANDBOX');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Inline Address Modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    phoneNumber: user?.phoneNumber || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    addressType: 'HOME',
    isDefault: true
  });

  // Inline Prescription Upload Modal
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [rxDoctorName, setRxDoctorName] = useState('');
  const [rxNotes, setRxNotes] = useState('');
  const [uploadingRx, setUploadingRx] = useState(false);

  // Mock Payment Sandbox Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPaymentData, setPendingPaymentData] = useState(null);

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        setLoading(true);
        const [addrRes, rxRes] = await Promise.all([
          addressService.getAllAddresses(),
          requiresPrescription ? prescriptionService.getMyPrescriptions() : Promise.resolve({ data: [] })
        ]);

        const addrList = addrRes?.data || [];
        setAddresses(addrList);
        if (addrList.length > 0) {
          const defaultAddr = addrList.find(a => a.isDefault) || addrList[0];
          setSelectedAddressId(defaultAddr.id);
        }

        if (requiresPrescription) {
          const rxList = rxRes?.data || [];
          setPrescriptions(rxList);
          if (rxList.length > 0) {
            setSelectedPrescriptionId(rxList[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load checkout dependencies', err);
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [requiresPrescription]);

  // Handle Address Save
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        recipientName: newAddress.recipientName,
        phone: newAddress.phoneNumber,
        phoneNumber: newAddress.phoneNumber,
        addressLine1: newAddress.addressLine1,
        addressLine2: newAddress.addressLine2,
        city: newAddress.city,
        state: newAddress.state || 'Karnataka',
        postalCode: newAddress.postalCode,
        country: 'India',
        defaultAddress: newAddress.isDefault,
        isDefault: newAddress.isDefault,
        addressType: newAddress.addressType || 'HOME'
      };
      const res = await addressService.createAddress(payload);
      const created = res.data || res;
      setAddresses([...addresses, created]);
      setSelectedAddressId(created.id);
      setShowAddressModal(false);
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to save address');
    }
  };

  // Handle Prescription Upload
  const handleUploadPrescription = async (e) => {
    e.preventDefault();
    if (!prescriptionFile) {
      alert('Please select an image or PDF prescription document');
      return;
    }
    try {
      setUploadingRx(true);
      const formData = new FormData();
      formData.append('file', prescriptionFile);
      if (rxDoctorName) formData.append('doctorName', rxDoctorName);
      if (rxNotes) formData.append('patientNotes', rxNotes);

      const res = await prescriptionService.uploadPrescription(formData);
      const uploaded = res.data;
      setPrescriptions([uploaded, ...prescriptions]);
      setSelectedPrescriptionId(uploaded.id);
      setShowPrescriptionModal(false);
      setPrescriptionFile(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to upload prescription');
    } finally {
      setUploadingRx(false);
    }
  };

  // Submit Checkout
  const handlePlaceOrder = async () => {
    setError('');

    if (!selectedAddressId) {
      setError('Please select or add a delivery address.');
      return;
    }

    if (requiresPrescription && !selectedPrescriptionId) {
      setError('Prescription required: Please attach an approved or pending prescription.');
      return;
    }

    try {
      setProcessing(true);
      const checkoutPayload = {
        deliveryAddressId: selectedAddressId,
        prescriptionId: selectedPrescriptionId,
        paymentMethod,
        customerNotes
      };

      const res = await orderService.checkoutOrder(checkoutPayload);
      const createdOrder = res.data;
      await refreshCart();

      // If Razorpay Sandbox, initiate simulated payment flow
      if (paymentMethod === 'RAZORPAY_SANDBOX') {
        const payInitRes = await paymentService.initiatePayment(createdOrder.id);
        setPendingPaymentData({
          order: createdOrder,
          payment: payInitRes.data
        });
        setShowPaymentModal(true);
      } else {
        // COD or Direct confirmation
        navigate(`/orders/${createdOrder.id}?success=true`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to place order.');
    } finally {
      setProcessing(false);
    }
  };

  // Complete Simulated Sandbox Payment
  const handleCompleteMockPayment = async () => {
    try {
      setProcessing(true);
      const { payment, order } = pendingPaymentData;
      await paymentService.verifyPayment({
        orderId: order.id,
        paymentId: payment.id,
        razorpayPaymentId: 'pay_mock_' + Math.random().toString(36).substring(7),
        razorpayOrderId: payment.razorpayOrderId || 'order_mock_' + order.id,
        razorpaySignature: 'sig_mock_verified'
      });
      setShowPaymentModal(false);
      navigate(`/orders/${order.id}?paid=true`);
    } catch (err) {
      alert('Mock payment failed: ' + (err?.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Preparing checkout details..." />;
  }

  const items = cart?.items || [];
  const subtotal = Number(cart?.subtotal || 0);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
            Checkout & Verification
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            Confirm delivery address, attach medical prescription, and select payment method.
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#991b1b'
          }}>
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* 2 Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Main Form Sections */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Delivery Address Card */}
            <div className="card" style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={20} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
                    1. Delivery Address
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                >
                  <Plus size={16} /> Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                  <MapPin size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    No delivery addresses found on your account.
                  </p>
                  <button onClick={() => setShowAddressModal(true)} className="btn btn-primary">
                    <Plus size={16} /> Add Address
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        style={{
                          border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                          background: isSelected ? '#f0f9ff' : '#ffffff',
                          borderRadius: '14px',
                          padding: '1.25rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                            {addr.recipientName || 'Recipient'}
                          </span>
                          <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                            {addr.addressType || 'HOME'}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 0.35rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                          {addr.addressLine1} {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          Phone: {addr.phoneNumber || addr.phone || 'N/A'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Prescription Card (if required) */}
            {requiresPrescription && (
              <div className="card" style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
                        2. Prescription Verification (Mandatory)
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: '#e11d48', fontWeight: '600' }}>
                        Contains Schedule H/X drugs requiring registered doctor's prescription
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPrescriptionModal(true)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                  >
                    <Upload size={16} /> Upload New
                  </button>
                </div>

                {prescriptions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#fff1f2', borderRadius: '14px', border: '1px dashed #fca5a5' }}>
                    <AlertTriangle size={32} color="#e11d48" style={{ margin: '0 auto 0.5rem' }} />
                    <h4 style={{ color: '#9f1239', fontWeight: '700', marginBottom: '0.25rem' }}>
                      No Prescription Attached
                    </h4>
                    <p style={{ color: '#be123c', fontSize: '0.85rem', marginBottom: '1rem', maxWidth: '400px', margin: '0 auto 1rem' }}>
                      Upload a photo or PDF of your doctor's prescription so our pharmacists can verify and release your order.
                    </p>
                    <button onClick={() => setShowPrescriptionModal(true)} className="btn btn-primary" style={{ background: '#e11d48', borderColor: '#e11d48' }}>
                      <Upload size={16} /> Upload Prescription
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {prescriptions.map((rx) => {
                      const isSelected = selectedPrescriptionId === rx.id;
                      return (
                        <div
                          key={rx.id}
                          onClick={() => setSelectedPrescriptionId(rx.id)}
                          style={{
                            border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                            background: isSelected ? '#f0f9ff' : '#ffffff',
                            borderRadius: '14px',
                            padding: '1.25rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>
                              Rx #{rx.id}
                            </span>
                            <span className={`badge ${rx.status === 'VERIFIED' ? 'badge-success' : rx.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                              {rx.status}
                            </span>
                          </div>
                          <p style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#475569' }}>
                            Doctor: {rx.doctorName || 'Not specified'}
                          </p>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Uploaded: {new Date(rx.uploadedAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. Payment Method Card */}
            <div className="card" style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
                  {requiresPrescription ? '3' : '2'}. Payment Method
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '14px',
                  border: paymentMethod === 'RAZORPAY_SANDBOX' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  background: paymentMethod === 'RAZORPAY_SANDBOX' ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'RAZORPAY_SANDBOX'}
                    onChange={() => setPaymentMethod('RAZORPAY_SANDBOX')}
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                      Razorpay Online Payment (Sandbox Simulated)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Instant secure checkout with Credit/Debit Cards, UPI (GPay, PhonePe), NetBanking.
                    </div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '14px',
                  border: paymentMethod === 'CASH_ON_DELIVERY' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  background: paymentMethod === 'CASH_ON_DELIVERY' ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                      Cash on Delivery (Pay at Doorstep)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Hand payment to the cold-chain courier upon verified delivery.
                    </div>
                  </div>
                </label>
              </div>

              {/* Order Notes */}
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                  Special Delivery Instructions / Patient Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Leave with security guard, call before delivery..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="form-control"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          {/* Checkout Summary Sidebar */}
          <div>
            <div className="card" style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
                Order Summary
              </h3>

              {/* Mini Item List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem', maxHeight: '180px', overflowY: 'auto' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                      {item.quantity}x {item.medicineName}
                    </span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>
                      ₹{Number(item.itemTotal || (item.unitPrice * item.quantity)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: '#64748b', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Items Subtotal</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Cold-Chain Express Delivery</span>
                  <span style={{ fontWeight: '700', color: deliveryFee === 0 ? '#16a34a' : '#0f172a' }}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Total Payable</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0284c7' }}>₹{total.toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={processing}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', justifyContent: 'center', borderRadius: '12px' }}
              >
                {processing ? (
                  <span className="spinner-border spinner-border-sm" role="status" />
                ) : (
                  <>
                    Confirm & Place Order <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                By ordering, you acknowledge that prescription medicines will be reviewed by a pharmacist before dispatch.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Add Address Modal */}
      {showAddressModal && (
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
          <div className="card" style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
              Add Delivery Address
            </h3>

            <form onSubmit={handleSaveAddress}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newAddress.phoneNumber}
                    onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Flat/House No., Building, Street..."
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>City *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>PIN *</label>
                  <input
                    type="text"
                    required
                    placeholder="PIN Code"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddressModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Upload Prescription Modal */}
      {showPrescriptionModal && (
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
          <div className="card" style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
              Upload Medical Prescription
            </h3>

            <form onSubmit={handleUploadPrescription}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                  Select File (Image or PDF) *
                </label>
                <input
                  type="file"
                  required
                  accept="image/*,application/pdf"
                  onChange={(e) => setPrescriptionFile(e.target.files[0])}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                  Doctor's Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. R. Sharma, MD"
                  value={rxDoctorName}
                  onChange={(e) => setRxDoctorName(e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                  Patient Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Any dosage details or doctor instructions..."
                  value={rxNotes}
                  onChange={(e) => setRxNotes(e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowPrescriptionModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={uploadingRx} className="btn btn-primary">
                  {uploadingRx ? 'Uploading...' : 'Upload & Attach'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Razorpay Mock Payment Sandbox */}
      {showPaymentModal && pendingPaymentData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="card" style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem', maxWidth: '440px', width: '100%', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: '#0284c7',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 8px 16px rgba(2, 132, 199, 0.25)'
            }}>
              <CreditCard size={32} />
            </div>

            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>
              Razorpay Sandbox Simulation
            </span>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: '0.25rem 0 0.5rem' }}>
              Pay ₹{Number(pendingPaymentData.payment.amount).toFixed(2)}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Order #{pendingPaymentData.order.orderNumber || pendingPaymentData.order.id}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleCompleteMockPayment}
                disabled={processing}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', borderRadius: '12px' }}
              >
                {processing ? 'Verifying payment...' : 'Simulate Successful Payment'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  navigate(`/orders/${pendingPaymentData.order.id}`);
                }}
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', borderRadius: '12px' }}
              >
                Pay Later / Review Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
