/**
 * Supported image formats for compression
 */
export type ImageFormat = 'webp' | 'jpeg' | 'png' | 'avif';
/**
 * Image resize modes
 */
export type ResizeMode = 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
/**
 * Configuration options for image compression
 */
export interface CompressionOptions {
    /**
     * Target maximum size in megabytes.
     * @default 0.1
     */
    maxSizeMB?: number;
    /**
     * Starting compression quality (0.0 to 1.0).
     * @default 0.9
     */
    quality?: number;
    /**
     * Maximum width in pixels.
     * @default 800
     */
    maxWidth?: number;
    /**
     * Maximum height in pixels.
     * @default null (will use maxWidth)
     */
    maxHeight?: number | null;
    /**
     * Downscale divisor for large images.
     * If the original image's width or height is larger than max dimension × downscaleDivisor,
     * it will be quickly downscaled by dividing dimensions by this divisor.
     * @default 5
     */
    downscaleDivisor?: number;
    /**
     * Preferred output format.
     * If the browser doesn't support the preferred format, it will fallback to JPEG.
     * @default 'webp'
     */
    preferredFormat?: ImageFormat;
    /**
     * Preserve EXIF metadata in the output image.
     * @default false
     */
    preserveExif?: boolean;
    /**
     * Mode to use when resizing images.
     * - 'contain': Scales to fit within maxWidth/maxHeight while maintaining aspect ratio
     * - 'cover': Scales to cover maxWidth/maxHeight while maintaining aspect ratio
     * - 'fill': Stretches to exactly fit maxWidth/maxHeight
     * - 'inside': Like 'contain' but won't exceed original dimensions
     * - 'outside': Like 'cover' but won't exceed original dimensions
     * @default 'contain'
     */
    resizeMode?: ResizeMode;
    /**
     * Minimum quality allowed during compression.
     * The compressor won't go below this quality even if the target size isn't met.
     * @default 0.1
     */
    minQuality?: number;
    /**
     * Enable progressive JPEG output.
     * @default false
     */
    progressive?: boolean;
    /**
     * Enable debug logging.
     * @default false
     */
    debug?: boolean;
    /**
     * Custom filename for the output file.
     * If not provided, will use original filename with new extension.
     */
    outputFilename?: string;
}
