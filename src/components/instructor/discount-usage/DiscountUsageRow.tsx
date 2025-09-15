import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DiscountUsage } from "@/types/instructor/discount-usage";
import {
  formatCurrency,
  formatDate,
  formatUsageId,
} from "@/utils/instructor/discount-usage";
import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";

interface DiscountUsageRowProps {
  discountUsage: DiscountUsage;
  index: number;
}

export const DiscountUsageRow = ({
  discountUsage,
  index,
}: DiscountUsageRowProps) => {
  const ViewDiscountUsageDetail = (id: string) => {
    window.open(`/instructor/discount-usage/${id}`, "_blank");
  };

  return (
    <TableRow
      className="hover:bg-gray-200 cursor-pointer"
      style={{
        animationDelay: `${index * 50}ms`,
        cursor: "pointer",
      }}
      onClick={() => ViewDiscountUsageDetail(discountUsage.id)}
    >
      {/* No. */}
      <TableCell className="text-right text-sm">{index + 1}</TableCell>

      {/* ID */}
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono text-xs bg-gray-200 px-2 py-1 rounded inline-block">
              {formatUsageId(discountUsage.id)}
            </div>
          </TooltipTrigger>
          <TooltipContent>{discountUsage.id}</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Discount Code */}
      <TableCell>
        <span className="text-sm">{discountUsage.discount.code}</span>
      </TableCell>
      {/* Discount Type */}
      <TableCell>
        <div>
          <span className="text-sm">{discountUsage.discount.type}</span>
        </div>
      </TableCell>

      {/* User */}
      <TableCell>
        <span className="text-sm">{discountUsage.user.name}</span>
      </TableCell>

      {/* Course */}
      <TableCell>
        <span className="text-sm">{discountUsage.course.title}</span>
      </TableCell>

      {/* Discount Amount */}
      <TableCell className="text-right">
        <span className="text-sm">
          {formatCurrency(discountUsage.discountAmount)}
        </span>
      </TableCell>

      {/* Used At */}
      <TableCell>
        <span className="text-sm">{formatDate(discountUsage.usedAt)}</span>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-center">
        <Button
          variant="ghost"
          size="sm"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/instructor/discount-usage/${discountUsage.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
};
