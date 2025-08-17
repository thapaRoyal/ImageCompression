var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { compressImage } from './utils/compressImage';
/**
 * Main function to compress an image file or Blob.
 *
 * @param fileOrBlob - The original image file or Blob to compress.
 * @param options - Configuration options for compression.
 * @returns A Promise that resolves with the compressed image as a File object.
 */
export function compress(fileOrBlob, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return compressImage(fileOrBlob, options);
    });
}
export * from './types';
