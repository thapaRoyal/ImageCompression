import { CompressionOptions } from '../types';
/**
 * Compresses an image file or Blob by resizing and adjusting quality to meet size constraints.
 *
 * Features:
 * - Automatic format selection based on browser support and preferences
 * - Multiple resize modes (contain, cover, fill, etc.)
 * - Progressive JPEG support
 * - EXIF preservation option
 * - Detailed debug logging
 * - Custom output filename
 * - Quality optimization with binary search
 * - Smart downscaling for large images
 * - Browser-only implementation (no Node.js/Sharp)
 *
 * @param fileOrBlob - The original image file or Blob to compress.
 * @param options - Configuration options for compression.
 * @returns A Promise that resolves with the compressed image as a File object.
 * @throws Will throw an error if compression fails or if the target size cannot be achieved.
 */
export declare function compressImage(fileOrBlob: File | Blob, options: CompressionOptions): Promise<File>;
