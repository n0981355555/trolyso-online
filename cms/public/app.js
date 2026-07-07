// CMS APP client logic
let editor = null;
let currentPostId = null;
let activeTargetInputId = null; // Used for media modal callbacks
let visitorsChart = null;

// Global block image callback state
let currentBlockCallback = null;

function openMediaModalForBlock(callback) {
  currentBlockCallback = callback;
  openMediaModal('blockImageCallback');
}

class AstroImage {
  static get toolbox() {
    return {
      title: 'Chèn ảnh SEO',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`
    };
  }

  constructor({data, api}) {
    this.data = {
      url: data.url || '',
      alt: data.alt || '',
      caption: data.caption || ''
    };
    this.api = api;
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('p-5', 'bg-slate-800', 'border', 'border-slate-700', 'rounded-2xl', 'space-y-4', 'my-4');
    
    this.wrapper.innerHTML = `
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
        <span class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">🖼️ Hình ảnh bài viết (SEO)</span>
        <button type="button" class="text-xs font-bold text-red-400 hover:text-red-300 transition" onclick="this.closest('.ce-block').remove()">Xóa khối ảnh</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 space-y-3">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Đường dẫn ảnh</label>
            <div class="flex gap-2">
              <input type="text" placeholder="/images/blog/..." class="img-url w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500" value="${this.data.url}">
              <button type="button" class="btn-select-img px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold transition">Chọn ảnh</button>
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Thẻ Alt mô tả (không dấu)</label>
            <input type="text" placeholder="alt-mo-ta-anh" class="img-alt w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500" value="${this.data.alt}">
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chú thích hình ảnh (Caption)</label>
            <input type="text" placeholder="Mô tả nội dung hình vẽ..." class="img-caption w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500" value="${this.data.caption}">
          </div>
        </div>
        <div class="border border-slate-700 rounded-2xl bg-slate-950 flex items-center justify-center min-h-[140px] overflow-hidden p-2 relative">
          <img class="img-preview max-w-full max-h-[120px] object-contain rounded-lg" src="${this.data.url || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}">
        </div>
      </div>
    `;

    const selectBtn = this.wrapper.querySelector('.btn-select-img');
    const urlInput = this.wrapper.querySelector('.img-url');
    const altInput = this.wrapper.querySelector('.img-alt');
    const captionInput = this.wrapper.querySelector('.img-caption');
    const previewImg = this.wrapper.querySelector('.img-preview');

    selectBtn.addEventListener('click', () => {
      openMediaModalForBlock((url) => {
        urlInput.value = url;
        previewImg.src = url;
        this.data.url = url;

        // Auto generate alt from filename
        const filename = url.split('/').pop().split('.').shift();
        altInput.value = filename;
        this.data.alt = filename;
        runSeoAudit();
      });
    });

    urlInput.addEventListener('input', (e) => {
      this.data.url = e.target.value;
      previewImg.src = e.target.value || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      runSeoAudit();
    });

    altInput.addEventListener('input', (e) => {
      this.data.alt = e.target.value;
      runSeoAudit();
    });

    captionInput.addEventListener('input', (e) => {
      this.data.caption = e.target.value;
      runSeoAudit();
    });

    return this.wrapper;
  }

  save(blockContent) {
    const url = blockContent.querySelector('.img-url').value;
    const alt = blockContent.querySelector('.img-alt').value;
    const caption = blockContent.querySelector('.img-caption').value;
    return {
      url,
      alt,
      caption
    };
  }
}


// Global state variables
let posts = [];
let categories = [];
let tags = [];

// API Fetch Helper with automatic Bearer Token injection and refresh handling
async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  if (!token && !url.includes('/auth/login')) {
    window.location.href = '/login.html';
    return null;
  }

  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  try {
    let response = await fetch(url, options);
    
    // Auto-refresh token if expired (403/401)
    if ((response.status === 401 || response.status === 403) && !url.includes('/auth/login')) {
      console.log('🔄 Access token expired. Attempting token refresh...');
      const refreshSuccess = await handleTokenRefresh();
      if (refreshSuccess) {
        // Retry request with new token
        options.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        response = await fetch(url, options);
      } else {
        localStorage.clear();
        window.location.href = '/login.html';
        return null;
      }
    }
    
    return response;
  } catch (error) {
    console.error('API Fetch Error:', error);
    alert('Không thể kết nối đến máy chủ API.');
    return null;
  }
}

async function handleTokenRefresh() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;
  
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken })
    });
    
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      return true;
    }
  } catch(e) {}
  return false;
}

// Session Logouts
async function handleLogout() {
  const token = localStorage.getItem('refreshToken');
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  localStorage.clear();
  window.location.href = '/login.html';
}

// Page Routing & Navigation
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('#contentViewport > section').forEach(sec => sec.classList.add('hidden'));
  // Show target section
  const targetSec = document.getElementById(`sec-${sectionName}`);
  if (targetSec) targetSec.classList.remove('hidden');

  // Update Title Header
  const titles = {
    dashboard: 'Tổng quan hệ thống',
    posts: 'Quản lý bài viết',
    editor: 'Soạn thảo bài viết',
    media: 'Thư viện ảnh tối ưu',
    categories: 'Chuyên mục & Thẻ',
    users: 'Thành viên quản trị'
  };
  document.getElementById('sectionTitle').innerText = titles[sectionName] || 'CMS Admin';

  // Toggle active styling on navigation items
  document.querySelectorAll('aside nav a').forEach(nav => {
    nav.classList.remove('bg-slate-900', 'text-white');
    nav.classList.add('text-slate-300');
  });
  const activeNav = document.getElementById(`nav-${sectionName}`);
  if (activeNav) {
    activeNav.classList.remove('text-slate-300');
    activeNav.classList.add('bg-slate-900', 'text-white');
  }

  // Load section-specific data
  if (sectionName === 'dashboard') loadDashboardData();
  if (sectionName === 'posts') loadPosts();
  if (sectionName === 'media') loadMedia();
  if (sectionName === 'categories') loadCategoriesAndTags();
  if (sectionName === 'users') loadUsers();
}

// ==========================================
// 1. DASHBOARD CONTROLLER
// ==========================================
async function loadDashboardData() {
  const res = await apiFetch('/api/dashboard/stats');
  if (!res) return;
  const data = await res.json();

  // Update counters
  document.getElementById('stat-total-posts').innerText = data.counts.total;
  document.getElementById('stat-pub-posts').innerText = data.counts.published;
  document.getElementById('stat-draft-posts').innerText = data.counts.drafts;
  document.getElementById('stat-trash-posts').innerText = data.counts.trash;
  
  // Total GA4 PageViews
  document.getElementById('ga4-views-total').innerText = Number(data.analytics.overview.totalViews).toLocaleString('vi-VN');

  // Load GSC search queries table
  const tbody = document.getElementById('gsc-keywords-body');
  tbody.innerHTML = '';
  if (data.analytics.topKeywords.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="py-4 text-center text-slate-500">Chưa có dữ liệu từ khóa</td></tr>';
  } else {
    data.analytics.topKeywords.forEach(row => {
      tbody.innerHTML += `
        <tr class="border-b border-slate-800/40 hover:bg-slate-800/20">
          <td class="py-3 font-medium text-white">${row.keyword}</td>
          <td class="py-3 text-right text-green-400 font-bold">${row.clicks}</td>
          <td class="py-3 text-right text-slate-400">${row.position}</td>
        </tr>
      `;
    });
  }

  // Build GA4 Views Chart (using ChartJS)
  const ctx = document.getElementById('visitorsChart').getContext('2d');
  if (visitorsChart) visitorsChart.destroy();
  
  const chartDates = data.analytics.chartData.map(h => {
    // Format YYYYMMDD to DD/MM
    if (h.date.length === 8) {
      return `${h.date.slice(6, 8)}/${h.date.slice(4, 6)}`;
    }
    return h.date;
  });
  
  const chartViews = data.analytics.chartData.map(h => h.views);
  const chartUsers = data.analytics.chartData.map(h => h.users);

  visitorsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartDates,
      datasets: [
        {
          label: 'Lượt xem trang (Pageviews)',
          data: chartViews,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          fill: true,
          tension: 0.35,
          borderWidth: 2
        },
        {
          label: 'Người dùng (Active Users)',
          data: chartUsers,
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.35,
          borderWidth: 1.5,
          borderDash: [4, 4]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(51, 65, 85, 0.2)' }, ticks: { color: '#64748b', font: { size: 10 } } },
        y: { grid: { color: 'rgba(51, 65, 85, 0.2)' }, ticks: { color: '#64748b', font: { size: 10 } } }
      }
    }
  });
}

// ==========================================
// 2. BLOG POSTS CONTROLLER
// ==========================================
async function loadPosts() {
  const res = await apiFetch('/api/posts');
  if (!res) return;
  posts = await res.json();
  
  document.getElementById('posts-count-badge').innerText = posts.length;
  filterPostsList();
}

function filterPostsList() {
  const query = document.getElementById('postSearchInput').value.toLowerCase();
  const status = document.getElementById('postFilterStatus').value;
  const tbody = document.getElementById('posts-table-body');
  tbody.innerHTML = '';

  const filtered = posts.filter(post => {
    const matchesQuery = post.title.toLowerCase().includes(query) || post.slug.toLowerCase().includes(query);
    const matchesStatus = status === 'ALL' || post.status === status;
    return matchesQuery && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-12 text-center text-slate-500 italic">Không tìm thấy bài viết nào tương ứng</td></tr>`;
    return;
  }

  filtered.forEach(post => {
    const date = post.publishDate ? new Date(post.publishDate).toLocaleDateString('vi-VN') : '—';
    const statusBadges = {
      PUBLISHED: '<span class="px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full">Đã xuất bản</span>',
      DRAFT: '<span class="px-2.5 py-0.5 bg-slate-500/10 border border-slate-500/20 text-slate-400 text-xs font-bold rounded-full">Bản nháp</span>',
      SCHEDULED: '<span class="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full">Đặt lịch</span>',
      TRASH: '<span class="px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-full">Thùng rác</span>'
    };

    let actions = '';
    if (post.status === 'TRASH') {
      actions = `
        <button onclick="handleRestorePost('${post.id}')" class="text-xs font-bold px-2 py-1 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition">Khôi phục</button>
        <button onclick="handleDeletePost('${post.id}')" class="text-xs font-bold px-2 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition">Xóa vĩnh viễn</button>
      `;
    } else {
      actions = `
        <button onclick="openEditor('${post.id}')" class="text-xs font-bold px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">Sửa</button>
        <button onclick="handleDuplicatePost('${post.id}')" class="text-xs font-bold px-2 py-1 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition">Bản sao</button>
        <button onclick="handleDeletePost('${post.id}')" class="text-xs font-bold px-2 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition">Xóa</button>
      `;
    }

    tbody.innerHTML += `
      <tr class="border-b border-slate-700/40 hover:bg-slate-800/30 transition">
        <td class="px-6 py-4">
          <div class="font-bold text-white max-w-sm truncate">${post.title}</div>
          <div class="text-xs text-slate-500 mt-1 truncate">/blog/${post.slug}/</div>
        </td>
        <td class="px-6 py-4 text-slate-400 font-medium">${post.category?.name || 'Cẩm nang'}</td>
        <td class="px-6 py-4 text-slate-400 font-medium">${post.author?.name || 'Admin'}</td>
        <td class="px-6 py-4 text-slate-400 text-xs">${new Date(post.updatedAt).toLocaleDateString('vi-VN')}</td>
        <td class="px-6 py-4">${statusBadges[post.status] || post.status}</td>
        <td class="px-6 py-4 text-right space-x-1.5">${actions}</td>
      </tr>
    `;
  });
}

// Duplicate logic
async function handleDuplicatePost(id) {
  const res = await apiFetch(`/api/posts/${id}/duplicate`, { method: 'POST' });
  if (res && res.ok) {
    alert('Đã nhân bản bài viết thành công!');
    loadPosts();
  }
}

// Delete / Trash Logic
async function handleDeletePost(id) {
  if (!confirm('Bạn có chắc chắn muốn thực hiện hành động xóa này không?')) return;
  const res = await apiFetch(`/api/posts/${id}`, { method: 'DELETE' });
  if (res && res.ok) {
    loadPosts();
  }
}

// Restore Trash Post
async function handleRestorePost(id) {
  const res = await apiFetch(`/api/posts/${id}/restore`, { method: 'POST' });
  if (res && res.ok) {
    loadPosts();
  }
}

// ==========================================
// 3. SOẠN THẢO BÀI VIẾT (EDITORJS & SEO MODULE)
// ==========================================
// Global related posts link state
let currentRelatedPosts = [];

function renderRelatedPostsList() {
  const container = document.getElementById('relatedPostsListContainer');
  container.innerHTML = '';
  
  currentRelatedPosts.forEach((rel, idx) => {
    container.innerHTML += `
      <div class="flex items-center justify-between p-3 bg-slate-900 border border-slate-700/60 rounded-2xl shadow-sm">
        <div class="truncate max-w-[80%] pr-2">
          <p class="text-xs font-bold text-white truncate">${rel.title}</p>
          <span class="text-[10px] text-slate-500">/blog/${rel.slug}/ | ${rel.category}</span>
        </div>
        <button type="button" onclick="removeRelatedPostLink(${idx})" class="text-xs font-bold text-red-400 hover:text-red-300 transition px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-lg">Xóa</button>
      </div>
    `;
  });
  
  document.getElementById('postRelatedPosts').value = JSON.stringify(currentRelatedPosts);
}

function addRelatedPostLink() {
  const title = document.getElementById('addRelatedTitle').value.trim();
  const slug = document.getElementById('addRelatedSlug').value.trim();
  const category = document.getElementById('addRelatedCategory').value.trim() || 'Cẩm nang';
  
  if (!title || !slug) {
    alert('Vui lòng nhập đầy đủ Tiêu đề và Slug của liên kết');
    return;
  }
  
  currentRelatedPosts.push({ title, slug, category });
  renderRelatedPostsList();
  
  // Clear inputs
  document.getElementById('addRelatedTitle').value = '';
  document.getElementById('addRelatedSlug').value = '';
  document.getElementById('addRelatedCategory').value = '';
  
  runSeoAudit();
}

function removeRelatedPostLink(idx) {
  currentRelatedPosts.splice(idx, 1);
  renderRelatedPostsList();
  runSeoAudit();
}

async function loadCalculatorDropdown() {
  const res = await apiFetch('/api/calculators');
  if (!res) return;
  const list = await res.json();
  const select = document.getElementById('postCtaLink');
  
  // Guard values
  const currentVal = select.value;
  select.innerHTML = '<option value="">Không có CTA</option>';
  list.forEach(item => {
    select.innerHTML += `<option value="${item.url}">${item.name}</option>`;
  });
  select.value = currentVal;
}

async function openEditor(postId = null) {
  currentPostId = postId;
  showSection('editor');

  // Reset inputs
  document.getElementById('postTitle').value = '';
  document.getElementById('postSlug').value = '';
  document.getElementById('postEditorName').value = '';
  document.getElementById('postEditorTitle').value = '';
  document.getElementById('postOgImage').value = '';
  document.getElementById('postAltImage').value = '';
  document.getElementById('postCaption').value = '';
  document.getElementById('postCtaText').value = '';
  document.getElementById('postCtaLink').value = '';
  document.getElementById('postKeywords').value = '';
  document.getElementById('postDescription').value = '';
  document.getElementById('postReferences').value = '';
  document.getElementById('postRelatedPosts').value = '';
  document.getElementById('ogImagePreview').src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-10 w-10 text-slate-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";

  currentRelatedPosts = [];
  renderRelatedPostsList();

  // Pre-load dropdown list options dynamically
  await loadCategoryDropdown();
  await loadCalculatorDropdown();

  // Reset EditorJS
  if (editor) {
    await editor.isReady;
    editor.destroy();
    editor = null;
  }

  let editorData = { blocks: [] };

  if (postId) {
    document.getElementById('editorSectionTitle').innerText = 'Chỉnh sửa bài viết';
    // Fetch post details
    const res = await apiFetch(`/api/posts/${postId}`);
    if (!res) return;
    const post = await res.json();

    document.getElementById('postTitle').value = post.title;
    document.getElementById('postSlug').value = post.slug;
    document.getElementById('postEditorName').value = post.editorName || '';
    document.getElementById('postEditorTitle').value = post.editorTitle || '';
    document.getElementById('postOgImage').value = post.ogImage || '';
    document.getElementById('postAltImage').value = post.altImage || '';
    document.getElementById('postCaption').value = post.caption || '';
    document.getElementById('postCtaText').value = post.ctaText || '';
    document.getElementById('postCtaLink').value = post.ctaLink || '';
    document.getElementById('postKeywords').value = post.keywords || '';
    document.getElementById('postDescription').value = post.description || '';
    document.getElementById('postCategory').value = post.categoryId || '';
    
    if (post.references) {
      document.getElementById('postReferences').value = post.references;
    }

    if (post.relatedPosts) {
      try {
        currentRelatedPosts = JSON.parse(post.relatedPosts);
        renderRelatedPostsList();
      } catch(e) {}
    }
    
    if (post.ogImage) {
      document.getElementById('ogImagePreview').src = post.ogImage;
    }

    try {
      editorData = JSON.parse(post.content);
    } catch(e) {}

    // Load Revisions list
    renderRevisions(post.revisions);
  } else {
    document.getElementById('editorSectionTitle').innerText = 'Viết bài mới chuẩn SEO';
    document.getElementById('revisionsContainer').innerHTML = '<p class="text-slate-500 italic">Bài viết mới chưa có lịch sử lưu.</p>';
  }

  // Initialize EditorJS with custom configuration and dynamic tool checks
  const editorTools = {
    image: AstroImage
  };

  if (typeof Header !== 'undefined') editorTools.header = Header;
  if (typeof List !== 'undefined') {
    editorTools.list = {
      class: List,
      inlineToolbar: true
    };
  }
  if (typeof Table !== 'undefined') {
    editorTools.table = {
      class: Table,
      inlineToolbar: true
    };
  }
  if (typeof Quote !== 'undefined') {
    editorTools.quote = {
      class: Quote,
      inlineToolbar: true
    };
  }
  if (typeof Warning !== 'undefined') editorTools.warning = Warning;
  if (typeof Code !== 'undefined') editorTools.code = Code;

  editor = new EditorJS({
    holder: 'editorjs',
    data: editorData,
    tools: editorTools,
    placeholder: 'Bắt đầu viết nội dung bài viết của bạn tại đây... (Nhấn Tab hoặc nhấp chuột để chọn khối soạn thảo)',
    onChange: () => {
      // Trigger live SEO Audit after user stops typing
      debounce(runSeoAudit, 1000)();
    }
  });

  await editor.isReady;
  runSeoAudit();
}

// Auto slug generation from title
function handleTitleInput(val) {
  // Convert Vietnamese accented characters to plain text
  let slug = val.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  document.getElementById('postSlug').value = slug;
  runSeoAudit();
}

// Debounce helper to prevent heavy SEO score recalculations on every keystroke
let debounceTimer;
function debounce(func, delay) {
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}

// SEO Score analysis (RankMath-like audit)
async function runSeoAudit() {
  if (!editor) return;
  
  try {
    const content = await editor.save();
    const title = document.getElementById('postTitle').value;
    const slug = document.getElementById('postSlug').value;
    const description = document.getElementById('postDescription').value;
    const keywords = document.getElementById('postKeywords').value;
    const featuredImage = document.getElementById('postOgImage').value;
    const altImage = document.getElementById('postAltImage').value;
    const caption = document.getElementById('postCaption').value;

    const response = await apiFetch('/api/posts/check-seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, description, content, keywords, featuredImage, altImage, caption })
    });

    if (!response) return;
    const result = await response.json();

    // Update SEO Circle Progress & Score UI
    const score = result.score;
    const text = document.getElementById('seoScoreText');
    const circle = document.getElementById('seoCircleProgress');
    const verdict = document.getElementById('seoVerdict');
    
    text.innerText = score;
    
    // Circular progress dashoffset calculator: dasharray is 301.6
    const offset = 301.6 - (score / 100) * 301.6;
    circle.style.strokeDashoffset = offset;

    // Visual coloring based on score
    if (score >= 80) {
      circle.setAttribute('stroke', '#10b981'); // Green
      verdict.innerText = 'Đạt chuẩn SEO tuyệt vời!';
      verdict.className = 'text-xs font-semibold px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full inline-block';
    } else if (score >= 50) {
      circle.setAttribute('stroke', '#f59e0b'); // Amber
      verdict.innerText = 'Tạm ổn, cần tối ưu thêm';
      verdict.className = 'text-xs font-semibold px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full inline-block';
    } else {
      circle.setAttribute('stroke', '#ef4444'); // Red
      verdict.innerText = 'SEO quá thấp, cần sửa lỗi';
      verdict.className = 'text-xs font-semibold px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full inline-block';
    }

    // Load list checklist audit items
    const listContainer = document.getElementById('seoChecklistContainer');
    listContainer.innerHTML = '';
    
    result.checks.forEach(check => {
      const icons = {
        success: '✅',
        warning: '⚠️',
        danger: '❌'
      };
      const textColors = {
        success: 'text-slate-300',
        warning: 'text-amber-400 font-semibold',
        danger: 'text-red-400 font-bold'
      };
      
      listContainer.innerHTML += `
        <div class="flex items-start gap-2 py-1">
          <span>${icons[check.type] || '•'}</span>
          <span class="${textColors[check.type]}">${check.text}</span>
        </div>
      `;
    });
  } catch(e) {
    console.error('SEO audit error:', e);
  }
}

// Render revision history
function renderRevisions(revisions) {
  const container = document.getElementById('revisionsContainer');
  container.innerHTML = '';
  if (!revisions || revisions.length === 0) {
    container.innerHTML = '<p class="text-slate-500 italic">Không có lịch sử lưu.</p>';
    return;
  }

  revisions.forEach(rev => {
    const dateStr = new Date(rev.createdAt).toLocaleString('vi-VN');
    container.innerHTML += `
      <div class="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition">
        <div>
          <p class="font-semibold text-white">Bản lưu: ${dateStr}</p>
          <span class="text-[10px] text-slate-500">Bởi: ${rev.updatedBy?.name}</span>
        </div>
        <button type="button" onclick="handleRestoreRevision('${rev.id}')" class="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition font-bold text-[10px]">Khôi phục</button>
      </div>
    `;
  });
}

// Restore old revision logic
async function handleRestoreRevision(revisionId) {
  if (!confirm('Bạn có muốn khôi phục bài viết về phiên bản này không? Mọi nội dung hiện tại sẽ được ghi đè.')) return;
  
  const res = await apiFetch('/api/posts/restore-revision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ revisionId })
  });

  if (res && res.ok) {
    alert('Đã khôi phục phiên bản lịch sử thành công!');
    // Re-open current post with restored data
    openEditor(currentPostId);
  }
}

// Create/Update Post Submit
async function savePost(status = 'DRAFT') {
  if (!editor) return;

  const title = document.getElementById('postTitle').value;
  const slug = document.getElementById('postSlug').value;
  if (!title || !slug) {
    alert('Vui lòng nhập đầy đủ Tiêu đề và Slug bài viết');
    return;
  }

  const content = await editor.save();
  const description = document.getElementById('postDescription').value;
  const keywords = document.getElementById('postKeywords').value;
  const canonicalUrl = document.getElementById('postKeywords').value ? `/blog/${slug}/` : '';
  const ogTitle = title;
  const ogDescription = description;
  const ogImage = document.getElementById('postOgImage').value;
  const altImage = document.getElementById('postAltImage').value;
  const caption = document.getElementById('postCaption').value;
  const editorName = document.getElementById('postEditorName').value;
  const editorTitle = document.getElementById('postEditorTitle').value;
  const categoryId = document.getElementById('postCategory').value;
  const ctaLink = document.getElementById('postCtaLink').value;
  const ctaText = document.getElementById('postCtaText').value;
  const references = document.getElementById('postReferences').value;
  const relatedPosts = document.getElementById('postRelatedPosts').value;

  const payload = {
    title, slug, description, content: JSON.stringify(content), status, keywords,
    canonicalUrl, ogTitle, ogDescription, ogImage, altImage, caption, editorName, editorTitle,
    categoryId, ctaLink, ctaText, references, relatedPosts
  };

  const url = currentPostId ? `/api/posts/${currentPostId}` : '/api/posts';
  const method = currentPostId ? 'PUT' : 'POST';

  console.log(`📡 Sending post save request to ${url}...`);

  const res = await apiFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res && res.ok) {
    alert(status === 'PUBLISHED' ? '🎉 Bài viết đã được xuất bản tĩnh thành công và tự động push lên GitHub!' : '💾 Đã lưu bài viết thành bản nháp thành công!');
    showSection('posts');
  } else if (res) {
    const errorData = await res.json();
    alert(`Lỗi: ${errorData.message}`);
  }
}

// Category dropdown loader for editor
async function loadCategoryDropdown() {
  const res = await fetch('/api/categories');
  const cats = await res.json();
  const select = document.getElementById('postCategory');
  select.innerHTML = '<option value="">Chọn chuyên mục...</option>';
  cats.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

// ==========================================
// 4. MEDIA LIBRARY CONTROLLER
// ==========================================
async function loadMedia() {
  const res = await apiFetch('/api/media');
  if (!res) return;
  const mediaList = await res.json();

  const grid = document.getElementById('mediaGalleryGrid');
  grid.innerHTML = '';

  if (mediaList.length === 0) {
    grid.innerHTML = '<p class="col-span-full text-center text-slate-500 italic py-12">Chưa có tệp tin hình ảnh nào được tải lên</p>';
    return;
  }

  mediaList.forEach(m => {
    grid.innerHTML += `
      <div class="bg-slate-800 border border-slate-700/60 rounded-2xl overflow-hidden shadow-md flex flex-col group relative">
        <div class="aspect-video bg-slate-950 flex items-center justify-center overflow-hidden p-1 relative">
          <img src="${m.url}" alt="${m.alt || ''}" class="max-w-full max-h-full object-contain rounded-lg">
        </div>
        <div class="p-3 text-[10px] space-y-1 bg-slate-950/40">
          <p class="font-bold text-white truncate">${m.filename}</p>
          <p class="text-slate-500">${(m.size / 1024).toFixed(1)} KB | WEBP</p>
        </div>
        <div class="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
          <button onclick="copyToClipboard('${m.url}')" class="px-2.5 py-1 bg-blue-600 rounded-lg text-xs font-bold hover:bg-blue-500 transition">Copy URL</button>
          <button onclick="handleDeleteMedia('${m.id}')" class="px-2.5 py-1 bg-red-600 rounded-lg text-xs font-bold hover:bg-red-500 transition">Xóa</button>
        </div>
      </div>
    `;
  });
}

// Media upload handler
async function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  
  console.log('📸 Uploading & optimizing image on server...');

  const res = await apiFetch('/api/media/upload', {
    method: 'POST',
    body: formData
  });

  if (res && res.ok) {
    alert('Tải ảnh & Tự động tối ưu WebP thành công!');
    loadMedia();
  } else if (res) {
    const error = await res.json();
    alert(`Lỗi upload: ${error.message || 'Không xác định'}`);
  }
}

// Modal upload handler
async function handleModalImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  
  console.log('📸 Uploading & optimizing image inside modal...');

  const res = await apiFetch('/api/media/upload', {
    method: 'POST',
    body: formData
  });

  if (res && res.ok) {
    const data = await res.json();
    alert('Tải ảnh mới từ máy tính & Tự động tối ưu WebP thành công!');
    
    // Automatically select the newly uploaded image!
    selectImageForField(data.file.url);
    
    // Clear file input value so same file can be selected again if needed
    document.getElementById('modalMediaUploadInput').value = '';
  } else if (res) {
    const error = await res.json();
    alert(`Lỗi upload: ${error.message || 'Không xác định'}`);
  }
}

async function handleDeleteMedia(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa tệp tin ảnh này khỏi thư viện?')) return;
  const res = await apiFetch(`/api/media/${id}`, { method: 'DELETE' });
  if (res && res.ok) {
    loadMedia();
  }
}

// Media Selector Modal workflow for editor fields
async function openMediaModal(targetInputId) {
  activeTargetInputId = targetInputId;
  const modal = document.getElementById('mediaModal');
  modal.classList.remove('hidden');

  const res = await apiFetch('/api/media');
  if (!res) return;
  const mediaList = await res.json();

  const grid = document.getElementById('modalMediaGrid');
  grid.innerHTML = '';

  mediaList.forEach(m => {
    grid.innerHTML += `
      <div onclick="selectImageForField('${m.url}')" class="bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden flex flex-col items-center justify-center p-2 cursor-pointer hover:border-blue-500 transition relative">
        <div class="aspect-square bg-slate-950 flex items-center justify-center w-full overflow-hidden rounded-lg">
          <img src="${m.url}" alt="${m.alt || ''}" class="max-w-full max-h-full object-contain">
        </div>
        <p class="text-[9px] text-slate-400 mt-2 truncate w-full text-center">${m.filename}</p>
      </div>
    `;
  });
}

function selectImageForField(url) {
  if (activeTargetInputId === 'blockImageCallback') {
    if (currentBlockCallback) {
      currentBlockCallback(url);
    }
  } else if (activeTargetInputId) {
    const input = document.getElementById(activeTargetInputId);
    if (input) {
      input.value = url;
      
      // If featured image updated, update preview image as well
      if (activeTargetInputId === 'postOgImage') {
        document.getElementById('ogImagePreview').src = url;
      }
      
      runSeoAudit();
    }
  }
  closeMediaModal();
}

function closeMediaModal() {
  document.getElementById('mediaModal').classList.add('hidden');
  activeTargetInputId = null;
}

// Helper to copy strings
function copyToClipboard(str) {
  navigator.clipboard.writeText(str);
  alert('Đã copy đường dẫn ảnh vào Clipboard: ' + str);
}

// ==========================================
// 5. CATEGORIES & TAGS CONTROLLER
// ==========================================
async function loadCategoriesAndTags() {
  // Load categories list
  const catRes = await fetch('/api/categories');
  categories = await catRes.json();
  
  const catBody = document.getElementById('cat-table-body');
  catBody.innerHTML = '';
  categories.forEach(cat => {
    catBody.innerHTML += `
      <tr class="border-b border-slate-700/40 text-slate-300">
        <td class="py-2.5 font-bold flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full" style="background-color: ${cat.color}"></span>
          ${cat.name}
        </td>
        <td class="py-2.5">${cat.slug}</td>
        <td class="py-2.5 text-right">
          <button onclick="handleDeleteCategory('${cat.id}')" class="text-red-400 hover:text-red-300">Xóa</button>
        </td>
      </tr>
    `;
  });

  // Load tags list
  const tagRes = await fetch('/api/tags');
  tags = await tagRes.json();

  const tagsContainer = document.getElementById('tagsContainer');
  tagsContainer.innerHTML = '';
  tags.forEach(tag => {
    tagsContainer.innerHTML += `
      <span class="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 border border-slate-700/60 rounded-full text-xs text-slate-300 hover:border-red-500 transition group">
        # ${tag.name}
        <button onclick="handleDeleteTag('${tag.id}')" class="text-slate-500 hover:text-red-400 transition" aria-label="Xóa tag">×</button>
      </span>
    `;
  });
}

// Create Category Submit
async function handleCreateCategory(e) {
  e.preventDefault();
  const name = document.getElementById('catName').value;
  const slug = document.getElementById('catSlug').value;
  const description = document.getElementById('catDesc').value;
  const color = document.getElementById('catColor').value;

  const res = await apiFetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, slug, description, color })
  });

  if (res && res.ok) {
    document.getElementById('catName').value = '';
    document.getElementById('catSlug').value = '';
    document.getElementById('catDesc').value = '';
    loadCategoriesAndTags();
  }
}

async function handleDeleteCategory(id) {
  if (!confirm('Bạn có muốn xóa chuyên mục này?')) return;
  const res = await apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
  if (res && res.ok) {
    loadCategoriesAndTags();
  }
}

// Create Tag Submit
async function handleCreateTag(e) {
  e.preventDefault();
  const name = document.getElementById('tagName').value;
  const slug = document.getElementById('tagSlug').value;

  const res = await apiFetch('/api/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, slug })
  });

  if (res && res.ok) {
    document.getElementById('tagName').value = '';
    document.getElementById('tagSlug').value = '';
    loadCategoriesAndTags();
  }
}

async function handleDeleteTag(id) {
  const res = await apiFetch(`/api/tags/${id}`, { method: 'DELETE' });
  if (res && res.ok) {
    loadCategoriesAndTags();
  }
}

// ==========================================
// 6. USERS MANAGEMENT CONTROLLER
// ==========================================
async function loadUsers() {
  const res = await apiFetch('/api/users');
  if (!res) return;
  const userList = await res.json();

  const tbody = document.getElementById('users-table-body');
  tbody.innerHTML = '';

  userList.forEach(u => {
    const lastLoginStr = u.lastLogin ? new Date(u.lastLogin).toLocaleString('vi-VN') : 'Chưa đăng nhập';
    const statusText = u.isActive 
      ? '<span class="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded">Hoạt động</span>' 
      : '<span class="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded">Đã khóa</span>';

    tbody.innerHTML += `
      <tr class="border-b border-slate-700/40 text-slate-300">
        <td class="px-6 py-4 font-bold text-white">${u.name}</td>
        <td class="px-6 py-4">${u.email}</td>
        <td class="px-6 py-4"><span class="px-2 py-0.5 bg-slate-700 text-slate-200 text-xs rounded font-mono">${u.role}</span></td>
        <td class="px-6 py-4">${statusText}</td>
        <td class="px-6 py-4 text-xs text-slate-500">${lastLoginStr}</td>
        <td class="px-6 py-4 text-right space-x-2">
          <button onclick="editUser('${u.id}', '${u.name}', '${u.email}', '${u.role}', ${u.isActive})" class="text-blue-400 hover:underline">Sửa</button>
          <button onclick="handleDeleteUser('${u.id}')" class="text-red-400 hover:underline">Xóa</button>
        </td>
      </tr>
    `;
  });
}

// User CRUD modal functions
function openUserModal() {
  document.getElementById('modalUserId').value = '';
  document.getElementById('modalUserName').value = '';
  document.getElementById('modalUserEmail').value = '';
  document.getElementById('modalUserPassword').value = '';
  document.getElementById('modalUserRole').value = 'VIEWER';
  document.getElementById('modalUserActive').checked = true;
  document.getElementById('userModalTitle').innerText = 'Tạo tài khoản quản trị mới';
  document.getElementById('userModal').classList.remove('hidden');
}

function editUser(id, name, email, role, isActive) {
  document.getElementById('modalUserId').value = id;
  document.getElementById('modalUserName').value = name;
  document.getElementById('modalUserEmail').value = email;
  document.getElementById('modalUserPassword').value = '';
  document.getElementById('modalUserRole').value = role;
  document.getElementById('modalUserActive').checked = isActive;
  document.getElementById('userModalTitle').innerText = 'Cập nhật tài khoản quản trị';
  document.getElementById('userModal').classList.remove('hidden');
}

function closeUserModal() {
  document.getElementById('userModal').classList.add('hidden');
}

async function handleSaveUser(e) {
  e.preventDefault();
  const id = document.getElementById('modalUserId').value;
  const name = document.getElementById('modalUserName').value;
  const email = document.getElementById('modalUserEmail').value;
  const password = document.getElementById('modalUserPassword').value;
  const role = document.getElementById('modalUserRole').value;
  const isActive = document.getElementById('modalUserActive').checked;

  const payload = { name, email, role, isActive };
  if (password) payload.password = password;

  const url = id ? `/api/users/${id}` : '/api/users';
  const method = id ? 'PUT' : 'POST';

  const res = await apiFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res && res.ok) {
    alert('Đã lưu tài khoản quản trị thành công!');
    closeUserModal();
    loadUsers();
  } else if (res) {
    const err = await res.json();
    alert(`Lỗi: ${err.message}`);
  }
}

async function handleDeleteUser(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống?')) return;
  const res = await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
  if (res && res.ok) {
    loadUsers();
  }
}

// Drag and drop events setup for media library
const dropzone = document.getElementById('mediaDropzone');
if (dropzone) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.add('border-blue-500'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.remove('border-blue-500'), false);
  });

  dropzone.addEventListener('drop', handleDrop, false);

  async function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    console.log('📸 Drag drop upload in progress...');
    const res = await apiFetch('/api/media/upload', {
      method: 'POST',
      body: formData
    });

    if (res && res.ok) {
      alert('Tải ảnh và Tối ưu WebP thành công!');
      loadMedia();
    }
  }
}

// App Initialization entry
document.addEventListener('DOMContentLoaded', () => {
  // Read current user info from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userRole').innerText = user.role;
    document.getElementById('userAvatar').innerText = user.name.charAt(0);
    
    // Hide tabs if viewer role
    if (user.role === 'VIEWER') {
      document.getElementById('nav-users').classList.add('hidden');
    }
  }

  // Load dashboard on start
  showSection('dashboard');
});
