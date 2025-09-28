"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomPaginationNotifications } from "@/components/ui/custom-pagination-notifications";
import {
  Bell,
  BellRing,
  Check,
  Trash2,
  AlertCircle,
  Settings,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  useGetNotificationsByUserIdQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} from "@/services/notificationApi";
import { NotificationDto, NotificationPriority } from "@/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// Hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

interface NotificationsModalProps {
  userId: string;
  triggerButton?: React.ReactNode;
}

const getPriorityIcon = (priority: NotificationPriority) => {
  switch (priority) {
    case NotificationPriority.HIGH:
      return <AlertCircle className="h-4 w-4" />;
    case NotificationPriority.MEDIUM:
      return <Bell className="h-4 w-4" />;
    case NotificationPriority.LOW:
      return <Settings className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getPriorityBadgeColor = (priority: NotificationPriority) => {
  switch (priority) {
    case NotificationPriority.HIGH:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case NotificationPriority.MEDIUM:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case NotificationPriority.LOW:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  userId,
  triggerButton,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const isHoveringTriggerRef = useRef(false);
  const isHoveringModalRef = useRef(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pageSize = 10;
  const isMobile = useIsMobile();

  const {
    data: notificationsResponse,
    isLoading,
    error,
    refetch,
  } = useGetNotificationsByUserIdQuery(
    {
      userId,
      page: currentPage - 1,
      size: pageSize,
      sortBy: "createdAt",
      sortDir: "DESC",
    },
    {
      pollingInterval: 300000, // 5 phút
      refetchOnFocus: true, // refetch khi user quay lại tab
      refetchOnReconnect: true, // refetch khi mạng reconnect
    }
  );

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notificationsResponse?.data?.content || [];
  const totalPages = notificationsResponse?.data?.page?.totalPages || 1;
  const unreadCount = notifications.length > 0 ? notifications[0].unreadCount || 0 : 0;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead({ id }).unwrap();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification({ id }).unwrap();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleNotificationClick = async (notification: NotificationDto) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate to the action URL
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setOpen(false); // Close the dropdown
    }
  };

  const handleMouseEnter = () => {
    if (isMobile) return; // Disable hover on mobile

    isHoveringTriggerRef.current = true;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // Disable hover on mobile

    isHoveringTriggerRef.current = false;
    const timeout = setTimeout(() => {
      if (!isHoveringModalRef.current && !isHoveringTriggerRef.current) {
        setOpen(false);
      }
    }, 300);
    setHoverTimeout(timeout);
  };

  const handlePopoverMouseEnter = () => {
    if (isMobile) return; // Disable hover on mobile

    isHoveringModalRef.current = true;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handlePopoverMouseLeave = () => {
    if (isMobile) return; // Disable hover on mobile

    isHoveringModalRef.current = false;
    const timeout = setTimeout(() => {
      if (!isHoveringModalRef.current && !isHoveringTriggerRef.current) {
        setOpen(false);
      }
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleTriggerClick = () => {
    if (isMobile) {
      setOpen(!open); // Toggle on click for mobile
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    try {
      await Promise.all(
        unreadNotifications.map((notification) => markAsRead({ id: notification.id }).unwrap())
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
    }
  };

  const defaultTrigger = (
    <Button
      ref={triggerRef}
      variant="ghost"
      size="icon"
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTriggerClick}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {triggerButton ? (
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleTriggerClick}
            >
              {triggerButton}
            </div>
          ) : (
            defaultTrigger
          )}
        </PopoverTrigger>

        {/* Invisible bridge to prevent modal from closing when moving mouse quickly */}
        {open && !isMobile && (
          <div
            className="absolute top-full right-0 w-24 h-2 bg-transparent z-40"
            onMouseEnter={() => {
              isHoveringModalRef.current = true;
              if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                setHoverTimeout(null);
              }
            }}
            onMouseLeave={() => {
              isHoveringModalRef.current = false;
              const timeout = setTimeout(() => {
                if (!isHoveringModalRef.current && !isHoveringTriggerRef.current) {
                  setOpen(false);
                }
              }, 300);
              setHoverTimeout(timeout);
            }}
          />
        )}

        <PopoverContent
          ref={popoverRef}
          className="w-96 p-0 animate-in slide-in-from-top-2 duration-200 z-50 overflow-hidden"
          style={{ overscrollBehavior: "contain" }}
          align="end"
          side="bottom"
          sideOffset={8}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          onInteractOutside={(e) => {
            // On mobile, close when clicking outside
            if (isMobile) {
              setOpen(false);
            }
          }}
        >
          <div className="flex flex-col max-h-[80vh] w-full overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellRing className="h-5 w-5" />
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    className="text-xs h-7 px-2"
                    title="Refresh notifications"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs h-7 px-2"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea ref={scrollAreaRef} className="h-[400px]">
                <div className="p-2">
                  {isLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="border-0 bg-muted/30">
                          <CardContent className="p-3">
                            <div className="flex items-start space-x-3">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-3 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : error ? (
                    <Alert variant="destructive" className="m-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Failed to load notifications.
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => refetch()}
                          className="ml-1 h-auto p-0 text-xs"
                        >
                          Retry
                        </Button>
                      </AlertDescription>
                    </Alert>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Bell className="h-8 w-8 mb-2 opacity-50" />
                      <p className="text-sm text-center">No notifications</p>
                      <p className="text-xs text-center">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map((notification: NotificationDto) => (
                        <Card
                          key={notification.id}
                          className={cn(
                            "transition-all hover:shadow-sm cursor-pointer border-0 hover:bg-muted/50",
                            !notification.isRead && "border-l-2 border-l-primary bg-muted/30"
                          )}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <CardContent className="px-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <div
                                  className={cn(
                                    "p-1.5 rounded-full flex-shrink-0",
                                    getPriorityBadgeColor(notification.priority)
                                  )}
                                >
                                  {getPriorityIcon(notification.priority)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Badge
                                      variant="secondary"
                                      className={cn(
                                        "text-xs px-1.5 py-0.5 h-auto",
                                        getPriorityBadgeColor(notification.priority)
                                      )}
                                    >
                                      {notification.priority}
                                    </Badge>
                                    {notification.actionUrl && (
                                      <ExternalLink className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />
                                    )}
                                  </div>
                                  <p
                                    className={cn(
                                      "text-xs mb-1 leading-relaxed",
                                      !notification.isRead && "font-medium"
                                    )}
                                  >
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(notification.createdAt + "Z"), {
                                      addSuffix: true,
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div
                                className="flex items-center gap-0.5 flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="h-6 w-6"
                                    title="Mark as read"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(notification.id)}
                                  className="h-6 w-6 text-destructive hover:text-destructive"
                                  title="Delete notification"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex-shrink-0 p-3 border-t bg-muted/30 overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <CustomPaginationNotifications
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      // Scroll to top of the modal content
                      if (scrollAreaRef.current) {
                        const viewport = scrollAreaRef.current.querySelector(
                          "[data-radix-scroll-area-viewport]"
                        );
                        if (viewport) {
                          viewport.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }
                      // Keep the dropdown open while paginating
                      if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                        setHoverTimeout(null);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
