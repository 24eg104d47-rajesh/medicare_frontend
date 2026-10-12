import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Package, ArrowRight, Clock, AlertCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders({ page, size: 10 });
        setOrders(res.data?.content || []);
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  if (loading) {
    return <LoadingSpinner fullPage message="Fetching your orders..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
            My Orders
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            Track your pharmaceutical shipments, prescription approvals, and delivery milestones.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="card" style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
            maxWidth: '520px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Package size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              No orders placed yet
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Explore our verified medicines and place your first order today.
            </p>
            <Link to="/medicines" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Browse Medicines
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => {
              const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={order.id}
                  className="card"
                  style={{
                    background: '#ffffff',
                    borderRadius: '18px',
                    padding: '1.5rem 1.75rem',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'box-shadow 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0284c7'
                      }}>
                        <Package size={22} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                            Order #{order.orderNumber || order.id}
                          </h3>
                          <StatusBadge status={order.orderStatus} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          Placed on {orderDate}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Total Paid</span>
                        <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                          ₹{Number(order.totalAmount).toFixed(2)}
                        </span>
                      </div>

                      <Link
                        to={`/orders/${order.id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      >
                        Track & View <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>

                  {/* Order items preview summary */}
                  {order.orderItems && order.orderItems.length > 0 && (
                    <div style={{
                      paddingTop: '0.85rem',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      color: '#475569'
                    }}>
                      {order.orderItems.map((item, idx) => (
                        <span key={item.id || idx} style={{ background: '#f8fafc', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          {item.quantity}x {item.medicineName || 'Medicine'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
