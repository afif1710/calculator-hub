const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'calculators');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let refactoredFiles = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Convert numeric states to optional string states for easier clearing
  // Find common patterns like useState(85.50), useState(0), useState(2000)
  // We want to change them to use string initializers where they feed into inputs
  
  // Note: Only targeting simple number initializers to avoid breaking complex objects
  content = content.replace(/useState\((\d+(?:\.\d+)?)\)/g, (match, val) => {
    // If it's a number that looks like a default value for an input, stick to string
    return `useState('${val}')`;
  });

  // 2. Fix the onChange logic to avoid Number() wrapping which forces 0 on empty strings
  // Change: onChange={e => setVal(Number(e.target.value))} -> onChange={e => setVal(e.target.value)}
  content = content.replace(/onChange=\{e\s*=>\s*set\w+\(Number\(e\.target\.value\)\)\}/g, (match) => {
    return match.replace('Number(e.target.value)', 'e.target.value');
  });
  
  // Also handle (e) syntax
  content = content.replace(/onChange=\{\(e\)\s*=>\s*set\w+\(Number\(e\.target\.value\)\)\}/g, (match) => {
    return match.replace('Number(e.target.value)', 'e.target.value');
  });

  // 3. Ensure the math logic (useMemo or const) handles these strings
  // Find instances of Number(state) inside calculations and ensure they handle empty/invalid strings
  // Actually, usually parseFloat() or Number() on a string is fine, but we'll double check common ones.
  // We want to change Number(val) to (parseFloat(val) || 0)
  content = content.replace(/const\s+\w+\s*=\s*Number\((\w+)\)/g, (match, varName) => {
    // avoid replacing standard state setters if any
    return `const ${match.split(' ')[1]} = parseFloat(${varName}) || 0`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    refactoredFiles++;
  }
});

console.log(`Refactored ${refactoredFiles} calculator files for better input behavior.`);
