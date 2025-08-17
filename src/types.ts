/**
 * Configuration options for image compression.
 */
export interface CompressionOptions {
  maxSizeMB?: number; // Target maximum size in megabytes.
  quality?: number; // Starting compression quality (0.0 to 1.0).
  maxWidth?: number; // Maximum width in pixels.
  maxHeight?: number | null; // Maximum height in pixels.
  downscaleDivisor?: number; // Downscale divisor for large images.
}
