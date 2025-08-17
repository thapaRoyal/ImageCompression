var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sharp from 'sharp';
/**
 * Compresses an image file in a Node.js environment using sharp.
 *
 * @param fileBuffer - The original image file buffer to compress.
 * @param options - Configuration options for compression.
 * @returns A Promise that resolves with the compressed image as a Buffer.
 */
export function nodeCompress(fileBuffer, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { maxSizeMB = 0.1, quality: initialQuality = 80, maxWidth = 800, maxHeight = null, } = options;
        let quality = initialQuality;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        let image = sharp(fileBuffer);
        // Resize the image to fit within maxWidth and maxHeight
        image = image.resize({
            width: maxWidth,
            height: maxHeight || maxWidth,
            fit: 'inside',
            withoutEnlargement: true,
        });
        // Compress the image
        const metadata = yield image.metadata();
        const format = metadata.format === 'webp' ? 'webp' : 'jpeg';
        let compressedBuffer = yield image
            .toFormat(format, { quality })
            .toBuffer();
        // If the compressed image is still too large, progressively reduce quality
        while (compressedBuffer.length > maxSizeBytes && quality > 10) {
            quality -= 10;
            compressedBuffer = yield image
                .toFormat(format, { quality })
                .toBuffer();
        }
        if (compressedBuffer.length > maxSizeBytes) {
            throw new Error('Failed to compress image within size constraints');
        }
        return compressedBuffer;
    });
}
