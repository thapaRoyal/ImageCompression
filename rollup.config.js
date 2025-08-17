import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/image-compression.umd.js',
      format: 'umd',
      name: 'ImageCompression',
      sourcemap: true,
    },
    {
      file: 'dist/image-compression.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript(),
    terser(),
  ],
};
