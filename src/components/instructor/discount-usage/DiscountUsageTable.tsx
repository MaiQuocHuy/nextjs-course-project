import { Card, CardContent } from "@/components/ui/card";
import { DiscountUsageRow } from "./DiscountUsageRow";
import { DiscountUsage } from "@/types/instructor/discount-usage";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DiscountUsageTableProps {
  filteredUsages: DiscountUsage[];
}

export const DiscountUsageTable = ({
  filteredUsages,
}: DiscountUsageTableProps) => {
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
                  Discount Code
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Discount Type
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  User
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Course
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-right">
                  Amount
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">
                  Used At
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredUsages.map((usage, index) => (
                <DiscountUsageRow
                  key={usage.id}
                  discountUsage={usage}
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
