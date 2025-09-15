import { Payment } from "@/types/student";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, BookOpen, Clock } from "lucide-react";

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    // Show time for messages within 24 hours
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } else if (diffInHours < 24 * 7) {
    // Show day and time for messages within a week
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } else {
    // Show full date for older messages
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const getPaymentMethodDisplay = (
  paymentMethod: string
): React.ReactNode => {
  switch (paymentMethod) {
    case "CREDIT_CARD":
      return "Credit Card";
    case "PAYPAL":
      return "PayPal";
    case "BANK_TRANSFER":
      return "Bank Transfer";
    default:
      return paymentMethod;
  }
};

export const getPaymentStatusBadge = (status: Payment["status"]) => {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
          Completed
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">
          Pending
        </Badge>
      );
    case "FAILED":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
          Failed
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 text-xs">
          Refunded
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {status}
        </Badge>
      );
  }
};

export const getAffiliateStatusBadge = (status: string) => {
  switch (status) {
    case "PAID":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
          Paid
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">
          Pending
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {status}
        </Badge>
      );
  }
};

export const getCertificateStatusBadge = (status: string) => {
  switch (status) {
    case "GENERATED":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
          Generated
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">
          Pending
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {status}
        </Badge>
      );
  }
};

export function getActivityIcon(type: string) {
  switch (type) {
    case "LESSON_COMPLETION":
      return <CheckCircle className="h-4 w-4 text-green-600 mt-1" />;
    case "QUIZ_SUBMISSION":
      return <FileText className="h-4 w-4 text-blue-600 mt-1" />;
    case "ENROLLMENT":
      return <BookOpen className="h-4 w-4 text-purple-600 mt-1" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600 mt-1" />;
  }
}

export function getActivityBadge(type: string) {
  switch (type) {
    case "LESSON_COMPLETION":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Completed
        </Badge>
      );
    case "QUIZ_SUBMISSION":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Quiz
        </Badge>
      );
    case "ENROLLMENT":
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          Enrolled
        </Badge>
      );
    default:
      return null;
  }
}
