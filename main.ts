const fs = require("node:fs");
const path = require("node:path");

const source = path.join(__dirname, "entry.png");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const maxBytes = 1_048_576;
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const image = fs.readFileSync(source);
if (image.length > maxBytes) throw new Error("entry.png exceeds 1048576 bytes");
if (image.length < 24 || !image.subarray(0, 8).equals(pngSignature)) {
  throw new Error("entry.png is not a PNG");
}

const width = image.readUInt32BE(16);
const height = image.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error("entry.png exceeds 1024 by 1024 pixels");
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "entry.png"), image);
console.log(`Copied entry.png: ${width}x${height}, ${image.length} bytes`);
