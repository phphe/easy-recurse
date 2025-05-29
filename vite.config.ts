import { defineConfig, LibraryFormats } from "vite";
import dts from "vite-plugin-dts";
import pkg from "./package.json";

// ============================ config area ============================
export const name = "easyRecurse"; // for umd, iife
export const banner = `
/*!
 * ${pkg.name} v${pkg.version}
 * Author: ${pkg.author}
 * Released under the ${pkg.license} License.
 */`.trim();
/**
 * globals are externals for iife format
 */
export const globals = {};
// ============================ config area end ============================

// https://vitejs.dev/config/
export const isIIFE = detectIIFE();
export const formats: LibraryFormats[] = !isIIFE
  ? ["es", "umd", "cjs"]
  : ["iife"];
export default defineConfig({
  plugins: [
    !isIIFE &&
      dts({
        staticImport: true,
        insertTypesEntry: true,
      }),
  ],
  optimizeDeps: {
    exclude: [],
  },
  build: {
    outDir: "dist",
    sourcemap: isIIFE,
    emptyOutDir: !isIIFE,
    lib: {
      entry: "src/index.ts",
      name,
      fileName: "index",
      formats,
    },
    rollupOptions: {
      external: externalFunction,
      output: {
        banner,
        exports: "auto",
        globals,
      },
    },
  },
});

export const esmExternals = [
  ...Object.keys(pkg["dependencies"] || {}),
  ...Object.keys(pkg["peerDependencies"] || {}),
];
export const iifeExternals = [
  ...Object.keys(globals),
  ...Object.keys(pkg["peerDependencies"] || {}),
];

export function externalFunction(id) {
  id = id.replace(/\\/g, "/");
  const externals = isIIFE ? iifeExternals : esmExternals;
  for (const name of externals) {
    if (id.startsWith(name)) {
      return true;
    }
  }
  return false;
}

function detectIIFE() {
  return process.argv.indexOf("--iife") > -1
}
