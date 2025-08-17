import { CompressionOptions } from '../types';

/**
 * Compresses an image file or Blob by resizing and adjusting quality to meet size constraints.
 *
 * @param fileOrBlob - The original image file or Blob to compress.
 * @param options - Configuration options for compression.
 * @returns A Promise that resolves with the compressed image as a File object.
 */
export async function compressImage(
  fileOrBlob: File | Blob,
  options: CompressionOptions
): Promise<File> {
  const {
    maxSizeMB = 0.1,
    quality = 0.9,
    maxWidth = 800,
    maxHeight = null,
    downscaleDivisor = 5,
  } = options;

  console.log('Image compression started');

  const maxHeightAdjusted = maxHeight || maxWidth;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const minQuality = 0.1;
  const downscaleStep = 0.9;

  const supportsWebP = (() => {
    let result: boolean | undefined;
    return async () => {
      if (result !== undefined) return result;
      const canvas = document.createElement('canvas');
      return new Promise<boolean>((resolve) => {
        canvas.toBlob(
          (blob) => {
            result = blob !== null && blob.type === 'image/webp';
            resolve(result);
          },
          'image/webp',
          0.5,
        );
      });
    };
  })();

  const imageBitmap = await createImageBitmap(fileOrBlob);
  let origWidth = imageBitmap.width;
  let origHeight = imageBitmap.height;

  if (
    origWidth > maxWidth * downscaleDivisor ||
    origHeight > maxHeightAdjusted * downscaleDivisor
  ) {
    origWidth = Math.floor(origWidth / downscaleDivisor);
    origHeight = Math.floor(origHeight / downscaleDivisor);
    console.log(
      `Quick downscale by divisor ${downscaleDivisor} to ${origWidth}x${origHeight}`,
    );
  }

  let scale = Math.min(maxWidth / origWidth, maxHeightAdjusted / origHeight, 1);
  let newWidth = Math.round(origWidth * scale);
  let newHeight = Math.round(origHeight * scale);

  const webpSupported = await supportsWebP();
  const format = webpSupported ? 'image/webp' : 'image/jpeg';
  const extension = webpSupported ? 'webp' : 'jpg';
  console.log(`Using format: ${format}`);

  const encodeWithBestQuality = async (canvas: HTMLCanvasElement): Promise<Blob> => {
    let low = minQuality;
    let high = quality;
    let bestBlob: Blob | null = null;

    while (low <= high) {
      const mid = (low + high) / 2;
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, format, mid),
      );
      if (!blob) throw new Error(`Compression failed for ${format}`);

      if (blob.size <= maxSizeBytes) {
        bestBlob = blob;
        low = mid + 0.05;
      } else {
        high = mid - 0.05;
      }
    }

    if (!bestBlob) throw new Error('Failed to compress image within size constraints');
    return bestBlob;
  };

  const drawToCanvas = (width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    ctx.drawImage(imageBitmap, 0, 0, width, height);
    return canvas;
  };

  let bestBlob: Blob | null = null;

  while (!bestBlob) {
    const canvas = drawToCanvas(newWidth, newHeight);
    bestBlob = await encodeWithBestQuality(canvas);

    if (!bestBlob || bestBlob.size > maxSizeBytes) {
      console.warn(
        `Still too big (${bestBlob ? (bestBlob.size / 1024).toFixed(1) : '??'}KB), downscaling further`,
      );
      newWidth = Math.floor(newWidth * downscaleStep);
      newHeight = Math.floor(newHeight * downscaleStep);
      bestBlob = null;
    }
  }

  const file = new File([bestBlob], `image.${extension}`, {
    type: bestBlob.type,
  });

  console.log(
    `✅ Final size: ${(bestBlob.size / 1024).toFixed(1)}KB, Dimensions: ${newWidth}x${newHeight}`,
  );

  return file;
}
