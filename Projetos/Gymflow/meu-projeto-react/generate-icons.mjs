// generate-icons.mjs
// Gera os PNGs de ícone necessários para o PWA a partir do favicon.svg
//
// USO:
//   npm install sharp   (só uma vez)
//   node generate-icons.mjs

import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svgBuffer = readFileSync(join(__dirname, 'public/favicon.svg'))

const outDir = join(__dirname, 'public/icons')
mkdirSync(outDir, { recursive: true })

const sizes = [
  { name: 'icon-192.png',        size: 192 },
  { name: 'icon-512.png',        size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const { name, size } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(outDir, name))
  console.log(`✓ public/icons/${name}`)
}

console.log('\nÍcones gerados com sucesso!')
console.log('Agora rode: npm run build')
