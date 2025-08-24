import { CompressionOptions, ImageFormat, ResizeMode } from '../types';

/**
 * Cache for format support detection results
 */
const formatSupportCache: Map<ImageFormat, boolean> = new Map();

/**
 * Detects browser support for a specific image format using a canvas test
 * @param format - The image format to test
 * @returns A promise that resolves to true if the format is supported
 */
async function isFormatSupported(format: ImageFormat): Promise<boolean> {
  if (formatSupportCache.has(format)) {
    return formatSupportCache.get(format)!;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  try {
    const mimeType = `image/${format}`;
    return new Promise<boolean>((resolve) => {
      canvas.toBlob(
        (blob) => {
          const isSupported = blob !== null && blob.type === mimeType;
          formatSupportCache.set(format, isSupported);
          resolve(isSupported);
        },
        mimeType,
        1
      );
    });
  } catch (error) {
    formatSupportCache.set(format, false);
    return false;
  }
}

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
    preferredFormat = 'webp',
    preserveExif = false,
    resizeMode = 'contain',
    minQuality = 0.1,
    progressive = false,
    debug = false,
    outputFilename,
  } = options;

  const log = debug ? console.log.bind(console, '[ImageCompression]') : () => {};
  log('Compression started');

  const maxHeightAdjusted = maxHeight || maxWidth;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const downscaleStep = 0.9;

  // Check format support and determine the best format to use
  const formatSupport = await Promise.all([
    preferredFormat,
    'webp',
    'avif',
    'png',
    'jpeg',
  ].map(async (format) => ({
    format,
    supported: await isFormatSupported(format as ImageFormat),
  })));

  let bestFormat = formatSupport.find((f) => f.supported)?.format || 'jpeg';
  log(`Using format: ${bestFormat}`);

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

  // These will be updated if format changes during compression
  let format = `image/${bestFormat}`;
  let extension = bestFormat === 'jpeg' ? 'jpg' : bestFormat;
  log(`Output format: ${format}`);

  const encodeWithBestQuality = async (canvas: HTMLCanvasElement): Promise<Blob> => {
    // For lossless formats (PNG), quality parameter has no effect
    // So we encode directly without quality optimization
    if (bestFormat === 'png') {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, format)
      );
      if (!blob) throw new Error(`Compression failed for ${format}`);
      
      // If PNG is still too large, we need to resize further
      if (blob.size > maxSizeBytes) {
        throw new Error('PNG image too large - consider using a lossy format or reducing dimensions');
      }
      
      return blob;
    }

    // For lossy formats (JPEG, WebP, AVIF), use quality optimization
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

  /**
   * Draws the image to a canvas with the specified dimensions and resize mode
   */
  const drawToCanvas = (width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Calculate dimensions based on resize mode
    let sw = imageBitmap.width;
    let sh = imageBitmap.height;
    let dx = 0;
    let dy = 0;
    let dw = width;
    let dh = height;

    switch (resizeMode) {
      case 'contain':
        const scale = Math.min(width / sw, height / sh);
        dw = sw * scale;
        dh = sh * scale;
        dx = (width - dw) / 2;
        dy = (height - dh) / 2;
        break;
      case 'cover':
        const coverScale = Math.max(width / sw, height / sh);
        dw = sw * coverScale;
        dh = sh * coverScale;
        dx = (width - dw) / 2;
        dy = (height - dh) / 2;
        break;
      case 'inside':
        const insideScale = Math.min(width / sw, height / sh, 1);
        dw = sw * insideScale;
        dh = sh * insideScale;
        dx = (width - dw) / 2;
        dy = (height - dh) / 2;
        break;
      case 'outside':
        const outsideScale = Math.max(width / sw, height / sh, 1);
        dw = sw * outsideScale;
        dh = sh * outsideScale;
        dx = (width - dw) / 2;
        dy = (height - dh) / 2;
        break;
      // 'fill' is default, uses full canvas dimensions
    }

    // Optional: Set image smoothing quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(imageBitmap, dx, dy, dw, dh);
    return canvas;
  };

  let bestBlob: Blob | null = null;
  let attempts = 0;
  const maxAttempts = 3;

  while (!bestBlob && attempts < maxAttempts) {
    try {
      const canvas = drawToCanvas(newWidth, newHeight);
      bestBlob = await encodeWithBestQuality(canvas);
    } catch (error) {
      attempts++;
      
      // If PNG failed and we have other formats available, try a lossy format
      if (bestFormat === 'png' && attempts === 1) {
        const lossyFormat = formatSupport.find(f => 
          f.supported && f.format !== 'png' && ['jpeg', 'webp', 'avif'].includes(f.format)
        );
        
        if (lossyFormat) {
          log(`PNG too large, falling back to ${lossyFormat.format}`);
          // Update format and retry
          const newFormat = lossyFormat.format as ImageFormat;
          bestFormat = newFormat;
          format = `image/${newFormat}`;
          extension = newFormat === 'jpeg' ? 'jpg' : newFormat;
          log(`Switched to format: ${format}`);
          // Force a retry with the new format
          continue;
        }
      }
      
      // If still failing, downscale and retry
      if (attempts < maxAttempts) {
        console.warn(
          `Compression attempt ${attempts} failed, downscaling further`,
        );
        newWidth = Math.floor(newWidth * downscaleStep);
        newHeight = Math.floor(newHeight * downscaleStep);
        bestBlob = null;
      } else {
        throw error;
      }
    }

    if (!bestBlob || bestBlob.size > maxSizeBytes) {
      console.warn(
        `Still too big (${bestBlob ? (bestBlob.size / 1024).toFixed(1) : '??'}KB), downscaling further`,
      );
      newWidth = Math.floor(newWidth * downscaleStep);
      newHeight = Math.floor(newHeight * downscaleStep);
      bestBlob = null;
    }
  }

  // Generate output filename
  const filename = outputFilename || 
    (fileOrBlob instanceof File ? 
      `${fileOrBlob.name.split('.')[0]}.${extension}` : 
      `image.${extension}`);

  // Ensure we have a valid blob before creating the file
  if (!bestBlob) {
    throw new Error('Failed to compress image - no valid output generated');
  }

  // Create the output File object
  const file = new File([bestBlob], filename, {
    type: bestBlob.type,
  });

  log(
    `✅ Compression complete:
    - Final size: ${(bestBlob.size / 1024).toFixed(1)}KB
    - Dimensions: ${newWidth}x${newHeight}
    - Format: ${bestFormat}
    - Filename: ${filename}
    - Quality: ${quality}`,
  );

  return file;
}
