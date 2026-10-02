# Nguyên tắc Thông tin Tối thiểu (Minimum Information Principle)
Tài liệu định hướng sư phạm (Pedagogical Grounding) cho Agent khi tạo thẻ và kiểm duyệt dữ liệu học.

## 1. Định nghĩa
Nguyên tắc Thông tin Tối thiểu (do Tiến sĩ Piotr Wozniak đúc kết trong nghiên cứu SuperMemo) chỉ ra rằng:
> **Mỗi câu hỏi ôn tập (thẻ học) chỉ được phép kiểm tra một đơn vị kiến thức nguyên tử duy nhất (Single Atomic Fact).**

## 2. Vì sao thẻ quá tải thông tin lại gây hại?
1. **Quá tải nhận thức (Cognitive Overload)**: Não bộ mất nhiều năng lượng xử lý cùng lúc nhiều nhánh thông tin.
2. **Đánh giá mâu thuẫn**: Nếu thẻ hỏi 3 nghĩa hoặc 5 từ ghép, học viên nhớ được 2 nhưng quên 1, hệ thống không thể chấm điểm chính xác (Good hay Again?).
3. **Hiện tượng gián đoạn phục hồi (Interference)**: Các thông tin thừa làm mờ đi đường dẫn thần kinh của thông tin cốt lõi.

## 3. Các quy tắc áp dụng cho Agent:
- ❌ **Không gộp nhiều nghĩa khác biệt vào một thẻ**: Thay vì tạo 1 thẻ cho "かける = treo, đeo kính, gọi điện, tốn thời gian", hãy tách thành 4 thẻ riêng biệt với ngữ cảnh cụ thể.
- ❌ **Không đặt nhiều chỗ đục lỗ (cloze) trong cùng 1 câu**: Mỗi thẻ Cloze chỉ được đục duy nhất 1 chỗ trống (tối đa 2 nếu là cụm cố định).
- ❌ **Không học mặt chữ Kanji cùng lúc với 10 âm Onyomi/Kunyomi**: Học Kanji trong từ ghép thực tế (Words in context), không học vẹt danh sách âm đơn lẻ.
