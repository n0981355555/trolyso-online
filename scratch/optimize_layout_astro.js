import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/layouts/Layout.astro');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to find indices safely
const normalized = content.replace(/\r\n/g, '\n');

const startMarker = '        const searchIndex = [';
const endMarker = '/* DYNAMIC_COMMUNES_END */\n        ];';

const startIndex = normalized.indexOf(startMarker);
const endIndex = normalized.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("❌ Could not find start or end markers in Layout.astro!");
  process.exit(1);
}

// Map back to original line endings index
// Since we want to slice the original content, we find the exact text using regex or split.
// A simpler way: split by startMarker, split the second part by endMarker.
const parts = content.split(startMarker);
if (parts.length < 2) {
  console.error("❌ Could not find startMarker!");
  process.exit(1);
}

const before = parts[0];
const rest = parts.slice(1).join(startMarker);

// Find end marker (either with \r\n or \n)
let endSplit = rest.split('/* DYNAMIC_COMMUNES_END */\r\n        ];');
if (endSplit.length < 2) {
  endSplit = rest.split('/* DYNAMIC_COMMUNES_END */\n        ];');
}

if (endSplit.length < 2) {
  console.error("❌ Could not find endMarker!");
  process.exit(1);
}

const after = endSplit.slice(1).join('/* DYNAMIC_COMMUNES_END */\n        ];'); // Join back if there were duplicates

const replacement = `      let searchIndex = null;
      let isFetchingSearchIndex = false;

      async function loadSearchIndex() {
        if (searchIndex || isFetchingSearchIndex) return;
        isFetchingSearchIndex = true;
        try {
          const res = await fetch('/search-index.json');
          if (res.ok) {
            searchIndex = await res.json();
          } else {
            console.error('Failed to fetch search-index.json');
            searchIndex = [];
          }
        } catch (err) {
          console.error('Error loading search index:', err);
          searchIndex = [];
        } finally {
          isFetchingSearchIndex = false;
        }
      }

      searchInput?.addEventListener('focus', loadSearchIndex);
      searchInput?.addEventListener('mouseenter', loadSearchIndex);`;

content = before + replacement + after;

// Replace searchInput input event listener to support async loading
const inputListenerRegex = /searchInput\?\.addEventListener\('input',\s*\(\)\s*=>\s*\{/;
const match = content.match(inputListenerRegex);
if (!match) {
  console.error("❌ Could not find searchInput input event listener!");
  process.exit(1);
}

content = content.replace(
  inputListenerRegex,
  `searchInput?.addEventListener('input', async () => {
        if (!searchIndex) {
          await loadSearchIndex();
        }
        if (!searchIndex) return;`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("🎉 Layout.astro optimized successfully!");
