/**
 * Loại bỏ các tiền tố hành chính của Việt Nam để tạo đường dẫn URL gọn gàng.
 * Ví dụ: "Thành phố Hà Nội" -> "Hà Nội", "Quận Ba Đình" -> "Ba Đình"
 */
export function cleanName(name) {
  if (!name) return '';
  return name
    .replace(/^(Thành phố|Tỉnh|Quận|Huyện|Thị xã|Phường|Xã|Thị trấn)\s+/gi, '')
    .trim();
}

/**
 * Chuyển đổi chuỗi tiếng Việt có dấu thành chuỗi không dấu, gạch nối làm URL.
 * Ví dụ: "Hà Nội" -> "ha-noi"
 */
export function slugify(str) {
  if (!str) return '';
  // Chuyển về chữ thường
  str = str.toLowerCase();
  // Xóa dấu tiếng Việt
  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a");
  str = str.replace(/[èéẹẻẽêềếệểễ]/g, "e");
  str = str.replace(/[ìíịỉĩ]/g, "i");
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o");
  str = str.replace(/[ùúụủũưừứựửữ]/g, "u");
  str = str.replace(/[ỳýỵỷỹ]/g, "y");
  str = str.replace(/đ/g, "d");
  // Xóa các ký tự đặc biệt
  str = str.replace(/[^a-z0-9\s-]/g, '');
  // Thay thế khoảng trắng bằng dấu gạch ngang
  str = str.replace(/[\s_]+/g, '-');
  // Xóa các dấu gạch ngang thừa ở đầu/cuối và lặp lại
  str = str.replace(/-+/g, '-');
  str = str.replace(/^-+|-+$/g, '');
  return str;
}

/**
 * Tạo URL slug đầy đủ từ tên hành chính ban đầu.
 * Ví dụ: "Thành phố Hà Nội" -> "ha-noi"
 */
export function getSlug(name) {
  return slugify(cleanName(name));
}
