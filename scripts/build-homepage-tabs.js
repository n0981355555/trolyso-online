import fs from 'fs';
import path from 'path';

const indexPath = 'c:/Users/JUNE/Desktop/trolyso-online/src/pages/index.astro';

// Category mappings
const categoryMap = {
  'tinh-bhxh-1-lan': 'insurance',
  'tinh-thue-tncn': 'finance',
  'tinh-luong-huu': 'insurance',
  'tinh-tien-cham-nop-thue': 'finance',
  'tao-ma-qr': 'dev',
  'doc-so-thanh-chu': 'utility',
  'tinh-lai-suat': 'finance',
  'tinh-thue-vat': 'finance',
  'dem-ky-tu-online': 'office',
  'chu-ky-email': 'office',
  'nen-anh': 'office',
  'tao-van-ban': 'office',
  'tao-anh-ai': 'utility',
  'tinh-bmi': 'utility',
  'giai-phuong-trinh': 'utility',
  'dem-ngay-yeu-nhau': 'utility',
  'lich-van-nien': 'utility',
  'speedtest': 'utility',
  'gop-pdf': 'office',
  'pdf-sang-word': 'office',
  'word-sang-pdf': 'office',
  'tra-cuu-mst': 'finance',
  'tao-cv': 'office',
  'xem-tarot': 'utility',
  'lich-cat-dien': 'utility',
  'tinh-che-do-thai-san': 'insurance',
  'tinh-diem-hoa-von': 'finance',
  'regex-explainer': 'dev'
};

async function run() {
  let content = fs.readFileSync(indexPath, 'utf8');

  // Find where the 23rd card (Lãi suất clone) starts
  const cutStartIdx = content.indexOf('<!-- 23. Máy Tính Lãi Suất Ngân Hàng -->');
  if (cutStartIdx === -1) {
    throw new Error("Could not find cloned cards section");
  }

  // Find where the View More Button starts
  const viewMoreBtnIdx = content.indexOf('<!-- View More Button -->');
  if (viewMoreBtnIdx === -1) {
    throw new Error("Could not find View More Button");
  }

  // We want to find the closing tags of the grid and the container.
  // The structure is:
  //         </div>
  //       </div>
  //
  //       <!-- View More Button -->
  // Let's find the closing tag index by slicing from the last </div> before View More Button
  const cutEndIdx = content.lastIndexOf('</div>', viewMoreBtnIdx);
  if (cutEndIdx === -1) {
    throw new Error("Could not find ending div tag");
  }

  // Let's find the second to last </div> (which closes the grid)
  const cutEndGridIdx = content.lastIndexOf('</div>', cutEndIdx - 1);
  if (cutEndGridIdx === -1) {
    throw new Error("Could not find grid closing div tag");
  }

  const replacementCards = `<!-- 26. Tính Chế Độ Thai Sản Card -->
          <a href="/calculators/tinh-che-do-thai-san/" class="group p-6 bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-brand-mint flex items-center justify-center font-bold mb-4">
                🤰
              </div>
              <h4 class="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-brand-mint transition mb-2">
                Tính Chế Độ Thai Sản
              </h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Tính thời gian nghỉ phép và tiền trợ cấp thai sản nhận từ BHXH cho cả bố và mẹ chuẩn luật mới.
              </p>
            </div>
            <div class="text-xs text-brand-blue dark:text-brand-mint font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Mở công cụ <span>→</span>
            </div>
          </a>

          <!-- 27. Tính Điểm Hòa Vốn Card -->
          <a href="/calculators/tinh-diem-hoa-von/" class="group p-6 bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-500 flex items-center justify-center font-bold mb-4">
                📈
              </div>
              <h4 class="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-brand-mint transition mb-2">
                Tính Điểm Hòa Vốn Kinh Doanh
              </h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Tính sản lượng và doanh số bán hàng tối thiểu để bắt đầu có lãi cho quán cafe, cửa hàng FnB.
              </p>
            </div>
            <div class="text-xs text-brand-blue dark:text-brand-mint font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Mở công cụ <span>→</span>
            </div>
          </a>

          <!-- 28. Regex Explainer Card -->
          <a href="/calculators/regex-explainer/" class="group p-6 bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-brand-blue flex items-center justify-center font-bold mb-4">
                💻
              </div>
              <h4 class="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-brand-mint transition mb-2">
                Regex Explainer Tiếng Việt
              </h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Giải nghĩa biểu thức chính quy (Regex) và kiểm tra so khớp chuỗi văn bản theo thời gian thực.
              </p>
            </div>
            <div class="text-xs text-brand-blue dark:text-brand-mint font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Mở công cụ <span>→</span>
            </div>
          </a>
`;

  // Slice content and replace
  // We want to keep the closing divs of grid and expandedTools container:
  // cutEndGridIdx is the position of "</div>" closing the grid.
  // We want to keep everything from cutEndGridIdx to the end of the file!
  content = content.slice(0, cutStartIdx) + replacementCards + content.slice(cutEndGridIdx);

  // Add data-category attributes to all the anchor tags in the file
  for (const [slug, cat] of Object.entries(categoryMap)) {
    const targetString = `href="/calculators/${slug}/" class="group`;
    const replacementString = `href="/calculators/${slug}/" data-category="${cat}" class="group`;
    content = content.replace(new RegExp(targetString, 'g'), replacementString);
  }

  // Insert Category tabs under `<div id="calculators">`
  const targetHeader = `<div id="calculators">\n      <h3 class="text-xl font-heading font-bold text-slate-900 dark:text-white mb-6">Các công cụ tiện ích khác:</h3>`;
  const replacementHeader = `<div id="calculators">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <h3 class="text-xl font-heading font-bold text-slate-900 dark:text-white m-0">Các công cụ tiện ích khác:</h3>
        <!-- Category Filter Tabs (TinyWow style) -->
        <div class="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button class="calc-tab-btn px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 bg-white dark:bg-brand-darkCard text-slate-900 dark:text-white shadow-sm" data-category="all" aria-label="Tất cả công cụ">✨ Tất cả</button>
          <button class="calc-tab-btn px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" data-category="finance" aria-label="Công cụ tài chính và thuế">💰 Tài chính & Thuế</button>
          <button class="calc-tab-btn px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" data-category="insurance" aria-label="Công cụ bảo hiểm và lương">🛡️ Bảo hiểm & Lương</button>
          <button class="calc-tab-btn px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" data-category="office" aria-label="Công cụ văn phòng và PDF">📂 Văn phòng & PDF</button>
          <button class="calc-tab-btn px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" data-category="utility" aria-label="Công cụ tiện ích và học tập">🌐 Tiện ích & Học tập</button>
          <button class="calc-tab-btn px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" data-category="dev" aria-label="Công cụ lập trình viên">💻 Lập trình</button>
        </div>
      </div>`;

  content = content.replace(targetHeader, replacementHeader);

  // Insert Filtering script at the end of the script tag (before </script>)
  const scriptClosingIdx = content.lastIndexOf('</script>');
  if (scriptClosingIdx === -1) {
    throw new Error("Could not find script closing tag");
  }

  const filteringScript = `
  // Category Filtering Logic (TinyWow Style)
  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const allCards = document.querySelectorAll('#calculators [data-category], #expandedTools [data-category]');

  function filterTools(category: string) {
    // Update tab active styling
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-category') === category) {
        btn.className = "calc-tab-btn px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 bg-white dark:bg-brand-darkCard text-slate-900 dark:text-white shadow-sm";
      } else {
        btn.className = "calc-tab-btn px-3 py-1.5 text-xs font-bold rounded-xl transition duration-200 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200";
      }
    });

    if (category === 'all') {
      // Restore default layout (first 9 visible, rest hidden, show the Toggle button)
      toggleTools(false);
      btnToggleTools?.classList.remove('hidden');
      
      allCards.forEach((card, idx) => {
        const parentGrid = card.parentElement?.parentElement;
        if (parentGrid && parentGrid.id === 'expandedTools') {
          card.classList.add('hidden');
        } else {
          card.classList.remove('hidden');
        }
      });
    } else {
      // Specific category: show all matches, hide toggle button, force expand container open
      btnToggleTools?.classList.add('hidden');
      expandedTools?.classList.remove('hidden');
      
      allCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (cat === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category') || 'all';
      filterTools(cat);
    });
  });
`;

  content = content.slice(0, scriptClosingIdx) + filteringScript + content.slice(scriptClosingIdx);

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log("Successfully rebuilt homepage with tinywow style categories and added 3 new calculators!");
}

run().catch(console.error);
