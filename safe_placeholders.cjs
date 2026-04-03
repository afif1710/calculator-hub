const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'calculators');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let updatedFiles = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  let lines = content.split('\n');
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    // Only process lines with <input that DO NOT have placeholder and DO NOT have type="checkbox" or type="radio"
    if (lines[i].includes('<input ') && !lines[i].includes('placeholder=') && !lines[i].includes('type="checkbox"') && !lines[i].includes('type="radio"') && !lines[i].includes('type="range"')) {
      
      // Look at the previous couple of lines for context from the label/span
      let context = lines.slice(Math.max(0, i-4), i+1).join(' ').toLowerCase();
      
      let ph = '0.00';
      if (context.includes('%') || context.includes('rate') || context.includes('margin') || context.includes('return') || context.includes('interest')) {
        ph = 'e.g. 5.5';
      } else if (context.includes('year') || context.includes('month') || context.includes('time') || context.includes('age') || context.includes('period') || context.includes('hour') || context.includes('week') || context.includes('day') || context.includes('frequency')) {
        ph = 'e.g. 12';
      } else if (context.includes('amount') || context.includes('price') || context.includes('cost') || context.includes('salary') || context.includes('value') || context.includes('deposit') || context.includes('revenue') || context.includes('budget') || context.includes('bill') || context.includes('principal') || context.includes('goal') || context.includes('loan') || context.includes('payment') || context.includes('expense') || context.includes('income')) {
        ph = 'e.g. 5000';
      } else if (context.includes('weight') || context.includes('height') || context.includes('distance')) {
        ph = 'e.g. 70';
      } else if (context.includes('name') || context.includes('title')) {
        ph = 'e.g. Groceries';
      } else if (context.includes('url') || context.includes('link')) {
        ph = 'https://example.com';
      } else {
        ph = 'Enter value...';
      }

      // Safely insert placeholder attribute immediately after '<input '
      lines[i] = lines[i].replace('<input ', `<input placeholder="${ph}" `);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    updatedFiles++;
  }
});

console.log(`Successfully added contextual placeholders to ${updatedFiles} files safely.`);
