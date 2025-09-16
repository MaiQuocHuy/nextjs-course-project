"use client";

import { use } from "react";
import { AffiliatePayoutDetailPage } from "@/components/instructor/affiliate-payout/AffiliatePayoutDetailPage";

interface AffiliatePayoutDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AffiliatePayoutDetailPageRoute({
  params,
}: AffiliatePayoutDetailPageProps) {
  return <AffiliatePayoutDetailPage />;
}
