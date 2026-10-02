# Kỹ thuật Khai thác Câu (Sentence Mining) & Nguyên tắc Sư phạm

Tài liệu tri thức sư phạm (Grounding Pedagogy) giúp Agent tạo và trích xuất câu ví dụ tự nhiên, hiệu quả cao.

---

## 1. Bản chất của Sentence Mining
- **Sentence Mining** là kỹ thuật khai thác câu thực tế từ tài liệu bản ngữ (anime, tin tức, tiểu thuyết, hội thoại đời sống).
- Thay vì học từ vựng biệt lập (Isolated vocabulary), học viên tiếp thu từ vựng gắn liền với **ngữ cảnh sống động (Contextual Learning)**, qua đó nắm bắt sắc thái biểu cảm, trường nghĩa và trợ từ đi kèm tự nhiên.

---

## 2. Tiêu chuẩn Câu Khai thác Chuẩn (High-Yield Mining Criteria)
Khi Agent sinh hoặc trích xuất câu cho người học, BẮT BUỘC tuân thủ các điều kiện sau:

1. **Tuân thủ giả thuyết Krashen i+1**:
   - Câu chỉ được phép chứa **duy nhất 1 yếu tố chưa biết** ($i$ là vốn từ hiện tại, $+1$ là từ mục tiêu).
   - Tuyệt đối không dùng câu có 2 hay nhiều từ mới cùng lúc, vì sẽ gây quá tải nhận thức và làm mất tác dụng của thẻ.

2. **Độ dài lý tưởng**:
   - Độ dài tối ưu: từ **15 đến 35 ký tự Nhật**.
   - Câu ngắn gọn giúp mắt quét nhanh, não bộ tập trung xử lý tức thì thay vì phải đọc hiểu cả đoạn văn dài.

3. **Cú pháp Cloze linh hoạt**:
   - Đục lỗ từ mục tiêu dưới dạng `{{c1::từ_mục_tiêu}}`.
   - Giữ nguyên trợ từ đi kèm để học viên thực hành Active Recall cả về cách kết hợp ngữ pháp (Collocation).

4. **Tính súc tích & Tránh nhồi nhét (Anti-Overload)**:
   - Bản dịch tiếng Việt chỉ giải nghĩa tương ứng với ngữ cảnh cụ thể của câu, **không liệt kê tràn lan các nghĩa khác**.
   - Căn chỉnh độ dài giải thích ngắn gọn, xúc tích; không biến flashcard thành trang từ điển bách khoa.
