// Temporary file for nodeCompress implementation
import sharp from 'sharp';
import { NodeCompressionOptions, ImageFormat } from '../types';

/**
 * Custom error class for compression-related failures
 */
class CompressionError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'CompressionError';
  }
}

/**
 * Validates compression options and sets defaults
 * @throws {CompressionError} If any options are invalid
 */
function validateOptions(options: NodeCompressionOptions): void {
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
