"use client";

import { use } from "react";
import { DiscountUsageDetailPage } from "@/components/instructor/discount-usage/DiscountUsageDetailPage";

interface DiscountUsageDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DiscountUsageDetailPageRoute({
  params,
}: DiscountUsageDetailPageProps) {
  return <DiscountUsageDetailPage />;
}
