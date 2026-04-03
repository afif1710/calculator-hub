const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'calculators');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let updatedFiles = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // We will split the file by <input, but it's easier to use a replacer function
  // We want to add placeholder="e.g. X" if placeholder doesn't exist
  
  content = content.replace(/(<label[^>]*>.*?<\/label>\s*)?<input([^>]*?)>/gs, (match, labelHtml, inputAttrs) => {
    if (inputAttrs.includes('placeholder=')) {
      return match; // Already has it
    }
    
    // Ignore non-text/number inputs just in case, though most are number
    if (inputAttrs.includes('type="checkbox"') || inputAttrs.includes('type="radio"')) {
      return match;
    }

    let placeholder = '0.00';
    let label = labelHtml ? labelHtml.toLowerCase() : '';
    
    if (label.includes('%') || label.includes('rate') || label.includes('margin')) {
      placeholder = 'e.g. 5.5';
    } else if (label.includes('year') || label.includes('month') || label.includes('time') || label.includes('age') || label.includes('period')) {
      placeholder = 'e.g. 12';
    } else if (label.includes('amount') || label.includes('price') || label.includes('cost') || label.includes('salary') || label.includes('value') || label.includes('deposit') || label.includes('revenue')) {
      placeholder = 'e.g. 5000';
    } else if (label.includes('name') || label.includes('title')) {
      placeholder = 'e.g. Groceries';
    } else {
      placeholder = 'Enter value...';
    }

    // if the input had a self closing tag '/>' at the end of inputAttrs, remove it and add it back
    let newAttrs = inputAttrs;
    if (newAttrs.endsWith('/>')) {
      newAttrs = newAttrs.slice(0, -2) + ` placeholder="${placeholder}" />`;
    } else {
      newAttrs = newAttrs + ` placeholder="${placeholder}"`;
    }

    return (labelHtml || '') + '<input' + newAttrs + '>';
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedFiles++;
  }
});

console.log(`Updated ${updatedFiles} calculator files with placeholders.`);
