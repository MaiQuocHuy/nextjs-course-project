import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AffiliatePayout } from "@/types/instructor/affiliate-payout";
import {
  formatCurrency,
  formatDate,
  formatPayoutId,
  getStatusVariant,
} from "@/utils/instructor/affiliate-payout";
import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";

interface AffiliatePayoutRowProps {
  payout: AffiliatePayout;
  index: number;
}

export const AffiliatePayoutRow = ({
  payout,
  index,
}: AffiliatePayoutRowProps) => {
  const ViewAffiliatePayoutDetail = (id: string) => {
    window.open(`/instructor/affiliate-payout/${id}`, "_blank");
  };

  return (
    <TableRow
      className="hover:bg-gray-200 cursor-pointer"
      style={{
        animationDelay: `${index * 50}ms`,
        cursor: "pointer",
      }}
      onClick={() => ViewAffiliatePayoutDetail(payout.id)}
    >
      {/* No. */}
      <TableCell className="text-right text-sm">{index + 1}</TableCell>

      {/* ID */}
      <TableCell className="p-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono text-xs bg-gray-200 px-2 py-1 rounded inline-block">
              {formatPayoutId(payout.id)}
            </div>
          </TooltipTrigger>
          <TooltipContent>{payout.id}</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Referred By */}
      <TableCell>
        <div className="">{payout.referredByUser.name}</div>
      </TableCell>

      {/* Discount code */}
      <TableCell>
        <div className="">{payout.discountUsage?.discount.code || "N/A"}</div>
      </TableCell>

      {/* Discount type */}
      <TableCell>
        <div className="">{payout.discountUsage?.discount.type || "N/A"}</div>
      </TableCell>

      {/* Course */}
      <TableCell className="truncate">
        <div className="">{payout.course.title}</div>
      </TableCell>

      {/* Commission */}
      <TableCell className=" text-right">
        <div className="">{formatCurrency(payout.commissionAmount)}</div>
      </TableCell>

      {/* Status */}
      <TableCell className="text-center">
        <Badge variant={getStatusVariant(payout.payoutStatus)}>
          {payout.payoutStatus}
        </Badge>
      </TableCell>

      {/* Created At */}
      <TableCell className="">
        <div className="text-sm">{formatDate(payout.createdAt)}</div>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-center">
        <Button
          variant="ghost"
          size="sm"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/instructor/affiliate-payout/${payout.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
};
