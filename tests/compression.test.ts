import { readFileSync } from 'fs';
import { join } from 'path';
import { compress } from '../src';
import { nodeCompress } from '../src/utils/nodeCompress';
import { CompressionOptions, NodeCompressionOptions } from '../src/types';

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

  describe('Node.js Compression', () => {
    const testImagePath = join(__dirname, '../test-assets/test-image.jpg');
    let testImageBuffer: Buffer;

    beforeAll(() => {
      testImageBuffer = readFileSync(testImagePath);
    });

    it('should compress an image buffer with default options', async () => {
      const options: NodeCompressionOptions = {
        maxSizeMB: 0.1,
        preferredFormat: 'webp',
      };

      const compressedBuffer = await nodeCompress(testImageBuffer, options);
      expect(compressedBuffer.length).toBeLessThanOrEqual(options.maxSizeMB! * 1024 * 1024);
    });

    it('should support advanced Sharp options', async () => {
      const options: NodeCompressionOptions = {
        maxSizeMB: 0.1,
        preferredFormat: 'webp',
        sharp: {
          sharpen: true,
          preprocessing: {
            normalize: true,
          },
          webp: {
            lossless: true,
          },
        },
      };

      const compressedBuffer = await nodeCompress(testImageBuffer, options);
      expect(compressedBuffer.length).toBeLessThanOrEqual(options.maxSizeMB! * 1024 * 1024);
    });

    it('should handle metadata preservation', async () => {
      const options: NodeCompressionOptions = {
        maxSizeMB: 0.1,
        preserveExif: true,
        preferredFormat: 'jpeg',
      };

      const compressedBuffer = await nodeCompress(testImageBuffer, options);
      expect(compressedBuffer.length).toBeLessThanOrEqual(options.maxSizeMB! * 1024 * 1024);
    });

    it('should throw error for unsupported format', async () => {
      const options: NodeCompressionOptions = {
        maxSizeMB: 0.1,
        preferredFormat: 'unsupported' as any,
      };

      await expect(nodeCompress(testImageBuffer, options)).rejects.toThrow();
    });
  });
});
