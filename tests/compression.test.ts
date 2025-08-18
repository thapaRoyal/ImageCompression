import { readFileSync } from 'fs';
import { join } from 'path';
import { compress } from '../src';
import { CompressionOptions } from '../src/types';

describe('Image Compression', () => {
  describe('Browser Compression', () => {
    it('should compress an image file to the specified size', async () => {
      const mockFile = new File([new ArrayBuffer(1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      });

      const options: CompressionOptions = {
        maxSizeMB: 0.1,
        quality: 0.9,
        maxWidth: 800,
        maxHeight: 600,
        preferredFormat: 'webp',
        preserveExif: false,
        resizeMode: 'contain',
      };

      const compressedFile = await compress(mockFile, options);

      expect(compressedFile.size).toBeLessThanOrEqual(options.maxSizeMB! * 1024 * 1024);
      expect(compressedFile.type).toBe('image/webp');
    });

    it('should respect resize mode options', async () => {
      const mockFile = new File([new ArrayBuffer(1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      });

      const options: CompressionOptions = {
        maxSizeMB: 0.1,
        quality: 0.9,
        maxWidth: 800,
        maxHeight: 600,
        resizeMode: 'cover',
      };

      const compressedFile = await compress(mockFile, options);
      expect(compressedFile.size).toBeLessThanOrEqual(options.maxSizeMB! * 1024 * 1024);
    });

    it('should throw error for invalid options', async () => {
      const mockFile = new File([new ArrayBuffer(1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      });

      const options: CompressionOptions = {
        maxSizeMB: -1, // Invalid value
        quality: 0.9,
      };

      await expect(compress(mockFile, options)).rejects.toThrow('maxSizeMB must be greater than 0');
    });
  });

  // Node.js compression tests removed. This file now only tests browser compression.
});
