export interface CommentAuthor {
  id:        string
  name:      string
  email:     string
  avatarUrl: string | null
}

export interface Comment {
  id:        string
  taskId:    string
  authorId:  string
  body:      string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  author:    CommentAuthor
}

export interface CommentListResponse {
  comments:   Comment[]
  pagination: {
    currentPage:  number
    limit:        number
    totalRecords: number
    totalPages:   number
    hasNextPage:  boolean
    hasPrevPage:  boolean
  }
}
