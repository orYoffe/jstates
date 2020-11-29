const { BABEL_ENV, NODE_ENV } = process.env;
const cjs = BABEL_ENV === "cjs" || NODE_ENV === "test";

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        loose: true,
        targets: {
          browsers: ["last 1 version"],
        },
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [cjs && "transform-es2015-modules-commonjs"].filter(Boolean),
};
