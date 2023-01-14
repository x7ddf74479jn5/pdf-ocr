import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import { viteStaticCopy } from 'vite-plugin-static-copy'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),svgr(),viteStaticCopy({
    targets: [
      {
        src: "./node_modules/pdfjs-dist/cmaps/",
        dest: "assets"
      }
    ]
  })],
})
