import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Package, ArrowRight, Truck, CheckCircle2, XCircle, Search } from 'lucide-react';

const nextStatusOptions = {
  PENDING_PRESCRIPTION_REVIEW: 'CONFIRMED',
  PAYMENT_PENDING: 'CONFIRMED',
  CONFIRMED: 'PROCESSING',
  PROCESSING: 'DISPATCHED',
  DISPATCHED: 'DELIVERED'
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { page, size: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await orderService.getAllOrders(params);
      setOrders(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleAdvanceStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await orderService.updateOrderStatus(orderId, {
        status: newStatus,
        notes: `Advanced to ${newStatus} by pharmacy admin.`
      });
      fetchOrders();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
            Pharmacy Order Dispatch & State Machine
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            Process confirmed orders, execute FEFO stock picking, and manage courier dispatch.
          </p>
        </div>

        {/* Filter bar */}
        <div className="card" style={{ background: '#fff', borderRadius: '16px', padding: '1rem 1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="form-control"
            style={{ maxWidth: '240px', fontSize: '0.85rem' }}
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DISPATCHED">DISPATCHED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="PENDING_PRESCRIPTION_REVIEW">PENDING_PRESCRIPTION_REVIEW</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="card" style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {loading ? (
            <LoadingSpinner fullPage message="Fetching orders..." />
          ) : orders.length === 0 ? (
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <Package size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h3>No orders found</h3>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '1rem 1.5rem' }}>Order</th>
                      <th style={{ padding: '1rem' }}>Customer</th>
                      <th style={{ padding: '1rem' }}>Amount</th>
                      <th style={{ padding: '1rem' }}>Payment</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Fulfillment Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => {
                      const nextStatus = nextStatusOptions[ord.orderStatus];
                      const isUpdating = updatingId === ord.id;

                      return (
                        <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ fontWeight: '700', color: '#0f172a' }}>
                              #{ord.orderNumber || ord.id}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td style={{ padding: '1rem', color: '#334155' }}>
                            {ord.customerEmail || `Customer #${ord.customerId}`}
                          </td>
                          <td style={{ padding: '1rem', fontWeight: '700', color: '#0f172a' }}>
                            ₹{Number(ord.totalAmount).toFixed(2)}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <StatusBadge status={ord.paymentStatus || 'COMPLETED'} size="sm" />
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <StatusBadge status={ord.orderStatus} size="sm" />
                          </td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                            {nextStatus ? (
                              <button
                                onClick={() => handleAdvanceStatus(ord.id, nextStatus)}
                                disabled={isUpdating}
                                className="btn btn-primary"
                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', borderRadius: '8px' }}
                              >
                                {isUpdating ? 'Updating...' : `Move to ${nextStatus}`} &rarr;
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                Terminal State
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
