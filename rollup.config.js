import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/image-compression.cjs.js',   // CommonJS (Node)
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/image-compression.esm.js',   // ESM (modern bundlers)
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/image-compression.umd.js',   // Browser global (CDN)
      format: 'iife',
      name: 'ImageCompression',
      sourcemap: true,
    }
  ],
  plugins: [
    typescript(),
    terser(),
  ],
};
