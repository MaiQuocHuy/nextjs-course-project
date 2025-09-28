import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { RefundActions } from './RefundActions';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { RefundResponse } from '@/types/instructor/refunds';
import {
  formatCurrency,
  formatDate,
  formatPaymentId,
  getStatusVariant,
  isRefundExpired,
} from '@/utils/instructor/refunds';

interface RefundRowProps {
  index: number;
  refund: RefundResponse;
  style?: React.CSSProperties;
  currentPage: number;
  itemsPerPage: number;
}

const ViewRefundDetail = (id: string) => {
  window.open(`/instructor/refunds/${id}`, '_blank');
};

export const RefundRow = ({
  refund,
  style,
  index,
  currentPage,
  itemsPerPage,
}: RefundRowProps) => {
  const isExpired = isRefundExpired(refund);
  return (
    <TableRow
      className="hover:bg-gray-200 cursor-pointer"
      style={style}
      onClick={() => ViewRefundDetail(refund.id)}
    >
      {/* No. */}
      <TableCell className="text-center">
        {currentPage * itemsPerPage + index + 1}
      </TableCell>

      {/* Refund ID */}
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono text-xs bg-gray-200 px-2 py-1 rounded inline-block">
              {formatPaymentId(refund.id)}
            </div>
          </TooltipTrigger>
          <TooltipContent>{refund.id}</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* User */}
      <TableCell>
        <span>{refund.payment.user?.name}</span>
      </TableCell>

      {/* Refund Amount */}
      <TableCell>
        <span className="">{formatCurrency(refund.amount)}</span>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge
          variant={getStatusVariant(
            isExpired && refund.status === 'PENDING' ? 'EXPIRED' : refund.status
          )}
        >
          {isExpired && refund.status === 'PENDING'
            ? 'PENDING (EXPIRED)'
            : refund.status}
        </Badge>
      </TableCell>

      {/* Requested Dates */}
      <TableCell className="w-[160px]">
        <div className={`text-sm flex gap-2`}>
          <div>
            <p className="">Requested:</p>
            <p className="">{formatDate(refund.requestedAt)}</p>
          </div>
        </div>
      </TableCell>

      {/* Processed Dates */}
      <TableCell className="w-[160px]">
        <div className="text-sm flex gap-2">
          {refund.processedAt ? (
            <div>
              <p className="">Processed:</p>
              <p className="">{formatDate(refund.processedAt)}</p>
            </div>
          ) : (
            <Badge variant="notPaid">Not processed</Badge>
          )}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex justify-center">
          <RefundActions refund={refund} />
        </div>
      </TableCell>
    </TableRow>
  );
};
