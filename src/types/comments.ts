export interface Comment {
  id: string;
  content: string;
  depth: number;
  relativeDepth?: number;
  lft: number;
  rgt: number;
  isEdited: boolean;
  isDeleted: boolean;
  replyCount: number;
  hasReplies: boolean;
  isLeaf: boolean;
  parentId?: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  rootComment: boolean;
}

export interface CommentResponse {
  statusCode: number;
  message: string;
  data: Comment;
  timestamp: string;
}

export interface CommentsResponse {
  statusCode: number;
  message: string;
  data: {
    content: Comment[];
    page: {
      number: number;
      size: number;
      totalPages: number;
      totalElements: number;
      first: boolean;
      last: boolean;
    };
  };
  timestamp: string;
}

export interface CommentCountResponse {
  statusCode: number;
  message: string;
  data: number;
  timestamp: string;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: string;
}

export interface UpdateCommentRequest {
  content: string;
}
