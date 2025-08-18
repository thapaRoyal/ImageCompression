
#  Image Compression (Browser & CDN Only)

An , production-ready image compression library for JavaScript and TypeScript, designed for browser and CDN usage. No Node.js/Sharp dependency. Offers extensive configuration, automatic format selection, and high-quality compression.

## Features

- Multiple output formats: WebP, JPEG, PNG, AVIF (auto-detects browser support)
- Five resize modes: contain, cover, fill, inside, outside
- Progressive JPEG support
- EXIF metadata preservation option
- Smart quality optimization using binary search
- Automatic downscaling for large images
- High-quality image rendering with smoothing
- TypeScript support with comprehensive type definitions
- Flexible configuration options
- Custom output filenames
- Automatic format fallbacks
- Detailed progress logging and error handling

## Installation

```bash
npm install @thaparoyal/image-compression
```



## CDN Usage

Use the CDN build for browser:

```html
<script src="https://cdn.jsdelivr.net/npm/@thaparoyal/image-compression/dist/image-compression.umd.js"></script>
```

After including the script, you can use the library as a UMD module:

```javascript
// If using a bundler or module loader (like RequireJS, SystemJS, etc.)
const { compress } = ImageCompression;

// Basic compression
const file = document.querySelector('input[type="file"]').files[0];
const compressedFile = await compress(file, {
  maxSizeMB: 0.5,  // target size in megabytes
  maxWidth: 1920,  // maximum width in pixels
  preferredFormat: 'webp'  // preferred output format
});

// Advanced compression with all options
const compressedFile = await compress(file, {
  maxSizeMB: 0.5,
  maxWidth: 1920,
  maxHeight: 1080,
  preferredFormat: 'webp',
  quality: 0.9,
  resizeMode: 'cover',
  preserveExif: true,
  progressive: true,
  debug: true,
  outputFilename: 'compressed-image.webp',
  downscaleDivisor: 4,
  minQuality: 0.2,
});
```



## CDN Example

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
        resizeMode: 'contain',
        preserveExif: false,
        progressive: false,
        debug: true,
        outputFilename: 'output.webp',
      };
      try {
        // Use as UMD module
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

## API Reference

### `compress(fileOrBlob: File | Blob, options: CompressionOptions): Promise<File>`

Compresses an image in the browser with  options.

#### `CompressionOptions`

```typescript
interface CompressionOptions {
  maxSizeMB?: number;        // Target maximum size in megabytes (default: 0.1)
  quality?: number;          // Starting compression quality 0-1 (default: 0.9)
  maxWidth?: number;         // Maximum width in pixels (default: 800)
  maxHeight?: number | null; // Maximum height in pixels (default: null)
  preferredFormat?: 'webp' | 'jpeg' | 'png' | 'avif';  // Preferred output format (default: 'webp')
  preserveExif?: boolean;    // Preserve EXIF metadata (default: false)
  resizeMode?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';  // Resize mode (default: 'contain')
  minQuality?: number;       // Minimum allowed quality (default: 0.1)
  progressive?: boolean;     // Enable progressive JPEG (default: false)
  debug?: boolean;           // Enable debug logging (default: false)
  outputFilename?: string;   // Custom output filename
  downscaleDivisor?: number; // Divisor for initial downscaling (default: 5)
}
```

###  Usage Examples

#### Example: Custom Resize Mode

```javascript
const compressedFile = await compress(file, {
  maxSizeMB: 0.2,
  maxWidth: 1024,
  maxHeight: 768,
  resizeMode: 'cover',
});
```

#### Example: Progressive JPEG

```javascript
const compressedFile = await compress(file, {
  preferredFormat: 'jpeg',
  progressive: true,
});
```

#### Example: Preserve EXIF Metadata

```javascript
const compressedFile = await compress(file, {
  preserveExif: true,
});
```

#### Example: Custom Output Filename

```javascript
const compressedFile = await compress(file, {
  outputFilename: 'my-image.webp',
});
```

#### Example: Debug Logging

```javascript
const compressedFile = await compress(file, {
  debug: true,
});
```

## How It Works

- Uses browser canvas for resizing and format conversion
- Automatically selects the best supported format
- Optimizes quality using binary search to meet target size
- Preserves EXIF metadata if requested
- Supports all major browsers and CDN delivery

## License

MIT © [Thapa Royal](https://www.npmjs.com/~thaparoyal)
