const fs = require('fs');
const path = require('path');

function patchTextFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [searchValue, replaceValue] of replacements) {
    if (content.includes(searchValue)) {
      content = content.replace(searchValue, replaceValue);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  return changed;
}

function writeTextFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

try {
  const expoFontTsconfig = path.join(__dirname, '..', 'node_modules', 'expo-font', 'tsconfig.json');
  if (writeTextFile(expoFontTsconfig, `{
  "compilerOptions": {
    "outDir": "./build",
    "rootDir": "./src",
    "ignoreDeprecations": "6.0",
    "skipLibCheck": true
  },
  "include": ["./src"],
  "exclude": ["**/__mocks__/*", "**/__tests__/*", "**/__rsc_tests__/*"]
}
`)) {
    console.log('patch-metro: patched expo-font tsconfig.json.');
  }

  const metroPkg = path.join(__dirname, '..', 'node_modules', 'metro', 'package.json');
  if (!fs.existsSync(metroPkg)) {
    console.log('patch-metro: metro package.json not found, skipping.');
    process.exit(0);
  }

  const raw = fs.readFileSync(metroPkg, 'utf8');
  const pkg = JSON.parse(raw);
  pkg.exports = pkg.exports || {};

  let changed = false;

  if (!pkg.exports['./src/lib/TerminalReporter']) {
    pkg.exports['./src/lib/TerminalReporter'] = './src/lib/TerminalReporter.js';
    changed = true;
  }
  if (!pkg.exports['./src/lib/*']) {
    pkg.exports['./src/lib/*'] = './src/lib/*.js';
    changed = true;
  }
  if (!pkg.exports['./src/HmrServer']) {
    pkg.exports['./src/HmrServer'] = './src/HmrServer.js';
    changed = true;
  }
  if (!pkg.exports['./src/*']) {
    pkg.exports['./src/*'] = './src/*.js';
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(metroPkg, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log('patch-metro: patched metro package.json exports.');
  } else {
    console.log('patch-metro: metro package.json already contains exports.');
  }
} catch (err) {
  console.error('patch-metro: failed', err);
  process.exit(1);
}
