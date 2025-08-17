# Advanced Image Compression

A powerful and flexible image compression library for JavaScript and TypeScript that provides comprehensive image processing capabilities for both browser and Node.js environments. This production-ready library offers advanced features, extensive customization options, and optimal compression while maintaining image quality.

## Key Featuresge Compression

Image compression library for JavaScript and TypeScript. This library supports both browser and Node.js environments, providing efficient image compression with customizable options.

## Features

### Browser Support
- Multiple output formats (WebP, JPEG, PNG, AVIF) with automatic format selection
- Five resize modes: contain, cover, fill, inside, outside
- Progressive JPEG support
- EXIF metadata preservation option
- Smart quality optimization using binary search
- Automatic downscaling for large images
- High-quality image rendering with smoothing

### Node.js Support
- Advanced image processing using Sharp
- Additional format support (WebP, AVIF, PNG, JPEG)
- Image enhancement options:
  - Sharpening
  - Brightness adjustment
  - Contrast adjustment
  - Normalization
  - Median filtering
- Format-specific optimizations for WebP and AVIF
- Metadata control (preservation/stripping)
- Detailed debug logging

### General Features
- TypeScript support with comprehensive type definitions
- Flexible configuration options
- Custom output filenames
- Automatic format fallbacks
- Detailed progress logging
- Error handling and validation

## Installation

```bash
npm install @thaparoyal/image-compression
```

### Dependencies

- For browser usage: No additional dependencies required
- For Node.js usage: Requires `sharp` (automatically installed as a dependency)

## Quick Start

### Browser Usage

```javascript
import { compress } from '@thaparoyal/image-compression';

// Basic compression
const file = document.querySelector('input[type="file"]').files[0];
const compressedFile = await compress(file, {
  maxSizeMB: 0.5,  // target size in megabytes
  maxWidth: 1920,  // maximum width in pixels
  preferredFormat: 'webp'  // preferred output format
});

// Advanced compression with options
const compressedFile = await compress(file, {
  maxSizeMB: 0.5,
  maxWidth: 1920,
  maxHeight: 1080,
  preferredFormat: 'webp',
  quality: 0.9,
  resizeMode: 'cover',
  preserveExif: true,
  progressive: true,
  debug: true
});
```

### Node.js Example

```typescript
import { nodeCompress } from 'image-compression/src/utils/nodeCompress';
import fs from 'fs';

const inputPath = 'input.jpg';
const outputPath = 'output.jpg';

const fileBuffer = fs.readFileSync(inputPath);

const options = {
  maxSizeMB: 0.1,
  quality: 80,
  maxWidth: 800,
  maxHeight: 600,
};

nodeCompress(fileBuffer, options)
  .then((compressedBuffer) => {
    fs.writeFileSync(outputPath, compressedBuffer);
    console.log('Image compressed successfully');
  })
  .catch((error) => {
    console.error('Compression failed:', error);
  });
```

### CDN Usage

You can also use this library via a CDN. The UMD build is available for use in browsers.

#### Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image Compression</title>
  <script src="https://cdn.jsdelivr.net/npm/@thaparoyal/image-compression/dist/image-compression.umd.js"></script>
</head>
<body>
  <input type="file" id="fileInput" />
  <script>
    document.getElementById('fileInput').addEventListener('change', async (event) => {
      const file = event.target.files[0];

      const options = {
        maxSizeMB: 0.1,
        quality: 0.9,
        maxWidth: 800,
        maxHeight: 600,
      };

      try {
        const compressedFile = await ImageCompression.compress(file, options);
        console.log('Compressed file:', compressedFile);
      } catch (error) {
        console.error('Compression failed:', error);
      }
    });
  </script>
</body>
</html>
```

### CDN Link

Use the following link to include the library via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@thaparoyal/image-compression/dist/image-compression.umd.js"></script>
```

## API Reference

### Browser API

#### `compress(fileOrBlob: File | Blob, options: CompressionOptions): Promise<File>`

Compresses an image in the browser environment with advanced options.

```typescript
interface CompressionOptions {
  // Basic Options
  maxSizeMB?: number;        // Target maximum size in megabytes (default: 0.1)
  quality?: number;          // Starting compression quality 0-1 (default: 0.9)
  maxWidth?: number;         // Maximum width in pixels (default: 800)
  maxHeight?: number | null; // Maximum height in pixels (default: null)
  
  // Advanced Options
  preferredFormat?: 'webp' | 'jpeg' | 'png' | 'avif';  // Preferred output format (default: 'webp')
  preserveExif?: boolean;    // Preserve EXIF metadata (default: false)
  resizeMode?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';  // Resize mode (default: 'contain')
  minQuality?: number;       // Minimum allowed quality (default: 0.1)
  progressive?: boolean;     // Enable progressive JPEG (default: false)
  debug?: boolean;          // Enable debug logging (default: false)
  outputFilename?: string;  // Custom output filename
  downscaleDivisor?: number; // Divisor for initial downscaling (default: 5)
}
```

### Node.js API

#### `nodeCompress(fileBuffer: Buffer, options: NodeCompressionOptions): Promise<Buffer>`

Compresses and processes an image in the Node.js environment using Sharp.

```typescript
interface NodeCompressionOptions extends CompressionOptions {
  sharp?: {
    // Image Enhancement
    sharpen?: boolean;      // Apply sharpening (default: false)
    stripMetadata?: boolean; // Remove metadata (default: true)
    
    // WebP Options
    webp?: {
      lossless?: boolean;
      nearLossless?: boolean;
      smartSubsample?: boolean;
    };
    
    // AVIF Options
    avif?: {
      lossless?: boolean;
      speed?: number;
    };
    
    // Preprocessing Options
    preprocessing?: {
      brightness?: number;  // Adjust brightness (0-100)
      contrast?: number;    // Adjust contrast (0-100)
      normalize?: boolean;  // Normalize contrast
      median?: boolean;     // Apply median filter
    };
  };
}

#### Returns
A Promise that resolves with the compressed image as a Buffer.

## License

MIT © [Thapa Royal](https://www.npmjs.com/~thaparoyal)
