const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'calculators');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let alignedFiles = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Find grids that contain input wrappers and add bottom alignment
  // Look for: className="grid grid-cols-X gap-Y"
  // And update to: className="grid grid-cols-X gap-Y items-end"
  content = content.replace(/className="(grid grid-cols-\d+ gap-\d+)"/g, (match, classes) => {
    if (!match.includes('items-end')) {
      return `className="${classes} items-end"`;
    }
    return match;
  });

  // 2. Ensure children are h-full and justify-end to accommodate varying label lengths
  // Look for: className="flex flex-col gap-1.5" or gap-2
  // Update to: className="flex flex-col gap-1.5 h-full justify-end"
  content = content.replace(/className="(flex flex-col gap-(?:1\.5|2|3|4))"/g, (match, classes) => {
    if (!match.includes('justify-end')) {
      return `className="${classes} h-full justify-end"`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    alignedFiles++;
  }
});

console.log(`Successfully aligned input grids in ${alignedFiles} files.`);
