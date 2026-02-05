const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'www');

function rmDirRecursive(p) {
  if (!fs.existsSync(p)) return;
  for (const entry of fs.readdirSync(p)) {
    const cur = path.join(p, entry);
    const stat = fs.lstatSync(cur);
    if (stat.isDirectory()) {
      rmDirRecursive(cur);
    } else {
      fs.unlinkSync(cur);
    }
  }
  fs.rmdirSync(p);
}

function copyRecursive(src, dest) {
  const stat = fs.lstatSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Files and folders to copy. Adjust if you add more web assets.
const items = ['index.html', 'script.js', 'styles.css', 'assets'];

if (fs.existsSync(out)) {
  console.log('Removing existing www/');
  rmDirRecursive(out);
}

fs.mkdirSync(out);

for (const item of items) {
  const src = path.join(root, item);
  if (!fs.existsSync(src)) {
    console.warn(`Skipping missing item: ${item}`);
    continue;
  }
  const dest = path.join(out, item);
  copyRecursive(src, dest);
  console.log(`Copied ${item} -> www/${item}`);
}

console.log('Web assets prepared in www/');
