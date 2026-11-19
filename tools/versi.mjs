// Memberi nomor versi (hash isi file) pada CSS & JS di index.html,
// supaya pengunjung langsung mendapat file terbaru setelah website diperbarui.
// Jalankan sebelum commit:  node tools/versi.mjs
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlFile = path.join(root, 'index.html');
let html = fs.readFileSync(htmlFile, 'utf8');

for (const rel of ['assets/css/style.css', 'assets/js/main.js', 'assets/js/vendor/lenis.min.js']) {
  const hash = crypto.createHash('sha1').update(fs.readFileSync(path.join(root, rel))).digest('hex').slice(0, 8);
  const re = new RegExp(`(${rel.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')})(\\?v=[0-9a-f]+)?(?=")`, 'g');
  const before = html;
  html = html.replace(re, `$1?v=${hash}`);
  console.log(before === html ? `(tidak berubah) ${rel}` : `${rel}?v=${hash}`);
}
fs.writeFileSync(htmlFile, html);
