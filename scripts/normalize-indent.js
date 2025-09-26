const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const exts = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json', '.md', '.html', '.svg'];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
	const full = path.join(dir, file);
	const stat = fs.statSync(full);
	if (stat.isDirectory()) {
	  if (file === 'node_modules' || file === '.git') continue;
	  walk(full);
	} else {
	  if (!exts.includes(path.extname(full))) continue;
	  const content = fs.readFileSync(full, 'utf8');
	  const newContent = content.replace(/^((?: {4})+)/gm, (m) => '\t'.repeat(m.length / 4));
	  if (newContent !== content) {
		fs.writeFileSync(full, newContent, 'utf8');
		console.log('Updated', full);
	  }
	}
  }
}

walk(root);
console.log('Done');
