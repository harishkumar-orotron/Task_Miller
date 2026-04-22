import React from 'react'
import { useDownloadUrl } from '../../queries/uploads.queries'
import { Loader2 } from 'lucide-react'

interface S3ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  storageKey: string
  fallbackInitials?: string
}

export default function S3Image({ storageKey, fallbackInitials, className = '', alt = 'image', ...props }: S3ImageProps) {
  const { data, isLoading, isError } = useDownloadUrl(storageKey)

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 animate-pulse ${className}`}>
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
      </div>
    )
  }

  // If the backend returns 403 or fails to provide the presigned URL, we fallback to initials
  if (isError || !data?.url) {
    if (fallbackInitials) {
      return (
        <div className={`flex items-center justify-center font-bold ${className}`}>
          {fallbackInitials}
        </div>
      )
    }
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <span className="text-xs text-gray-400">?</span>
      </div>
    )
  }

  return (
    <img
      src={data.url}
      alt={alt}
      className={`object-cover ${className}`}
      {...props}
    />
  )
}
