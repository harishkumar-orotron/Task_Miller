import { useState, useRef, useEffect } from 'react'
import { Send, Pencil, Trash2, Check, X, Reply, ChevronDown, ChevronUp } from 'lucide-react'
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

function Avatar({ name, id, small }: { name: string; id: string; small?: boolean }) {
  return (
    <div className={`${small ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} ${userColor(id)} rounded-full flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-semibold">{name.charAt(0).toUpperCase()}</span>
    </div>
  )
}

interface ReplyInputProps {
  userName: string
  userId:   string
  isAdding: boolean
  onSubmit: (body: string) => void
  onCancel: () => void
}

function ReplyInput({ userName, userId, isAdding, onSubmit, onCancel }: ReplyInputProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = () => {
    const t = text.trim()
    if (!t || isAdding) return
    onSubmit(t)
    setText('')
  }

  return (
    <div className="flex gap-2 items-center mt-2">
      <Avatar name={userName} id={userId} small />
      <div className="flex-1 flex items-center gap-2 border border-orange-300 rounded-xl px-3 py-1.5 bg-orange-50 focus-within:border-orange-400 transition-colors">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
          placeholder="Write a reply..."
          className="flex-1 bg-transparent outline-none text-xs text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={submit}
          disabled={isAdding || !text.trim()}
          className="w-6 h-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
        >
          <Send size={11} className="text-white" />
        </button>
      </div>
      <button onClick={onCancel} className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
        <X size={13} />
      </button>
    </div>
  )
}

interface ReplyRowProps {
  reply:           Comment
  isOwn:           boolean
  isEditingThis:   boolean
  isEditing:       boolean
  editText:        string
  onEdit:          () => void
  onDelete:        () => void
  onCancelEdit:    () => void
  onEditTextChange:(v: string) => void
  onSaveEdit:      () => void
}

function ReplyRow({ reply, isOwn, isEditingThis, isEditing, editText, onEdit, onDelete, onCancelEdit, onEditTextChange, onSaveEdit }: ReplyRowProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="flex gap-2.5" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Avatar name={reply.author.name} id={reply.author.id} small />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-800">{reply.author.name}</span>
            <span className="text-xs text-gray-400">{timeAgo(reply.createdAt)}</span>
            {reply.updatedAt !== reply.createdAt && <span className="text-xs text-gray-300 italic">edited</span>}
          </div>
          {isOwn && hovered && !isEditingThis && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={onEdit} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <Pencil size={10} />
              </button>
              <button onClick={onDelete} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={10} />
              </button>
            </div>
          )}
        </div>
        {isEditingThis ? (
          <div>
            <textarea
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSaveEdit() } }}
              rows={2}
              autoFocus
              className="w-full border border-orange-300 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-orange-400 transition-colors"
            />
            <div className="flex gap-2 mt-1.5">
              <button onClick={onSaveEdit} disabled={isEditing || !editText.trim()} className="flex items-center gap-1 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50">
                <Check size={11} /> Save
              </button>
              <button onClick={onCancelEdit} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <X size={11} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-600 leading-relaxed break-words">{reply.body}</p>
        )}
      </div>
    </div>
  )
}

interface CommentItemProps {
  comment:         Comment
  replies:         Comment[]
  isOwn:           boolean
  userId:          string
  userName:        string
  replyingTo:      string | null
  editComment:     Comment | null
  editText:        string
  isAdding:        boolean
  isEditing:       boolean
  onReply:         (id: string) => void
  onCancelReply:   () => void
  onSubmitReply:   (body: string) => void
  onEdit:          (c: Comment) => void
  onCancelEdit:    () => void
  onEditTextChange:(v: string) => void
  onSaveEdit:      () => void
  onDelete:        (id: string) => void
}

function CommentItem({
  comment, replies, isOwn, userId, userName,
  replyingTo, editComment, editText, isAdding, isEditing,
  onReply, onCancelReply, onSubmitReply,
  onEdit, onCancelEdit, onEditTextChange, onSaveEdit, onDelete,
}: CommentItemProps) {
  const [hovered,     setHovered]     = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const isEditingThis = editComment?.id === comment.id

  return (
    <div>
      <div className="flex gap-3" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Avatar name={comment.author.name} id={comment.author.id} />
        <div className="flex-1 min-w-0">

          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">{comment.author.name}</span>
              <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
              {comment.updatedAt !== comment.createdAt && <span className="text-xs text-gray-300 italic">edited</span>}
            </div>
            {hovered && !isEditingThis && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onReply(comment.id)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Reply size={11} /> Reply
                </button>
                {isOwn && (
                  <>
                    <button onClick={() => onEdit(comment)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                      <Pencil size={11} />
                    </button>
                    <button onClick={() => onDelete(comment.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={11} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {isEditingThis ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => onEditTextChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSaveEdit() } }}
                rows={2}
                autoFocus
                className="w-full border border-orange-300 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-orange-400 transition-colors"
              />
              <div className="flex gap-2 mt-1.5">
                <button onClick={onSaveEdit} disabled={isEditing || !editText.trim()} className="flex items-center gap-1 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50">
                  <Check size={11} /> Save
                </button>
                <button onClick={onCancelEdit} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <X size={11} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed break-words">{comment.body}</p>
          )}

          {/* Inline reply input */}
          {replyingTo === comment.id && (
            <ReplyInput
              userName={userName}
              userId={userId}
              isAdding={isAdding}
              onSubmit={onSubmitReply}
              onCancel={onCancelReply}
            />
          )}

          {/* Replies toggle */}
          {replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
            >
              {showReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showReplies ? 'Hide' : 'View'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
      </div>

      {/* Replies list */}
      {showReplies && replies.length > 0 && (
        <div className="ml-11 mt-3 space-y-3 pl-3 border-l-2 border-gray-100">
          {replies.map((reply) => (
            <ReplyRow
              key={reply.id}
              reply={reply}
              isOwn={reply.author.id === userId}
              isEditingThis={editComment?.id === reply.id}
              isEditing={isEditing}
              editText={editText}
              onEdit={() => onEdit(reply)}
              onDelete={() => onDelete(reply.id)}
              onCancelEdit={onCancelEdit}
              onEditTextChange={onEditTextChange}
              onSaveEdit={onSaveEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CommentsSection({ taskId, userId, userName }: CommentsSectionProps) {
  const [text,        setText]        = useState('')
  const [editComment, setEditComment] = useState<Comment | null>(null)
  const [editText,    setEditText]    = useState('')
  const [replyingTo,  setReplyingTo]  = useState<string | null>(null)
  const listRef                       = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useComments(taskId)
  const { mutate: addComment,    isPending: isAdding  } = useAddCommentMutation(taskId)
  const { mutate: editCommentFn, isPending: isEditing } = useEditCommentMutation(taskId)
  const { mutate: deleteComment                       } = useDeleteCommentMutation(taskId)

  const topLevel = data?.comments ?? []

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [topLevel.length])

  const handleAdd = () => {
    const trimmed = text.trim()
    if (!trimmed || isAdding) return
    addComment({ body: trimmed }, { onSuccess: () => setText('') })
  }

  const handleReplySubmit = (body: string) => {
    if (!replyingTo) return
    addComment({ body, parentCommentId: replyingTo }, { onSuccess: () => setReplyingTo(null) })
  }

  const handleEdit = () => {
    if (!editComment || !editText.trim() || isEditing) return
    editCommentFn(
      { commentId: editComment.id, body: editText.trim() },
      { onSuccess: () => { setEditComment(null); setEditText('') } },
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 flex flex-col" style={{ minHeight: '100%' }}>

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <h3 className="font-semibold text-gray-800 text-sm">Comments</h3>
        {topLevel.length > 0 && (
          <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
            {topLevel.length}
          </span>
        )}
      </div>

      {/* Comment list */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-5 min-h-0">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : topLevel.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No comments yet. Be the first!</p>
        ) : (
          topLevel.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              replies={c.replies ?? []}
              isOwn={c.author.id === userId}
              userId={userId}
              userName={userName}
              replyingTo={replyingTo}
              editComment={editComment}
              editText={editText}
              isAdding={isAdding}
              isEditing={isEditing}
              onReply={(id) => setReplyingTo(replyingTo === id ? null : id)}
              onCancelReply={() => setReplyingTo(null)}
              onSubmitReply={handleReplySubmit}
              onEdit={(c) => { setEditComment(c); setEditText(c.body) }}
              onCancelEdit={() => { setEditComment(null); setEditText('') }}
              onEditTextChange={setEditText}
              onSaveEdit={handleEdit}
              onDelete={(id) => deleteComment(id)}
            />
          ))
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
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd() } }}
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
