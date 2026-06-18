const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.isDirectory() && f.name !== 'node_modules') files.push(...walk(dir + '/' + f.name));
    else if (f.name === 'index.html' && dir.includes('law/')) files.push(dir + '/' + f.name);
  }
  return files;
}

const DIKA_CSS = `
    .card-dika-links{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
    .dika-link{font-size:12px;font-weight:700;color:var(--navy);background:#fff8e1;border:1px solid rgba(249,168,37,.35);padding:2px 8px;border-radius:10px;transition:background .15s;text-decoration:none}
    .dika-link:hover{background:#ffe082}`;

const DIKA_JS_OLD = `'<div class="card-footer"><span class="card-law-name">`;
const DIKA_JS_NEW_TEMPLATE = (lawName) => `var dikaHtml="";if(s.dika&&s.dika.length){dikaHtml=\'<div class="card-dika-links">\'+s.dika.map(function(num){return\'<a class="dika-link" href="https://deka.in.th/deka/\'+num.split("/")[1]+"-"+num.split("/")[0]+\'" target="_blank">📋 ฎีกา \'+num+"</a>"}).join("")+"</div>"}
'<div class="card-footer">'+(dikaHtml||'<span class="card-law-name">`;

let patched = 0;
const files = walk('law');

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');

  if (html.includes('dika-link')) {
    console.log('SKIP (already has dika):', file);
    continue;
  }

  if (!html.includes('card-footer')) {
    console.log('SKIP (no card-footer):', file);
    continue;
  }

  let changed = false;

  // 1. Add CSS before </style>
  if (!html.includes('.dika-link')) {
    html = html.replace('</style>', DIKA_CSS + '\n  </style>');
    changed = true;
  }

  // 2. Add dika rendering in renderCard function
  // Find the pattern: '<div class="card-footer"><span class="card-law-name">⚖️ LAWNAME</span></div></div>'
  // Replace with dika links + fallback to law name
  const footerMatch = html.match(/'<div class="card-footer"><span class="card-law-name">([^']*)<\/span><\/div><\/div>'/);
  if (footerMatch) {
    const lawName = footerMatch[1];
    const oldStr = footerMatch[0];
    const newStr = `var dikaHtml="";if(s.dika&&s.dika.length){dikaHtml='<div class="card-dika-links">'+s.dika.map(function(num){return'<a class="dika-link" href="https://deka.in.th/deka/'+num.split("/")[1]+"-"+num.split("/")[0]+'" target="_blank">📋 ฎีกา '+num+"</a>"}).join("")+"</div>"}
      return '<div class="card-footer">'+(dikaHtml||'<span class="card-law-name">${lawName}</span>')+'</div></div>'`;

    // We need to restructure - find the full return statement and modify it
    // The current pattern is:  + '<div class="card-footer"><span class="card-law-name">XXX</span></div></div>'
    // Change to: var dikaHtml=...; return ... + '<div class="card-footer">' + (dikaHtml || '<span>...</span>') + '</div></div>'

    const oldFooter = `+'<div class="card-footer"><span class="card-law-name">${lawName}</span></div></div>'`;
    if (html.includes(oldFooter)) {
      const newFooter = `;var dikaHtml="";if(s.dika&&s.dika.length){dikaHtml='<div class="card-dika-links">'+s.dika.map(function(num){return'<a class="dika-link" href="https://deka.in.th/deka/'+num.split("/")[1]+"-"+num.split("/")[0]+'" target="_blank">📋 \\u0E0E\\u0E35\\u0E01\\u0E32 '+num+"</a>"}).join("")+"</div>"}return r+'<div class="card-footer">'+(dikaHtml||'<span class="card-law-name">${lawName}</span>')+'</div></div>'`;

      // Actually simpler: just inject dika rendering before the card-footer line
      // Current: ...kwHtml+'</div><div class="card-footer"><span...
      // New: ...kwHtml+'</div>'+dikaBlock+'<div class="card-footer">...

      html = html.replace(oldFooter, oldFooter);  // no-op, let's try different approach
    }
    changed = false; // reset, try different approach
  }

  // Simpler approach: inject dika code block right before the card-footer in the return
  // Find: '<div class="card-keywords">'+kwHtml+'</div><div class="card-footer">
  // Or find the renderCard return and add dika

  // Most reliable: find the renderCard function and add dika rendering
  // All generated files have this pattern in renderCard:
  //   return'<div class="law-card"...>'+...+'<div class="card-keywords">'+kwHtml+'</div><div class="card-footer"><span class="card-law-name">...

  // Step 1: Add dikaHtml variable computation after kwHtml
  if (html.includes("var kwHtml=") && !html.includes("dikaHtml")) {
    // Add dika computation after textHtml line
    html = html.replace(
      /var textHtml=([^;]+;)/,
      `var textHtml=$1var dikaHtml="";if(s.dika&&s.dika.length){dikaHtml='<div class="card-dika-links">'+s.dika.map(function(num){var p=num.split("/");return'<a class="dika-link" href="https://deka.in.th/deka/'+p[1]+"-"+p[0]+'" target="_blank">\\uD83D\\uDCCB \\u0E0E\\u0E35\\u0E01\\u0E32 '+num+"</a>"}).join("")+"</div>"}`
    );

    // Step 2: Insert dikaHtml before card-footer
    html = html.replace(
      /'\+kwHtml\+'<\/div><div class="card-footer">/,
      "'+kwHtml+'</div>'+dikaHtml+'<div class=\"card-footer\">"
    );

    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('PATCHED:', file);
    patched++;
  } else {
    console.log('NO CHANGE:', file);
  }
}

console.log('\nTotal patched:', patched);
