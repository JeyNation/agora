const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIcoModule = require('png-to-ico');
const pngToIco = pngToIcoModule.default || pngToIcoModule;

const svgPath = path.join(__dirname, '..', 'public', 'favicon.svg');
const outIco = path.join(__dirname, '..', 'public', 'favicon.ico');

async function gen() {
  const svgBuffer = fs.readFileSync(svgPath);
  const sizes = [16, 24, 32, 48, 64];
  const pngBuffers = [];
  for (const size of sizes) {
    const buf = await sharp(svgBuffer)
      .resize(size, size, { fit: 'contain' })
      .png()
      .toBuffer();
    pngBuffers.push(buf);
  }
  const icoBuffer = await pngToIco(pngBuffers);
  fs.writeFileSync(outIco, icoBuffer);
  console.log('Generated', outIco);
}

gen().catch(err => {
  console.error(err);
  process.exit(1);
});
