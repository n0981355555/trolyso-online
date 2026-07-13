import fs from 'fs';

const indexPath = 'c:/Users/JUNE/Desktop/trolyso-online/src/pages/index.astro';

function run() {
  let content = fs.readFileSync(indexPath, 'utf8');

  // 1. Give the first grid container the ID id="calculators-grid"
  // Let's locate the first grid container after calculators header
  const gridStartTarget = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">`;
  const gridStartPos = content.indexOf(gridStartTarget);
  if (gridStartPos === -1) {
    throw new Error("Could not find first grid container tag");
  }

  // Replace only the first occurrence
  content = content.slice(0, gridStartPos) + `<div id="calculators-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">` + content.slice(gridStartPos + gridStartTarget.length);

  // 2. Remove the middle split tags at lines 292-296
  // The split markup looks like:
  //         </a>
  //       </div>
  // 
  //       <!-- Expandable section (Xem thêm) -->
  //       <div id="expandedTools" class="hidden mt-6 animate-fade-in">
  //         <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  // Let's locate this split using a robust substring search
  const splitSearch = `        </a>
      </div>

      <!-- Expandable section (Xem thêm) -->
      <div id="expandedTools" class="hidden mt-6 animate-fade-in">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">`;

  const splitPos = content.indexOf(splitSearch);
  if (splitPos === -1) {
    // Let's try matching with slightly different whitespace
    throw new Error("Could not find middle split container markup");
  }

  // We replace it by keeping the </a> but removing the grid closing/opening tags,
  // making it continuous:
  content = content.slice(0, splitPos) + `        </a>` + content.slice(splitPos + splitSearch.length);

  // 3. Remove the nested wrapper closing tags at line 638-639
  // The closing markup at the end of the cards grid is:
  //           </a>
  // </div>
  //       </div>
  // 
  //       <!-- View More Button -->
  // Let's locate:
  const endSearch = `          </a>
</div>
      </div>

      <!-- View More Button -->`;

  const endPos = content.indexOf(endSearch);
  if (endPos === -1) {
    throw new Error("Could not find grid closing tags at the bottom");
  }

  // We replace it by keeping the </a> and closing only ONE div (the single #calculators-grid):
  content = content.slice(0, endPos) + `          </a>
      </div>

      <!-- View More Button -->` + content.slice(endPos + endSearch.length);

  // 4. Replace the old JS logic at the bottom of index.astro
  const oldJsStart = `  // Directory expander toggle logic`;
  const oldJsStartPos = content.indexOf(oldJsStart);
  if (oldJsStartPos === -1) {
    throw new Error("Could not find old JS start");
  }

  const oldJsEnd = `  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category') || 'all';
      filterTools(cat);
    });
  });`;
  const oldJsEndPos = content.indexOf(oldJsEnd);
  if (oldJsEndPos === -1) {
    throw new Error("Could not find old JS end");
  }

  const newJsCode = `  // Directory expander & Category filtering logic (TinyWow style)
  const btnToggleTools = document.getElementById('btnToggleTools');
  const btnToggleText = document.getElementById('btnToggleText');
  const btnToggleIcon = document.getElementById('btnToggleIcon');
  const allCards = document.querySelectorAll('#calculators-grid [data-category]');

  let isExpanded = false;
  let currentCategory = 'all';

  function updateVisibleTools() {
    if (currentCategory === 'all') {
      btnToggleTools?.classList.remove('hidden');
      
      allCards.forEach((card, idx) => {
        if (isExpanded) {
          card.classList.remove('hidden');
        } else {
          // Show only first 9 cards (indices 0 to 8)
          if (idx < 9) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });

      if (btnToggleText) btnToggleText.innerText = isExpanded ? "Thu gọn bớt" : "Xem thêm công cụ";
      if (btnToggleIcon) btnToggleIcon.innerText = isExpanded ? "↑" : "↓";
    } else {
      // Specific category: show all matching cards from the single grid, hide the toggle button
      btnToggleTools?.classList.add('hidden');
      
      allCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (cat === currentCategory) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    }
  }

  btnToggleTools?.addEventListener('click', () => {
    isExpanded = !isExpanded;
    updateVisibleTools();
  });

  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category') || 'all';
      currentCategory = cat;
      isExpanded = false; // Reset expand state when switching category
      updateVisibleTools();

      // Update tab active styling
      tabBtns.forEach(b => {
        if (b.getAttribute('data-category') === cat) {
          b.className = "calc-tab-btn px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 bg-white dark:bg-brand-darkCard text-slate-900 dark:text-white shadow-sm";
        } else {
          b.className = "calc-tab-btn px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200";
        }
      });
    });
  });

  // Handle hash routing to expand tools list and scroll
  function checkHash() {
    if (window.location.hash === '#calculators') {
      isExpanded = true;
      currentCategory = 'all';
      updateVisibleTools();
      setTimeout(() => {
        const target = document.getElementById('calculators');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  // Check on load and hash change
  window.addEventListener('load', () => {
    updateVisibleTools();
    checkHash();
  });
  window.addEventListener('hashchange', checkHash);`;

  content = content.slice(0, oldJsStartPos) + newJsCode + content.slice(oldJsEndPos + oldJsEnd.length);

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log("Successfully merged grids into a single container and updated filtering logic!");
}

run();
