import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
} from 'lucide-react';

export const EarningsPage = () => {
  // const { stats, withdrawals } = useSelector(
  //   (state: RootState) => state.earnings
  // );
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  // const earningsCards = [
  //   {
  //     title: 'Total Revenue',
  //     value: `$${stats.totalRevenue.toLocaleString()}`,
  //     description: 'All-time earnings',
  //     icon: DollarSign,
  //     color: 'text-primary',
  //   },
  //   {
  //     title: 'Available Balance',
  //     value: `$${stats.availableBalance.toLocaleString()}`,
  //     description: 'Ready for withdrawal',
  //     icon: Wallet,
  //     color: 'text-success',
  //   },
  //   {
  //     title: 'This Month',
  //     value: `$${
  //       stats.monthlyRevenue[
  //         stats.monthlyRevenue.length - 1
  //       ]?.amount.toLocaleString() || '0'
  //     }`,
  //     description: '+15% from last month',
  //     icon: TrendingUp,
  //     color: 'text-warning',
  //   },
  //   {
  //     title: 'Total Courses',
  //     value: stats.courseRevenue.length,
  //     description: 'Revenue generating',
  //     icon: BookOpen,
  //     color: 'text-instructor-accent',
  //   },
  // ];

  return (
    // <div className="space-y-6">
    //   {/* Header */}
    //   <div className="flex items-center justify-between">
    //     <div>
    //       <h1 className="text-3xl font-bold">Earnings</h1>
    //       <p className="text-muted-foreground">
    //         Track your revenue and manage withdrawals
    //       </p>
    //     </div>
    //     <div className="flex gap-3">
    //       <Button variant="outline">
    //         <Download className="mr-2 h-4 w-4" />
    //         Export Report
    //       </Button>
    //       <Dialog>
    //         <DialogTrigger asChild>
    //           <Button className="bg-gradient-primary">
    //             <ArrowDownRight className="mr-2 h-4 w-4" />
    //             Withdraw Funds
    //           </Button>
    //         </DialogTrigger>
    //         <DialogContent>
    //           <DialogHeader>
    //             <DialogTitle>Withdraw Earnings</DialogTitle>
    //             <DialogDescription>
    //               Request a withdrawal from your available balance
    //             </DialogDescription>
    //           </DialogHeader>
    //           <div className="space-y-4">
    //             <div>
    //               <Label>Available Balance</Label>
    //               <div className="text-2xl font-bold text-success">
    //                 ${stats.availableBalance.toLocaleString()}
    //               </div>
    //             </div>
    //             <Separator />
    //             <div>
    //               <Label>Withdrawal Amount</Label>
    //               <Input
    //                 type="number"
    //                 placeholder="0.00"
    //                 value={withdrawAmount}
    //                 onChange={(e) => setWithdrawAmount(e.target.value)}
    //               />
    //             </div>
    //             <div>
    //               <Label>Payment Method</Label>
    //               <Select
    //                 value={paymentMethod}
    //                 onValueChange={setPaymentMethod}
    //               >
    //                 <SelectTrigger>
    //                   <SelectValue placeholder="Select payment method" />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   <SelectItem value="bank">Bank Transfer</SelectItem>
    //                   <SelectItem value="paypal">PayPal</SelectItem>
    //                   <SelectItem value="stripe">Stripe</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //             </div>
    //             <Button className="w-full">Request Withdrawal</Button>
    //           </div>
    //         </DialogContent>
    //       </Dialog>
    //     </div>
    //   </div>

    //   {/* Stats Cards */}
    //   <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    //     {earningsCards.map((card) => (
    //       <Card key={card.title} className="shadow-card">
    //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //           <CardTitle className="text-sm font-medium">
    //             {card.title}
    //           </CardTitle>
    //           <card.icon className={`h-4 w-4 ${card.color}`} />
    //         </CardHeader>
    //         <CardContent>
    //           <div className="text-2xl font-bold">{card.value}</div>
    //           <p className="text-xs text-muted-foreground">
    //             {card.description}
    //           </p>
    //         </CardContent>
    //       </Card>
    //     ))}
    //   </div>

    //   <div className="grid gap-6 lg:grid-cols-2">
    //     {/* Monthly Revenue */}
    //     <Card className="shadow-card">
    //       <CardHeader>
    //         <CardTitle>Monthly Revenue Breakdown</CardTitle>
    //         <CardDescription>Revenue performance over time</CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-4">
    //           {stats.monthlyRevenue.map((revenue, index) => (
    //             <div
    //               key={index}
    //               className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
    //             >
    //               <div className="flex items-center space-x-3">
    //                 <Calendar className="h-4 w-4 text-muted-foreground" />
    //                 <div>
    //                   <p className="font-medium">
    //                     {new Date(revenue.date).toLocaleDateString('en-US', {
    //                       month: 'long',
    //                       year: 'numeric',
    //                     })}
    //                   </p>
    //                   <p className="text-sm text-muted-foreground">
    //                     Monthly total
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className="text-right">
    //                 <p className="font-bold text-lg">
    //                   ${revenue.amount.toLocaleString()}
    //                 </p>
    //                 {index > 0 && (
    //                   <div className="flex items-center text-sm text-success">
    //                     <ArrowUpRight className="h-3 w-3 mr-1" />
    //                     <span>
    //                       {(
    //                         ((revenue.amount -
    //                           stats.monthlyRevenue[index - 1].amount) /
    //                           stats.monthlyRevenue[index - 1].amount) *
    //                         100
    //                       ).toFixed(1)}
    //                       %
    //                     </span>
    //                   </div>
    //                 )}
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </CardContent>
    //     </Card>

    //     {/* Course Revenue */}
    //     <Card className="shadow-card">
    //       <CardHeader>
    //         <CardTitle>Revenue by Course</CardTitle>
    //         <CardDescription>Top performing courses</CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-4">
    //           {stats.courseRevenue.map((revenue) => (
    //             <div
    //               key={revenue.courseId}
    //               className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
    //             >
    //               <div className="flex items-center space-x-3">
    //                 <BookOpen className="h-4 w-4 text-primary" />
    //                 <div>
    //                   <p className="font-medium">{revenue.courseName}</p>
    //                   <p className="text-sm text-muted-foreground">
    //                     Course revenue
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className="text-right">
    //                 <p className="font-bold text-lg">
    //                   ${revenue.amount.toLocaleString()}
    //                 </p>
    //                 <p className="text-sm text-muted-foreground">
    //                   {((revenue.amount / stats.totalRevenue) * 100).toFixed(1)}
    //                   % of total
    //                 </p>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>

    //   {/* Withdrawal History */}
    //   <Card className="shadow-card">
    //     <CardHeader>
    //       <CardTitle>Withdrawal History</CardTitle>
    //       <CardDescription>
    //         Your past withdrawal requests and payments
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       {withdrawals.length > 0 ? (
    //         <div className="space-y-4">
    //           {withdrawals.map((withdrawal) => (
    //             <div
    //               key={withdrawal.id}
    //               className="flex items-center justify-between p-4 border rounded-lg"
    //             >
    //               <div className="flex items-center space-x-4">
    //                 <div className="p-2 rounded-lg bg-muted">
    //                   <CreditCard className="h-4 w-4" />
    //                 </div>
    //                 <div>
    //                   <p className="font-medium">
    //                     ${withdrawal.amount.toLocaleString()}
    //                   </p>
    //                   <p className="text-sm text-muted-foreground">
    //                     {withdrawal.method} •{' '}
    //                     {new Date(withdrawal.date).toLocaleDateString()}
    //                   </p>
    //                 </div>
    //               </div>
    //               <Badge className={getStatusColor(withdrawal.status)}>
    //                 {withdrawal.status}
    //               </Badge>
    //             </div>
    //           ))}
    //         </div>
    //       ) : (
    //         <div className="text-center py-8">
    //           <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    //           <h3 className="text-lg font-semibold mb-2">No withdrawals yet</h3>
    //           <p className="text-muted-foreground mb-4">
    //             Your withdrawal history will appear here once you make your
    //             first request.
    //           </p>
    //           <Dialog>
    //             <DialogTrigger asChild>
    //               <Button>Make First Withdrawal</Button>
    //             </DialogTrigger>
    //           </Dialog>
    //         </div>
    //       )}
    //     </CardContent>
    //   </Card>
    // </div>
    <div>earnings page</div>
  );
};
