import { Payment } from "@/types/student";
import { Badge } from "@/components/ui/badge";

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
