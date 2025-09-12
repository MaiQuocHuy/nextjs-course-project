export const getStatusColor = (status: string) => {
  if (status) status = status.toLowerCase();
  switch (status) {
    case 'approved':
      return 'text-green-700 bg-green-100 px-5 py-1 rounded-lg font-medium';
    case 'pending':
      return 'text-yellow-700 bg-yellow-100 px-5 py-1 rounded-lg font-medium';
    case 'denied':
      return 'text-red-700 bg-red-100 px-5 py-1 rounded-lg font-medium';
    case 'resubmitted':
      return 'text-purple-700 bg-purple-100 px-5 py-1 rounded-lg font-medium';
    default:
      // Draft
      return 'text-blue-700 bg-blue-100 px-5 py-1 rounded-lg font-medium';
  }
};
