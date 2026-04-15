// env.ts — single place to access all VITE_* environment variables
// Import from here instead of using import.meta.env directly in code.

export const env = {
  API_URL:   import.meta.env.VITE_API_URL   as string,
  S3_URL:    import.meta.env.VITE_S3_URL    as string | undefined,
} as const
