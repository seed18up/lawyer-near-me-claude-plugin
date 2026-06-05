/**
 * html-to-png.js
 * Screenshot an HTML file to PNG using Chrome headless (no Puppeteer needed).
 *
 * Usage:
 *   node html-to-png.js <input.html> <output.png>
 *
 * Example:
 *   node html-to-png.js report.html screenshot.png
 */

'use strict';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node html-to-png.js <input.html> <output.png>');
    process.exit(1);
  }

  const inputHtml = path.resolve(args[0]);
  const outputPng = path.resolve(args[1]);

  // Verify the input HTML file exists
  if (!fs.existsSync(inputHtml)) {
    console.error(`Error: Input file not found: ${inputHtml}`);
    process.exit(1);
  }

  // Verify Chrome executable exists
  if (!fs.existsSync(CHROME_PATH)) {
    console.error(`Error: Chrome not found at: ${CHROME_PATH}`);
    process.exit(1);
  }

  // Chrome requires a file:/// URI for local HTML files
  const fileUri = 'file:///' + inputHtml.replace(/\\/g, '/');

  // Build the Chrome headless command
  // --screenshot=<path>   : save screenshot to the given path
  // --window-size=W,H     : set the viewport size
  // --no-sandbox          : required in some Windows/CI environments
  // --disable-gpu         : avoids GPU issues in headless mode
  // --hide-scrollbars     : cleaner output
  const command = [
    `"${CHROME_PATH}"`,
    '--headless',
    `--screenshot="${outputPng}"`,
    '--window-size=1400,2200',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    `"${fileUri}"`
  ].join(' ');

  console.log('Chrome path  :', CHROME_PATH);
  console.log('Input HTML   :', inputHtml);
  console.log('Output PNG   :', outputPng);
  console.log('Running      :', command);
  console.log('');

  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`\nDone. Screenshot saved to: ${outputPng}`);
  } catch (err) {
    console.error('\nError running Chrome:', err.message);
    process.exit(1);
  }
}

main();
