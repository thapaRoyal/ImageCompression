
#  Image Compression (Browser & CDN Only)
[![npm version](https://img.shields.io/npm/v/@thaparoyal/image-compression)](https://www.npmjs.com/package/@thaparoyal/image-compression)
[![npm downloads](https://img.shields.io/npm/dw/@thaparoyal/image-compression)](https://www.npmjs.com/package/@thaparoyal/image-compression)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@thaparoyal/image-compression)](https://bundlephobia.com/package/@thaparoyal/image-compression)
[![license](https://img.shields.io/npm/l/@thaparoyal/image-compression)](./LICENSE)

image compression library for JavaScript and TypeScript, designed for browser and CDN usage. Offers extensive configuration, automatic format selection, and high-quality compression.

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
<script src="https://cdn.jsdelivr.net/npm/@thaparoyal/image-compression@1.1.13/dist/image-compression.umd.js"></script>
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



## Complete CDN Example

Here's a complete example showing image compression with preview, size comparison, and all available options:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Compression Demo</title>
    <script src="https://cdn.jsdelivr.net/npm/@thaparoyal/image-compression@1.2.13/dist/image-compression.umd.js"></script>
    <style>
        body {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        .preview {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }
        .preview > div {
            flex: 1;
        }
        .preview img {
            max-width: 100%;
            height: auto;
        }
        .stats {
            margin: 10px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
        }
        .options {
            margin: 20px 0;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
        }
        .loading {
            display: none;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>Image Compression Demo</h1>
    <div class="options">
        <div>
            <label>Max Size (MB):
                <input type="number" id="maxSize" value="0.5" step="0.1" min="0.1">
            </label>
        </div>
        <div>
            <label>Quality (0-1):
                <input type="number" id="quality" value="0.9" step="0.1" min="0.1" max="1">
            </label>
        </div>
        <div>
            <label>Max Width:
                <input type="number" id="maxWidth" value="800" step="100">
            </label>
        </div>
        <div>
            <label>Max Height:
                <input type="number" id="maxHeight" value="600" step="100">
            </label>
        </div>
        <div>
            <label>Format:
                <select id="format">
                    <option value="webp">WebP</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="avif">AVIF</option>
                </select>
            </label>
        </div>
        <div>
            <label>Resize Mode:
                <select id="resizeMode">
                    <option value="contain">Contain</option>
                    <option value="cover">Cover</option>
                    <option value="fill">Fill</option>
                    <option value="inside">Inside</option>
                    <option value="outside">Outside</option>
                </select>
            </label>
        </div>
        <div>
            <label>
                <input type="checkbox" id="preserveExif">
                Preserve EXIF
            </label>
        </div>
        <div>
            <label>
                <input type="checkbox" id="progressive">
                Progressive
            </label>
        </div>
    </div>

    <input type="file" id="fileInput" accept="image/*">
    <div class="loading">Compressing...</div>

    <div class="preview">
        <div>
            <h3>Original</h3>
            <img id="originalPreview">
            <div id="originalStats" class="stats"></div>
        </div>
        <div>
            <h3>Compressed</h3>
            <img id="compressedPreview">
            <div id="compressedStats" class="stats"></div>
        </div>
    </div>

    <script>
        document.getElementById('fileInput').addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Show loading
            document.querySelector('.loading').style.display = 'block';

            // Preview original
            const originalPreview = document.getElementById('originalPreview');
            const originalUrl = URL.createObjectURL(file);
            originalPreview.src = originalUrl;

            // Show original stats
            document.getElementById('originalStats').innerHTML = `
                Size: ${(file.size / 1024).toFixed(2)} KB<br>
                Type: ${file.type}
            `;

            // Get compression options from inputs
            const options = {
                maxSizeMB: parseFloat(document.getElementById('maxSize').value),
                quality: parseFloat(document.getElementById('quality').value),
                maxWidth: parseInt(document.getElementById('maxWidth').value),
                maxHeight: parseInt(document.getElementById('maxHeight').value),
                preferredFormat: document.getElementById('format').value,
                resizeMode: document.getElementById('resizeMode').value,
                preserveExif: document.getElementById('preserveExif').checked,
                progressive: document.getElementById('progressive').checked,
                debug: true,
            };

            try {
                const compressedFile = await ImageCompression.compress(file, options);
                
                // Preview compressed
                const compressedPreview = document.getElementById('compressedPreview');
                const compressedUrl = URL.createObjectURL(compressedFile);
                compressedPreview.src = compressedUrl;

                // Show compressed stats
                document.getElementById('compressedStats').innerHTML = `
                    Size: ${(compressedFile.size / 1024).toFixed(2)} KB<br>
                    Type: ${compressedFile.type}<br>
                    Compression: ${(100 - (compressedFile.size / file.size) * 100).toFixed(1)}%
                `;

                // Cleanup
                document.querySelector('.loading').style.display = 'none';
            } catch (error) {
                console.error('Compression failed:', error);
                document.querySelector('.loading').style.display = 'none';
                alert('Compression failed: ' + error.message);
            }
        });
    </script>
</body>
</html>
```

This example provides:
- Live image preview for both original and compressed images
- Size comparison and compression ratio
- UI controls for all compression options
- Progress indication
- Error handling
- Responsive layout

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
