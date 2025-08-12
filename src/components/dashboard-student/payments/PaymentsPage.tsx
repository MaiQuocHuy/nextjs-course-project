"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentsTable } from "./PaymentsTable";

export interface Payment {
  id: string;
  courseTitle: string;
  amount: number;
  status: "success" | "pending" | "failed";
  date: string; // ISO string
}

// Mock payment data
const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    courseTitle: "React for Beginners",
    amount: 89.99,
    status: "success",
    date: "2024-07-20T10:30:00Z",
  },
  {
    id: "PAY-002",
    courseTitle: "Advanced TypeScript",
    amount: 129.99,
    status: "success",
    date: "2024-07-18T14:15:00Z",
  },
  {
    id: "PAY-003",
    courseTitle: "Next.js Full Stack",
    amount: 199.99,
    status: "pending",
    date: "2024-07-22T09:45:00Z",
  },
  {
    id: "PAY-004",
    courseTitle: "Python Web Development",
    amount: 149.99,
    status: "failed",
    date: "2024-07-21T16:20:00Z",
  },
  {
    id: "PAY-005",
    courseTitle: "Docker & Kubernetes",
    amount: 179.99,
    status: "success",
    date: "2024-07-19T11:00:00Z",
  },
  {
    id: "PAY-006",
    courseTitle: "GraphQL with Node.js",
    amount: 139.99,
    status: "pending",
    date: "2024-07-17T13:30:00Z",
  },
  {
    id: "PAY-007",
    courseTitle: "Vue.js Fundamentals",
    amount: 99.99,
    status: "success",
    date: "2024-07-16T08:45:00Z",
  },
  {
    id: "PAY-008",
    courseTitle: "AWS Cloud Practitioner",
    amount: 249.99,
    status: "failed",
    date: "2024-07-15T15:10:00Z",
  },
];

export function PaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground">
          View and manage your course payment transactions
        </p>
      </div>

      {/* Payment Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {mockPayments
                .filter((p) => p.status === "success")
                .reduce((sum, p) => sum + p.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {mockPayments.filter((p) => p.status === "success").length}{" "}
              successful transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPayments.filter((p) => p.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPayments.filter((p) => p.status === "failed").length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              All payment attempts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <PaymentsTable payments={mockPayments} />
        </CardContent>
      </Card>
    </div>
  );
}
