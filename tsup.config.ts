import { defineConfig } from "tsup"

export default defineConfig({
    entry:['src/server.ts'],
    clean:true,
    format:['esm','cjs'],
    dts:true,
    sourcemap:true,
    splitting:false,
    minify:true,
    target:'node20',
    outDir:'dist'
})
