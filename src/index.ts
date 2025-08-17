import { compressImage } from './utils/compressImage';
import { CompressionOptions } from './types';

/**
 * Main function to compress an image file or Blob.
 *
 * @param fileOrBlob - The original image file or Blob to compress.
 * @param options - Configuration options for compression.
 * @returns A Promise that resolves with the compressed image as a File object.
 */
export async function compress(
  fileOrBlob: File | Blob,
  options: CompressionOptions
): Promise<File> {
  return compressImage(fileOrBlob, options);
}

export * from './types';
export { nodeCompress } from './utils/nodeCompress';
