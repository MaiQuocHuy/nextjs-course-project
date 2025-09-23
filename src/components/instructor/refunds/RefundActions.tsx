import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Eye, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUpdateRefundStatusMutation } from '@/services/instructor/refunds/refunds-ins-api';
import type { RefundResponse } from '@/types/instructor/refunds';
import Link from 'next/link';
import { isRefundExpired } from '@/utils/instructor/refunds';

interface RefundActionsProps {
  refund: RefundResponse;
}

export const RefundActions = ({ refund }: RefundActionsProps) => {
  const [updateRefundStatus, { isLoading }] = useUpdateRefundStatusMutation();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'COMPLETED' | 'FAILED' | null;
  }>({
    isOpen: false,
    action: null,
  });
  const [failureReason, setFailureReason] = useState('');

  const handleStatusUpdate = (newStatus: 'COMPLETED' | 'FAILED') => {
    setConfirmDialog({
      isOpen: true,
      action: newStatus,
    });
    if (newStatus === 'FAILED') {
      setFailureReason('');
    }
  };

  const confirmStatusUpdate = async () => {
    if (!confirmDialog.action) return;

    try {
      const payload: {
        id: string;
        status: 'COMPLETED' | 'FAILED';
        rejectedReason?: string;
      } = {
        id: refund.id,
        status: confirmDialog.action,
      };

      if (confirmDialog.action === 'FAILED' && failureReason.trim()) {
        payload.rejectedReason = failureReason.trim();
      }

      const res = await updateRefundStatus(payload).unwrap();
      if (res && res.statusCode === 200) {
        toast.success(
          `Refund status updated to ${confirmDialog.action.toLowerCase()}`
        );
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update refund status');
    } finally {
      setConfirmDialog({ isOpen: false, action: null });
      setFailureReason('');
    }
  };

  const isPending = refund.status === 'PENDING';
  const isExpired = isRefundExpired(refund);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-muted transition-colors"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[160px]"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={`/instructor/refunds/${refund.id}`}
              target="_blank"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(`/instructor/refunds/${refund.id}`, '_blank');
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View details
            </Link>
          </DropdownMenuItem>

          {isPending && !isExpired && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleStatusUpdate('COMPLETED');
                }}
                className="text-green-600 cursor-pointer"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Refund
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleStatusUpdate('FAILED');
                }}
                className="text-red-600 cursor-pointer"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Refund
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDialog({ isOpen: open, action: null })
        }
      >
        <AlertDialogContent
        // onClick={(e) => e.stopPropagation()}
        // onBlur={(e) => e.stopPropagation()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Refund Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{' '}
              {confirmDialog.action === 'COMPLETED' ? 'approve' : 'reject'} this
              refund?
              {confirmDialog.action === 'COMPLETED'
                ? ' The refund amount will be processed back to the customer.'
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {confirmDialog.action === 'FAILED' && (
            <div className="space-y-2">
              <Label htmlFor="failure-reason">
                Reason for rejection (optional)
              </Label>
              <Textarea
                id="failure-reason"
                placeholder="Enter reason for rejecting the refund..."
                value={failureReason}
                onChange={(e) => {
                  setFailureReason(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onBlur={(e) => e.stopPropagation()}
                rows={3}
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate}>
              {confirmDialog.action === 'COMPLETED' ? 'Approve' : 'Reject'}{' '}
              Refund
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
