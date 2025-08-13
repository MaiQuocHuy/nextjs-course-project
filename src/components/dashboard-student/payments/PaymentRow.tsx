"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  BadgeCheck,
  Clock,
  XCircle,
  Eye,
  MoreVertical,
  Download,
  RefreshCw,
} from "lucide-react";
import { Payment } from "./PaymentsPage";

interface PaymentRowProps {
  payment: Payment;
  isMobile?: boolean;
}

function getStatusBadge(status: Payment["status"]) {
  switch (status) {
    case "success":
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        >
          <BadgeCheck className="h-3 w-3 mr-1" />
          Success
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        >
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        >
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      );
    default:
      return null;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function PaymentRow({ payment, isMobile = false }: PaymentRowProps) {
  // Mobile Card Layout
  if (isMobile) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header with Transaction ID and Status */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground ">
                  Transaction ID
                </p>
                <p className="font-mono text-sm">{payment.id}</p>
              </div>
              {getStatusBadge(payment.status)}
            </div>

            {/* Course Title */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Course
              </p>
              <p className="font-semibold">{payment.courseTitle}</p>
            </div>

            {/* Amount and Date */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Amount
                </p>
                <p className="text-lg font-bold">
                  {formatAmount(payment.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">
                  Date
                </p>
                <p className="text-sm">{formatDate(payment.date)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </DropdownMenuItem>
                  {payment.status === "failed" && (
                    <DropdownMenuItem>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Payment
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Desktop Table Row Layout
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-mono text-sm pl-10">{payment.id}</TableCell>
      <TableCell>
        <div className="font-medium">{payment.courseTitle}</div>
      </TableCell>
      <TableCell className="font-semibold">
        {formatAmount(payment.amount)}
      </TableCell>
      <TableCell>{getStatusBadge(payment.status)}</TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(payment.date)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 pr-10">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </DropdownMenuItem>
              {payment.status === "failed" && (
                <DropdownMenuItem>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Payment
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
