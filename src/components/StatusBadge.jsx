import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Truck, 
  Package, 
  XCircle, 
  CreditCard, 
  FileCheck, 
  FileX 
} from 'lucide-react';

const statusConfigs = {
  // Order Statuses
  PENDING_PRESCRIPTION_REVIEW: {
    label: 'Rx Review Pending',
    bg: '#fef3c7',
    color: '#92400e',
    borderColor: '#fde68a',
    icon: Clock
  },
  PAYMENT_PENDING: {
    label: 'Payment Pending',
    bg: '#e0f2fe',
    color: '#075985',
    borderColor: '#bae6fd',
    icon: CreditCard
  },
  CONFIRMED: {
    label: 'Confirmed',
    bg: '#ede9fe',
    color: '#5b21b6',
    borderColor: '#ddd6fe',
    icon: CheckCircle
  },
  PROCESSING: {
    label: 'Processing',
    bg: '#e0e7ff',
    color: '#3730a3',
    borderColor: '#c7d2fe',
    icon: Package
  },
  DISPATCHED: {
    label: 'Dispatched',
    bg: '#ccfbf1',
    color: '#115e59',
    borderColor: '#99f6e4',
    icon: Truck
  },
  DELIVERED: {
    label: 'Delivered',
    bg: '#d1fae5',
    color: '#065f46',
    borderColor: '#a7f3d0',
    icon: CheckCircle
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: '#fee2e2',
    color: '#991b1b',
    borderColor: '#fecaca',
    icon: XCircle
  },
  REJECTED: {
    label: 'Rejected',
    bg: '#fee2e2',
    color: '#991b1b',
    borderColor: '#fecaca',
    icon: XCircle
  },

  // Prescription Statuses
  PENDING: {
    label: 'Pending Review',
    bg: '#fef3c7',
    color: '#92400e',
    borderColor: '#fde68a',
    icon: Clock
  },
  VERIFIED: {
    label: 'Approved / Verified',
    bg: '#d1fae5',
    color: '#065f46',
    borderColor: '#a7f3d0',
    icon: FileCheck
  },
  APPROVED: {
    label: 'Approved',
    bg: '#d1fae5',
    color: '#065f46',
    borderColor: '#a7f3d0',
    icon: FileCheck
  },

  // Payment Statuses
  COMPLETED: {
    label: 'Paid / Completed',
    bg: '#d1fae5',
    color: '#065f46',
    borderColor: '#a7f3d0',
    icon: CheckCircle
  },
  FAILED: {
    label: 'Payment Failed',
    bg: '#fee2e2',
    color: '#991b1b',
    borderColor: '#fecaca',
    icon: AlertCircle
  },
  REFUNDED: {
    label: 'Refunded',
    bg: '#f1f5f9',
    color: '#475569',
    borderColor: '#e2e8f0',
    icon: CheckCircle
  }
};

const StatusBadge = ({ status, size = 'md' }) => {
  if (!status) return null;

  const config = statusConfigs[status] || {
    label: status.replace(/_/g, ' '),
    bg: '#f1f5f9',
    color: '#475569',
    borderColor: '#cbd5e1',
    icon: Clock
  };

  const Icon = config.icon;
  const isSm = size === 'sm';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: isSm ? '4px' : '6px',
      padding: isSm ? '0.15rem 0.5rem' : '0.3rem 0.75rem',
      borderRadius: '9999px',
      fontSize: isSm ? '0.72rem' : '0.8rem',
      fontWeight: '700',
      backgroundColor: config.bg,
      color: config.color,
      border: `1px solid ${config.borderColor}`,
      textTransform: 'capitalize',
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap'
    }}>
      <Icon size={isSm ? 12 : 14} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
