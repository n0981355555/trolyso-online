export function analyzeSeo(post) {
  let score = 0;
  const checks = [];
  const keyword = post.keywords ? post.keywords.trim().toLowerCase() : '';
  const contentHtml = post.contentHtml ? post.contentHtml.toLowerCase() : '';
  const title = post.title ? post.title.trim() : '';
  const slug = post.slug ? post.slug.trim() : '';
  const description = post.description ? post.description.trim() : '';
  
  // 1. Keyword check
  if (keyword) {
    // Keyword in Title
    if (title.toLowerCase().includes(keyword)) {
      score += 15;
      checks.push({ type: 'success', text: 'Từ khóa chính xuất hiện trong Tiêu đề H1' });
    } else {
      checks.push({ type: 'warning', text: 'Từ khóa chính chưa xuất hiện trong Tiêu đề H1' });
    }
    
    // Keyword in Slug
    if (slug.toLowerCase().includes(keyword.replace(/\s+/g, '-'))) {
      score += 10;
      checks.push({ type: 'success', text: 'Từ khóa chính xuất hiện trong URL Slug' });
    } else {
      checks.push({ type: 'warning', text: 'Từ khóa chính chưa xuất hiện trong URL Slug' });
    }
    
    // Keyword density
    if (contentHtml) {
      const words = contentHtml.split(/\s+/).filter(Boolean);
      const wordCount = words.length;
      const matches = (contentHtml.match(new RegExp(keyword, 'g')) || []).length;
      const density = wordCount > 0 ? (matches / wordCount) * 100 : 0;
      
      if (density >= 1 && density <= 2.5) {
        score += 15;
        checks.push({ type: 'success', text: `Mật độ từ khóa chính rất tốt (${density.toFixed(2)}%)` });
      } else if (density > 2.5) {
        score += 5;
        checks.push({ type: 'warning', text: `Mật độ từ khóa quá cao (${density.toFixed(2)}%), có thể bị coi là spam` });
      } else {
        checks.push({ type: 'warning', text: `Mật độ từ khóa chính quá thấp (${density.toFixed(2)}%), nên bổ sung thêm` });
      }
    }
  } else {
    checks.push({ type: 'danger', text: 'Chưa khai báo từ khóa chính để chấm điểm SEO' });
  }
  
  // 2. Title & Description Lengths
  if (title.length >= 40 && title.length <= 65) {
    score += 10;
    checks.push({ type: 'success', text: `Độ dài tiêu đề tối ưu (${title.length} ký tự)` });
  } else {
    checks.push({ type: 'warning', text: 'Độ dài tiêu đề nên từ 40 đến 65 ký tự' });
  }
  
  if (description.length >= 120 && description.length <= 160) {
    score += 10;
    checks.push({ type: 'success', text: `Độ dài mô tả meta tối ưu (${description.length} ký tự)` });
  } else {
    checks.push({ type: 'warning', text: 'Độ dài mô tả meta nên từ 120 đến 160 ký tự' });
  }
  
  // 3. Word count
  if (contentHtml) {
    const wordCount = contentHtml.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 600) {
      score += 10;
      checks.push({ type: 'success', text: `Độ dài bài viết tốt (${wordCount} từ)` });
    } else {
      checks.push({ type: 'warning', text: `Bài viết khá ngắn (${wordCount} từ), nên tối thiểu 600 từ` });
    }
  }
  
  // 4. Images Alt & Caption check
  if (post.featuredImage) {
    if (post.altImage) {
      score += 10;
      checks.push({ type: 'success', text: 'Ảnh đại diện có thẻ Alt mô tả' });
    } else {
      checks.push({ type: 'danger', text: 'Ảnh đại diện thiếu thẻ Alt (rất quan trọng cho SEO)' });
    }
    
    if (post.caption) {
      score += 5;
      checks.push({ type: 'success', text: 'Ảnh đại diện có caption chú thích' });
    } else {
      checks.push({ type: 'warning', text: 'Nên bổ sung chú thích caption cho ảnh đại diện' });
    }
  }
  
  // 5. Internal & External links
  if (post.relatedPosts || contentHtml.includes('href="/blog/')) {
    score += 10;
    checks.push({ type: 'success', text: 'Có sử dụng liên kết nội bộ (Internal link)' });
  } else {
    checks.push({ type: 'warning', text: 'Nên thêm ít nhất một liên kết nội bộ' });
  }
  
  if (post.references || contentHtml.includes('href="http')) {
    score += 10;
    checks.push({ type: 'success', text: 'Có trích dẫn nguồn uy tín (External link)' });
  } else {
    checks.push({ type: 'warning', text: 'Nên trích dẫn nguồn uy tín bên ngoài' });
  }
  
  return {
    score: Math.min(100, score),
    checks
  };
}
