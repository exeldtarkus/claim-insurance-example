// fileExtensions.ts
export const fileExtensions = {
  image: [
    "image/*", ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".ico", ".heic", ".heif"
  ],
  video: [
    "video/*", ".mp4", ".webm", ".ogv", ".avi", ".mov", ".mkv", ".3gp"
  ],
  audio: [
    "audio/*", ".mp3", ".wav", ".ogg", ".aac", ".m4a", ".flac"
  ],
  document: [
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".rtf", ".odt", ".ods", ".odp"
  ],
  codeOrData: [
    ".json", ".csv", ".xml", ".yml", ".yaml", ".html", ".htm", ".md",
    ".js", ".ts", ".jsx", ".tsx", ".css", ".scss", ".sql"
  ],
  archive: [
    ".zip", ".rar", ".7z", ".tar", ".gz", ".tar.gz"
  ],
  slikOjkFileError: [
    ".etlerr",
  ]
} as const;

export type FileExtensionCategory = keyof typeof fileExtensions;
