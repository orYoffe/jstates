import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const input = "./index.ts";
const plugins = [
  typescript({
    typescript: require("typescript"),
  }),
  terser(),
];
export default [
  {
    input,
    output: {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
    plugins: plugins.slice(0, 1),
  },
  {
    input,
    output: {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    plugins,
  },
  {
    input,
    output: {
      file: pkg.browser,
      format: "iife",
      name: "jstates",

      // https://rollupjs.org/guide/en/#outputglobals
      globals: {},
      sourcemap: true,
    },
    plugins,
  },
];
