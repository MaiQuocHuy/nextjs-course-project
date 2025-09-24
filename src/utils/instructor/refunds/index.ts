import { RefundResponse } from '@/types/instructor/refunds';

export const getStatusVariant = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'completed' as const;
    case 'PENDING':
      return 'pending' as const;
    case 'FAILED':
      return 'failed' as const;
    default:
      return 'refunded' as const;
  }
};

export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPaymentId = (id: string) => {
  return id.slice(0, 8).toUpperCase();
};

export const isRefundExpired = (refund: RefundResponse) => {
  if (!refund.requestedAt) return false;
  const requestedDate = new Date(refund.requestedAt);
  const now = new Date();
  const diffInDays =
    (now.getTime() - requestedDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays > 3; // Refund expires after 3 days
};
