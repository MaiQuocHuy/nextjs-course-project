"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Shield,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentData {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  promoCode: string;
}

interface PaymentFormProps {
  total: number;
  onPayment: (paymentData: PaymentData) => Promise<void>;
  loading?: boolean;
  onPromoApply?: (code: string) => void;
  promoApplied?: boolean;
  promoError?: string;
}

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(" ");
  } else {
    return v;
  }
};

const formatExpiryDate = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  if (v.length >= 2) {
    return v.substring(0, 2) + "/" + v.substring(2, 4);
  }
  return v;
};

export function PaymentForm({
  total,
  onPayment,
  loading = false,
  onPromoApply,
  promoApplied = false,
  promoError,
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentData>({
    cardName: "John Doe", // Pre-filled for demo
    cardNumber: "4242 4242 4242 4242", // Pre-filled for demo
    expiryDate: "12/25", // Pre-filled for demo
    cvv: "123", // Pre-filled for demo
    promoCode: "",
  });

  const [errors, setErrors] = useState<Partial<PaymentData>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof PaymentData, boolean>>
  >({});
  const [showPromoCode, setShowPromoCode] = useState(false);

  const validateField = (name: keyof PaymentData, value: string) => {
    switch (name) {
      case "cardName":
        return value.trim().length < 2
          ? "Name must be at least 2 characters"
          : "";
      case "cardNumber":
        const cleanNumber = value.replace(/\s/g, "");
        return cleanNumber.length !== 16 ? "Card number must be 16 digits" : "";
      case "expiryDate":
        const [month, year] = value.split("/");
        if (!month || !year || month.length !== 2 || year.length !== 2) {
          return "Invalid expiry date format (MM/YY)";
        }
        const monthNum = parseInt(month);
        if (monthNum < 1 || monthNum > 12) {
          return "Invalid month";
        }
        return "";
      case "cvv":
        return value.length < 3 ? "CVV must be at least 3 digits" : "";
      default:
        return "";
    }
  };

  const handleFieldChange = (name: keyof PaymentData, value: string) => {
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (name === "cvv") {
      formattedValue = value.replace(/[^0-9]/g, "").substring(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (touched[name]) {
      const error = validateField(name, formattedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleFieldBlur = (name: keyof PaymentData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<PaymentData> = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "promoCode") {
        const error = validateField(
          key as keyof PaymentData,
          formData[key as keyof PaymentData]
        );
        if (error) newErrors[key as keyof PaymentData] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      cardName: true,
      cardNumber: true,
      expiryDate: true,
      cvv: true,
    });

    if (Object.keys(newErrors).length === 0) {
      await onPayment(formData);
    }
  };

  const handlePromoApply = () => {
    if (onPromoApply && formData.promoCode.trim()) {
      onPromoApply(formData.promoCode.trim());
    }
  };

  const isFormValid =
    Object.values(errors).every((error) => !error) &&
    formData.cardName &&
    formData.cardNumber &&
    formData.expiryDate &&
    formData.cvv;

  return (
    <Card className="w-full shadow-xl border-0 bg-white dark:bg-gray-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Payment Information
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Enter your payment details securely
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Security Badge */}
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400 font-medium">
              Your payment information is encrypted and secure
            </span>
          </div>

          {/* Promo Code Section */}
          {!showPromoCode ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPromoCode(true)}
              className="w-full"
            >
              <Tag className="w-4 h-4 mr-2" />
              Have a promo code?
            </Button>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="promoCode">Promo Code</Label>
              <div className="flex gap-2">
                <Input
                  id="promoCode"
                  placeholder="Enter promo code"
                  value={formData.promoCode}
                  onChange={(e) =>
                    handleFieldChange("promoCode", e.target.value)
                  }
                  className={cn(
                    promoApplied && "border-green-500",
                    promoError && "border-red-500"
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePromoApply}
                  disabled={!formData.promoCode.trim() || promoApplied}
                >
                  {promoApplied ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              {promoApplied && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Promo code applied successfully!
                </p>
              )}
              {promoError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {promoError}
                </p>
              )}
            </div>
          )}

          <Separator />

          {/* Card Name */}
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={formData.cardName}
              onChange={(e) => handleFieldChange("cardName", e.target.value)}
              onBlur={() => handleFieldBlur("cardName")}
              className={cn(
                errors.cardName && touched.cardName && "border-red-500"
              )}
              disabled={loading}
            />
            {errors.cardName && touched.cardName && (
              <p className="text-sm text-red-600">{errors.cardName}</p>
            )}
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => handleFieldChange("cardNumber", e.target.value)}
              onBlur={() => handleFieldBlur("cardNumber")}
              className={cn(
                errors.cardNumber && touched.cardNumber && "border-red-500"
              )}
              maxLength={19}
              disabled={loading}
            />
            {errors.cardNumber && touched.cardNumber && (
              <p className="text-sm text-red-600">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleFieldChange("expiryDate", e.target.value)
                }
                onBlur={() => handleFieldBlur("expiryDate")}
                className={cn(
                  errors.expiryDate && touched.expiryDate && "border-red-500"
                )}
                maxLength={5}
                disabled={loading}
              />
              {errors.expiryDate && touched.expiryDate && (
                <p className="text-sm text-red-600">{errors.expiryDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => handleFieldChange("cvv", e.target.value)}
                onBlur={() => handleFieldBlur("cvv")}
                className={cn(errors.cvv && touched.cvv && "border-red-500")}
                maxLength={4}
                disabled={loading}
              />
              {errors.cvv && touched.cvv && (
                <p className="text-sm text-red-600">{errors.cvv}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You will be charged immediately upon clicking "Complete Payment"
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Complete Payment ${total.toFixed(2)}
              </>
            )}
          </Button>

          {/* Security Note */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By completing this purchase, you agree to our Terms of Service and
            Privacy Policy.
            <br />
            This is a secure 256-bit SSL encrypted payment.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
