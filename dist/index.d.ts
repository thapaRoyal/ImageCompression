import { CompressionOptions } from './types';
/**
 * Main function to compress an image file or Blob (browser only).
 *
 * @param fileOrBlob - The original image file or Blob to compress.
 * @param options - Configuration options for compression.
 * @returns A Promise that resolves with the compressed image as a File object.
 */
export declare function compress(fileOrBlob: File | Blob, options: CompressionOptions): Promise<File>;
export * from './types';
