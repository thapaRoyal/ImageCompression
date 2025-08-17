import { compress } from '../src';
import { CompressionOptions } from '../src/types';

describe('Image Compression', () => {
  it('should compress an image file to the specified size', async () => {
    const mockFile = new File([new ArrayBuffer(1024 * 1024)], 'test.jpg', {
      type: 'image/jpeg',
    });

    const options: CompressionOptions = {
      maxSizeMB: 0.1,
      quality: 0.9,
      maxWidth: 800,
      maxHeight: 600,
    };

    const compressedFile = await compress(mockFile, options);

    expect(compressedFile.size).toBeLessThanOrEqual((options.maxSizeMB ?? 1) * 1024 * 1024);
    expect(compressedFile.type).toBe('image/jpeg');
  });

  it('should throw an error if compression fails', async () => {
    const mockFile = new File([new ArrayBuffer(1024 * 1024)], 'test.jpg', {
      type: 'image/jpeg',
    });

    const options: CompressionOptions = {
      maxSizeMB: 0.01, // Unrealistically small size to force failure
      quality: 0.9,
      maxWidth: 800,
      maxHeight: 600,
    };

    await expect(compress(mockFile, options)).rejects.toThrow('Failed to compress image');
  });
});
