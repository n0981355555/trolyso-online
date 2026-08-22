import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';

// Humanize AI Text Handler
export const humanizeText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Vui lòng cung cấp văn bản cần làm sạch' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        message: 'Lỗi cấu hình máy chủ: Chưa thiết lập GEMINI_API_KEY trong tệp .env' 
      });
    }

    // Khởi tạo Gemini SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    const systemPrompt = `
Bạn là một chuyên gia hiệu đính văn bản tiếng Việt chuyên nghiệp.
Nhiệm vụ của bạn là nhận vào một đoạn văn bản do AI viết và viết lại (humanize) nó sao cho đọc tự nhiên nhất giống con người viết, có thể vượt qua các công cụ quét AI (AI detectors như GPTZero, Copyleaks) với tỷ lệ tối đa.

Quy tắc viết lại:
1. Đa dạng hóa độ dài câu (xen kẽ câu ngắn, câu dài, câu ghép linh hoạt).
2. Thay đổi cấu trúc ngữ pháp giữa các câu để tạo sự tự nhiên (tránh việc lặp đi lặp lại một kiểu mở đầu câu).
3. Loại bỏ hoàn toàn các từ ngữ sáo rỗng hoặc từ nối rập khuôn thường xuất hiện ở văn bản AI tiếng Việt (như: "Nhìn chung,", "Ngoài ra,", "Đáng chú ý là,", "Tóm lại,", "Chúng ta cần,", "Hơn nữa,", "Bên cạnh đó," ở đầu câu) hoặc tiếng Anh (như: "delve", "testament", "furthermore", "in conclusion", "moreover"). Hãy thay thế bằng cách viết tự nhiên hơn hoặc lược bỏ nếu không cần thiết.
4. Giữ nguyên ý nghĩa cốt lõi, thông điệp truyền tải, và các định dạng Markdown gốc (như in đậm, tiêu đề, danh sách, liên kết).
5. Chỉ trả về văn bản đã được viết lại hoàn chỉnh, tuyệt đối không giải thích thêm hay kèm theo các lời nhắn khác.
`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `Văn bản cần viết lại:\n\n${text}` }
    ]);

    const response = await result.response;
    const humanizedText = response.text();

    return res.status(200).json({ 
      originalText: text, 
      humanizedText: humanizedText 
    });
  } catch (error) {
    console.error('🔥 Error in humanizeText:', error);
    return res.status(500).json({ 
      message: 'Lỗi xử lý văn bản bằng AI', 
      error: error.message 
    });
  }
};

// Clean AI Image Handler
export const cleanImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng tải lên một hình ảnh' });
    }

    const { format = 'webp', quality = 95, mode = 'advanced' } = req.body;
    
    // Đọc metadata gốc của ảnh để lấy kích thước
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();
    
    let processed = image;

    // 1. Xóa hoàn toàn EXIF Metadata bằng cách không gọi withMetadata() 
    // Trong sharp, khi gọi toBuffer() hay ghi file mà không gọi withMetadata(),
    // tất cả metadata sẽ bị strip (loại bỏ hoàn toàn) mặc định.

    // 2. Chế độ nâng cao (Phá vỡ cấu trúc Watermark ẩn bằng cách resize và thêm noise nhẹ)
    if (mode === 'advanced') {
      const originalWidth = metadata.width || 800;
      const originalHeight = metadata.height || 600;
      
      // Thay đổi kích thước rất nhỏ (giảm 2 pixel ở chiều rộng) để bẻ gãy cấu trúc tuần hoàn của watermark ẩn
      processed = processed.resize({
        width: originalWidth - 2,
        height: originalHeight,
        fit: 'fill'
      });
      
      // Thêm hiệu ứng nhiễu cực nhẹ hoặc làm mờ nhẹ (blur 0.3) sau đó làm nét lại (sharpen)
      // Điều này làm thay đổi giá trị kênh màu của pixel một lượng nhỏ để xóa bỏ SynthID mà mắt thường không thấy
      processed = processed.blur(0.3).sharpen({ sigma: 1.0 });
    }

    // 3. Re-compress và chuyển đổi sang định dạng mong muốn
    let outputBuffer;
    const targetQuality = parseInt(quality) || 95;

    if (format === 'png') {
      outputBuffer = await processed.png({ compressionLevel: 9 }).toBuffer();
      res.set('Content-Type', 'image/png');
    } else {
      // Mặc định nén sang WebP tối ưu
      outputBuffer = await processed.webp({ quality: targetQuality, effort: 6 }).toBuffer();
      res.set('Content-Type', 'image/webp');
    }

    // Trả về dữ liệu nhị phân của ảnh đã làm sạch
    return res.status(200).send(outputBuffer);
  } catch (error) {
    console.error('🔥 Error in cleanImage:', error);
    return res.status(500).json({ 
      message: 'Lỗi xử lý hình ảnh', 
      error: error.message 
    });
  }
};
