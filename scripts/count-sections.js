const fs = require('fs');
const path = require('path');
function scan(dir) {
  let r = [];
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) r = r.concat(scan(fp));
    else if (f.endsWith('.json') && !f.includes('dika')) r.push(fp);
  });
  return r;
}
const files = scan('law');
let total = 0;
files.sort().forEach(f => {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  console.log(f.replace(/\\/g, '/') + ': ' + j.sections.length);
  total += j.sections.length;
});
console.log('\nTotal: ' + total);
