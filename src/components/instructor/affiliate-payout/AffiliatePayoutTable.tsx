import { Card, CardContent } from "@/components/ui/card";
import { AffiliatePayoutRow } from "./AffiliatePayoutRow";
import { AffiliatePayout } from "@/types/instructor/affiliate-payout";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AffiliatePayoutTableProps {
  filteredPayouts: AffiliatePayout[];
}

export const AffiliatePayoutTable = ({
  filteredPayouts,
}: AffiliatePayoutTableProps) => {
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
                  ID
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Referred By
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Discount code
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Discount type
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Course
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-right">
                  Commission
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Created At
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide w-20">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredPayouts.map((payout, index) => (
                <AffiliatePayoutRow
                  key={payout.id}
                  payout={payout}
                  index={index}
                />
              ))}
            </tbody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
