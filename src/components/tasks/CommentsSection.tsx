import { useState, useRef, useEffect } from 'react'
import { Send, Pencil, Trash2, Check, X } from 'lucide-react'
import { useComments, useAddCommentMutation, useEditCommentMutation, useDeleteCommentMutation } from '../../queries/comments.queries'
import { userColor } from '../../lib/utils'
import type { Comment } from '../../types/comment.types'

interface CommentsSectionProps {
  taskId:   string
  userId:   string
  userName: string
}

function timeAgo(iso: string): string {
  const diff   = Date.now() - new Date(iso).getTime()
  const secs   = Math.floor(diff / 1000)
  if (secs  < 60)  return 'just now'
  const mins   = Math.floor(secs  / 60)
  if (mins  < 60)  return `${mins}m ago`
  const hrs    = Math.floor(mins  / 60)
  if (hrs   < 24)  return `${hrs}h ago`
  const days   = Math.floor(hrs   / 24)
  if (days  < 30)  return `${days}d ago`
  const months = Math.floor(days  / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

function Avatar({ name, id }: { name: string; id: string }) {
  return (
    <div className={`w-8 h-8 text-sm ${userColor(id)} rounded-full flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-semibold">{name.charAt(0).toUpperCase()}</span>
    </div>
  )
}

function CommentItem({
  comment, isOwn, onEdit, onDelete,
}: {
  comment:  Comment
  isOwn:    boolean
  onEdit:   (c: Comment) => void
  onDelete: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex gap-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Avatar name={comment.author.name} id={comment.author.id} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">{comment.author.name}</span>
            <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-xs text-gray-300 italic">edited</span>
            )}
          </div>
          {isOwn && hovered && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onEdit(comment)}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Pencil size={11} />
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={11} />
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed break-words">{comment.body}</p>
      </div>
    </div>
  )
}

export default function CommentsSection({ taskId, userId, userName }: CommentsSectionProps) {
  const [text,        setText]        = useState('')
  const [editComment, setEditComment] = useState<Comment | null>(null)
  const [editText,    setEditText]    = useState('')
  const listRef                       = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useComments(taskId)
  const { mutate: addComment,    isPending: isAdding  } = useAddCommentMutation(taskId)
  const { mutate: editCommentFn, isPending: isEditing } = useEditCommentMutation(taskId)
  const { mutate: deleteComment                       } = useDeleteCommentMutation(taskId)

  const comments = data?.comments ?? []

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [comments.length])

  const handleAdd = () => {
    const trimmed = text.trim()
    if (!trimmed || isAdding) return
    addComment(trimmed, { onSuccess: () => setText('') })
  }

  const handleEdit = () => {
    if (!editComment || !editText.trim() || isEditing) return
    editCommentFn(
      { commentId: editComment.id, body: editText.trim() },
      { onSuccess: () => { setEditComment(null); setEditText('') } },
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); action() }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 flex flex-col" style={{ minHeight: '100%' }}>

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <h3 className="font-semibold text-gray-800 text-sm">Comments</h3>
        {comments.length > 0 && (
          <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
            {comments.length}
          </span>
        )}
      </div>

      {/* Comment list */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-5 min-h-0">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) =>
            editComment?.id === c.id ? (
              <div key={c.id} className="flex gap-3">
                <Avatar name={c.author.name} id={c.author.id} />
                <div className="flex-1 min-w-0">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, handleEdit)}
                    rows={2}
                    autoFocus
                    className="w-full border border-orange-300 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-orange-400 transition-colors"
                  />
                  <div className="flex gap-2 mt-1.5">
                    <button
                      onClick={handleEdit}
                      disabled={isEditing || !editText.trim()}
                      className="flex items-center gap-1 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Check size={11} /> Save
                    </button>
                    <button
                      onClick={() => { setEditComment(null); setEditText('') }}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <X size={11} /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <CommentItem
                key={c.id}
                comment={c}
                isOwn={c.author.id === userId}
                onEdit={(c) => { setEditComment(c); setEditText(c.body) }}
                onDelete={(id) => deleteComment(id)}
              />
            )
          )
        )}
      </div>

      {/* Add comment input */}
      <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
        <div className="flex gap-3 items-center">
          <Avatar name={userName} id={userId} />
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:border-orange-400 transition-colors">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleAdd)}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleAdd}
              disabled={isAdding || !text.trim()}
              className="w-7 h-7 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
