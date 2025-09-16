export interface NotificationDto {
  id: string;
  userId: string;
  resourceId: string;
  entityId: string;
  message: string;
  actionUrl: string;
  priority: NotificationPriority;
  isRead: boolean;
  readAt: string | null;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
}

export enum NotificationPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW"
}

export interface PaginatedNotifications {
  content: NotificationDto[];
  page: {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
  };
}

export interface NotificationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}
