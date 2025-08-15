export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'DENIED':
      return 'bg-red-100 text-red-800';
    case 'RESUBMITTED':
      return 'bg-blue-100 text-blue-800';
    // Unpublished
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getCourseStatus = (statusReview: string) => {
  if (statusReview) {
    statusReview = statusReview.toUpperCase();
    if (statusReview === 'APPROVED') {
      return 'PUBLISHED';
    } else return statusReview;
  } else {
    return 'UNPUBLISHED';
  }
};
