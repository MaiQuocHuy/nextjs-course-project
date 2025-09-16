export const getTypeVariant = (type: string) => {
  switch (type) {
    case 'REFERRAL':
      return 'outline' as const;
    case 'GENERAL':
      return 'secondary' as const;
    default:
      return 'secondary' as const;
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

export const formatUsageId = (id: string) => {
  return id.slice(0, 8).toUpperCase();
};
