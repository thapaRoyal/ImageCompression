# Image Compression

Image compression library for JavaScript and TypeScript. This library supports both browser and Node.js environments, providing efficient image compression with customizable options.

## Features

- Supports WebP and JPEG formats.
- Resizes images to fit within specified dimensions while preserving aspect ratio.
- Binary search for optimal quality to meet size constraints.
- Progressive downscaling for large images.
- Node.js support using `sharp` for server-side compression.
- TypeScript support with type definitions.

## Installation

```bash
npm i @thaparoyal/image-compression
```

## Usage

### Browser Example

```typescript
import { compress } from 'image-compression';

const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];

  const options = {
    maxSizeMB: 0.1,
    quality: 0.9,
    maxWidth: 800,
    maxHeight: 600,
  };

  try {
    const compressedFile = await compress(file, options);
    console.log('Compressed file:', compressedFile);
  } catch (error) {
    console.error('Compression failed:', error);
  }
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

## API

### `compress(fileOrBlob: File | Blob, options: CompressionOptions): Promise<File>`

Compresses an image in the browser.

#### Parameters
- `fileOrBlob`: The original image file or Blob to compress.
- `options`: Configuration options for compression.
  - `maxSizeMB` (default: `0.1`): Target maximum size in megabytes.
  - `quality` (default: `0.9`): Starting compression quality (0.0 to 1.0).
  - `maxWidth` (default: `800`): Maximum width in pixels.
  - `maxHeight` (default: `null`): Maximum height in pixels.
  - `downscaleDivisor` (default: `5`): Downscale divisor for large images.

#### Returns
A Promise that resolves with the compressed image as a File object.

### `nodeCompress(fileBuffer: Buffer, options: CompressionOptions): Promise<Buffer>`

Compresses an image in a Node.js environment.

#### Parameters
- `fileBuffer`: The original image file buffer to compress.
- `options`: Configuration options for compression.
  - `maxSizeMB` (default: `0.1`): Target maximum size in megabytes.
  - `quality` (default: `80`): Starting compression quality (1 to 100).
  - `maxWidth` (default: `800`): Maximum width in pixels.
  - `maxHeight` (default: `null`): Maximum height in pixels.

#### Returns
A Promise that resolves with the compressed image as a Buffer.

## License

MIT © [Thapa Royal](https://www.npmjs.com/~thaparoyal)
