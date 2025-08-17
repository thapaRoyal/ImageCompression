import sharp from 'sharp';
import { CompressionOptions } from '../types';

/**
 * Compresses an image file in a Node.js environment using sharp.
 *
 * @param fileBuffer - The original image file buffer to compress.
 * @param options - Configuration options for compression.
 * @returns A Promise that resolves with the compressed image as a Buffer.
 */
export async function nodeCompress(
  fileBuffer: Buffer,
  options: CompressionOptions
): Promise<Buffer> {
  const {
    maxSizeMB = 0.1,
    quality: initialQuality = 80,
    maxWidth = 800,
    maxHeight = null,
  } = options;

  let quality = initialQuality;

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  let image = sharp(fileBuffer);

  // Resize the image to fit within maxWidth and maxHeight
  image = image.resize({
    width: maxWidth,
    height: maxHeight || maxWidth,
    fit: 'inside',
    withoutEnlargement: true,
  });

  // Compress the image
  const metadata = await image.metadata();
  const format = metadata.format === 'webp' ? 'webp' : 'jpeg';

  let compressedBuffer = await image
    .toFormat(format, { quality })
    .toBuffer();

  // If the compressed image is still too large, progressively reduce quality
  while (compressedBuffer.length > maxSizeBytes && quality > 10) {
    quality -= 10;
    compressedBuffer = await image
      .toFormat(format, { quality })
      .toBuffer();
  }

  if (compressedBuffer.length > maxSizeBytes) {
    throw new Error('Failed to compress image within size constraints');
  }

  return compressedBuffer;
}
