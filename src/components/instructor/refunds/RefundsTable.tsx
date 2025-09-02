import { usePathname, useRouter } from 'next/navigation';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcwIcon } from 'lucide-react';
import { RefundRow } from './RefundRow';
import { RefundResponse } from '@/types/instructor/refunds';

type RefundsTableProps = {
  filteredRefunds: RefundResponse[];
  refetch?: () => void;
};

export const RefundsTable = ({ filteredRefunds, refetch }: RefundsTableProps) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const handleRefresh = () => {
    // Refresh the current page
    if (refetch) {
      refetch();
    }
  };

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
              {filteredRefunds
                .slice(
                  0,
                  pathname === '/instructor' ? 3 : filteredRefunds.length
                )
                .map((refund, index) => (
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
          
          {pathname === '/instructor' && (
            <div className="flex justify-end gap-2 py-4 px-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="text-sm"
              >
                <RefreshCcwIcon className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              
              {filteredRefunds.length > 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/instructor/refunds')}
                  className="text-sm"
                >
                  View More Refunds
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
