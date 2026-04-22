import { useMutation, useQuery } from '@tanstack/react-query'
import { getPresignedUrlApi, getDownloadUrlApi, uploadToS3 } from '../http/services/uploads.service'

export function useUploadFile() {
  return useMutation({
    mutationFn: async ({ folder, file }: { folder: string; file: File }) => {
      // 1. Get the presigned URL
      const { presignedUrl, key } = await getPresignedUrlApi(folder, file.name, file.type, file.size)
      
      // 2. Upload file directly to S3
      await uploadToS3(presignedUrl, file)
      
      // 3. Return the persistent key
      return key
    },
  })
}

export function useDownloadUrl(key: string | undefined | null) {
  return useQuery({
    queryKey: ['download-url', key],
    queryFn: () => getDownloadUrlApi(key!),
    enabled: !!key,
    staleTime: 55 * 60 * 1000, // slightly under 1 hour (URL expires in 3600s)
  })
}
