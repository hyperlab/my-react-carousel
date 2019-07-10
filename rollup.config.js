import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.mjs",
        format: "esm"
      },
      {
        file: "dist/index.js",
        format: "cjs"
      }
    ],
    external: ["react"],
    plugins: [
      typescript(),
      terser({
        sourcemap: true,
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true,
          passes: 10
        },
        warnings: true,
        ecma: 5,
        mangle: true
      })
    ]
  },
  {
    input: "src/VerticalCarousel.tsx",
    output: [
      {
        file: "dist/VerticalCarousel.mjs",
        format: "esm"
      },
      {
        file: "dist/VerticalCarousel.js",
        format: "cjs"
      }
    ],
    external: ["react"],
    plugins: [
      typescript(),
      terser({
        sourcemap: true,
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true,
          passes: 10
        },
        warnings: true,
        ecma: 5,
        mangle: true
      })
    ]
  }
];
