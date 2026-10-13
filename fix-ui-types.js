const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(uiDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace destructured props with an explicit 'any' type to prevent TS from inferring them as required
  // We look for patterns like:
  // function Button({
  //   className,
  //   ...props
  // }) {
  // And replace with:
  // function Button({
  //   className,
  //   ...props
  // }: any) {
  
  const newContent = content.replace(/(function\s+[A-Za-z0-9_]+\s*\(\s*\{[^}]*\}\s*)(\)\s*\{)/g, '$1: any$2');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Patched ${file}`);
  }
}
