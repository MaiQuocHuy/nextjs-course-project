import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { RefundRow } from './RefundRow';
import { RefundResponse } from '@/types/instructor/refunds';

type RefundsTableProps = {
  filteredRefunds: RefundResponse[];
};

export const RefundsTable = ({ filteredRefunds }: RefundsTableProps) => {
  return (
    <Card className="shadow-sm border-0 bg-card py-0">
      <CardContent className="p-0">
        <div className="rounded-lg overflow-hidden border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/70 transition-colors">
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                  No.
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Refund ID
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  User
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Amount
                </TableHead>
                {/* <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Reason
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Rejected Reason
                </TableHead> */}
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Requested
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Processed
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRefunds.map((refund, index) => (
                <RefundRow
                  key={refund.id}
                  refund={refund}
                  index={index}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
