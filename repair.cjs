const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'calculators');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let repairedFiles = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Find the exact mangled pattern and restore it to `=>`
  // The mangled pattern is `= placeholder="some string">`
  content = content.replace(/= placeholder="[^"]+">/g, '=>');

  // There's also the case where it ended with '/>' originally, wait: 
  // No, the regex `([^>]*?)` stopped at the FIRST `>`. So it just replaced `>` with ` placeholder="...">`.
  // So `=>` became `= placeholder="...">`. 
  // Replacing it back with `=>` perfectly restores the original JSX!

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    repairedFiles++;
  }
});

console.log(`Repaired ${repairedFiles} files.`);
