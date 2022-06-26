import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'src/ww.ts',
        output: [
            {
                file: 'output/ww.js',
                format: 'es'
            }
        ],
        plugins: [typescript({ sourceMap: false }), resolve(), commonjs(), terser()]
    },
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'output/index.js',
                format: 'es'
            }
        ],
        plugins: [typescript({ sourceMap: false }), resolve(), commonjs(), terser()]
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'output/index.d.ts',
            format: 'es'
        },
        plugins: [typescript({ sourceMap: false }), resolve(), commonjs(), dts()]
    }
];
