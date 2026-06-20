const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const file = process.argv[2];
const start = parseInt(process.argv[3] || '0');
const len = parseInt(process.argv[4] || '5000');

async function main() {
  const data = new Uint8Array(fs.readFileSync(file));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  console.log('Pages:', doc.numPages);
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join('') + '\n';
  }
  console.log(text.substring(start, start + len));
}
main();
