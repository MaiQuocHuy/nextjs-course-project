"use client";

import React from "react";
import { NotificationsModal } from "./NotificationsModal";
import { useAuth } from "@/hooks/useAuth";

interface NotificationTriggerProps {
  className?: string;
}

export const NotificationTrigger: React.FC<NotificationTriggerProps> = ({ className }) => {
  const { user } = useAuth();

  if (!user?.id) {
    return null;
  }

  return (
    <div className={className}>
      <NotificationsModal userId={user.id} />
    </div>
  );
};
