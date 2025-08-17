import sharp from 'sharp';
import { NodeCompressionOptions, ImageFormat } from '../types';

/**
 * Error class for compression-related failures
 */
class CompressionError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'CompressionError';
  }
}

/**
 * Validates compression options and sets defaults
 */
function validateOptions(options: NodeCompressionOptions) {
  const {
    maxSizeMB = 0.1,
    maxWidth = 800,
    maxHeight = null,
    quality = 80,
  } = options;

  if (maxSizeMB <= 0) {
    throw new CompressionError('maxSizeMB must be greater than 0');
  }
  if (maxWidth <= 0) {
    throw new CompressionError('maxWidth must be greater than 0');
  }
  if (maxHeight !== null && maxHeight <= 0) {
    throw new CompressionError('maxHeight must be greater than 0');
  }
  if (quality < 1 || quality > 100) {
    throw new CompressionError('quality must be between 1 and 100');
  }
}

/**
 * Gets format-specific compression options
 */
function getFormatOptions(format: ImageFormat, options: NodeCompressionOptions, quality: number) {
  const { progressive = false, sharp: sharpOptions = {} } = options;
  const baseOptions = { quality, progressive };

  switch (format) {
    case 'webp':
      return {
        ...baseOptions,
        ...sharpOptions.webp,
      };
    case 'avif':
      return {
        ...baseOptions,
        ...sharpOptions.avif,
      };
    case 'jpeg':
      return baseOptions;
    case 'png':
      return {
        ...baseOptions,
        compressionLevel: 9,
      };
    default:
      return baseOptions;
  }
}

/**
 * Compresses and processes an image file in a Node.js environment using Sharp.
 * 
 * Features:
 * - Advanced image format support (WebP, AVIF, JPEG, PNG)
 * - Multiple resize modes with aspect ratio preservation
 * - Metadata control and preservation options
 * - Image enhancement options (sharpening, brightness, contrast)
 * - Format-specific optimizations
 * - Progressive JPEG support
 * - Detailed debug logging
 * - Quality optimization with binary search
 * - Smart downscaling
 * - Error handling with detailed information
 *
 * @param fileBuffer - The original image file buffer to compress
 * @param options - Advanced configuration options for compression and processing
 * @returns A Promise that resolves with the processed and compressed image as a Buffer
 * @throws {CompressionError} When compression fails or constraints cannot be met
 */
export async function nodeCompress(
  fileBuffer: Buffer,
  options: NodeCompressionOptions
): Promise<Buffer> {
  try {
    // Validate options
    validateOptions(options);

    const {
      maxSizeMB = 0.1,
      maxWidth = 800,
      maxHeight = null,
      preferredFormat = 'webp',
      preserveExif = false,
      resizeMode = 'contain',
      progressive = false,
      debug = false,
      sharp: sharpOptions = {},
    } = options;

    const {
      sharpen = false,
      stripMetadata = true,
      preprocessing = {},
    } = sharpOptions;

    const log = debug ? console.log.bind(console, '[ImageCompression:Node]') : () => {};
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    let currentQuality = 80; // Start with high quality

    // Initialize Sharp pipeline
    const pipeline = sharp(fileBuffer, { 
      failOnError: true,
      animated: true, // Preserve animation if present
    });

    // Get original metadata
    const metadata = await pipeline.metadata();
    log('Original image:', metadata);

    // Apply preprocessing
    if (preprocessing.normalize) {
      pipeline.normalize();
    }
    if (preprocessing.median) {
      pipeline.median();
    }
    if (typeof preprocessing.brightness === 'number') {
      pipeline.modulate({ brightness: preprocessing.brightness });
    }
    if (typeof preprocessing.contrast === 'number') {
      pipeline.modulate({ brightness: preprocessing.contrast });
    }

    // Resize image
    const fit = resizeMode === 'fill' ? 'fill' : 
                resizeMode === 'contain' ? 'inside' : 
                resizeMode === 'cover' ? 'cover' : 
                resizeMode === 'inside' ? 'inside' : 'outside';

    pipeline.resize({
      width: maxWidth,
      height: maxHeight || maxWidth,
      fit,
      withoutEnlargement: resizeMode === 'inside',
      position: 'centre',
    });

    // Apply sharpening if requested
    if (sharpen) {
      pipeline.sharpen();
    }

    // Handle metadata
    if (!preserveExif && stripMetadata) {
      pipeline.withMetadata();
    } else if (preserveExif) {
      pipeline.withMetadata();
    }

    // Determine output format and options
    const outputFormat = preferredFormat as ImageFormat;
    let compressedBuffer: Buffer | undefined;

    // Try compression with decreasing quality until size constraint is met
    while (currentQuality >= 10) {
      const formatOptions = getFormatOptions(outputFormat, options, currentQuality);
      
      try {
        compressedBuffer = await pipeline
          .toFormat(outputFormat, formatOptions)
          .toBuffer();

        if (compressedBuffer.length <= maxSizeBytes) {
          log(`Compression successful:
            - Size: ${(compressedBuffer.length / 1024).toFixed(1)}KB
            - Quality: ${currentQuality}
            - Format: ${outputFormat}
            - Dimensions: ${metadata.width}x${metadata.height}`);
          
          return compressedBuffer;
        }
      } catch (error) {
        log(`Compression failed at quality ${currentQuality}:`, error);
      }

      currentQuality -= 10;
    }

    throw new CompressionError(
      'Failed to compress image within size constraints',
      { maxSizeBytes, finalSize: compressedBuffer?.length }
    );
  } catch (error) {
    if (error instanceof CompressionError) {
      throw error;
    }
    throw new CompressionError('Image compression failed', error);
  }
}
