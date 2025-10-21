import React, { useMemo } from "react"

type DriveImageProps = {
  /** Full Google Drive file URL (e.g. https://drive.google.com/file/d/FILE_ID/view) */
  driveImageURL: string
  /** Whether to display the image as a small thumbnail */
  isThumbnail?: boolean
  /** Optional custom alt text */
  alt?: string
  /** Optional width override */
  width?: number
}

/**
 * DriveImage Component
 * Renders an image from a Google Drive file link.
 * Automatically extracts the file ID and supports thumbnail or full-size display.
 */
const DriveImage: React.FC<DriveImageProps> = ({
  driveImageURL,
  isThumbnail = false,
  alt = "Drive Image",
  width,
}) => {
  const fileId = useMemo(() => {
    // Extract the file ID from a Google Drive URL
    const match = driveImageURL.match(/\/d\/([^/]+)\//)
    return match ? match[1] : null
  }, [driveImageURL])

  if (!fileId) {
    return (
      <div className="text-sm text-red-500 italic">
        Invalid Google Drive URL
      </div>
    )
  }
 console.log({fileId})
  // Build proper Drive image link (thumbnail or full-size)
  // const imageUrl = isThumbnail
  //   ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
  //   : `https://drive.google.com/uc?export=view&id=${fileId}`

  return (
    <img
      src={'https://drive.google.com/thumbnail?id=1ojh3B7h3b0MEzk8CZp_EVKe43PLiZpHX&sz=w1000'}
      alt={alt}
      className={`rounded-xl shadow-sm object-cover ${
        isThumbnail ? "w-32 h-32" : "w-full h-auto"
      }`}
      style={width ? { width } : undefined}
      loading="lazy"
    />
  )
}

export default DriveImage
