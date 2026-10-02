# Quy tắc ngữ âm và trọng âm cao độ Tokyo (Tokyo Pitch Accent Rules)
Tài liệu định hướng (Grounding Doc) cho Agent phân tích ngữ âm tiếng Nhật chuẩn.

## 1. Bản chất của Pitch Accent (Cao độ tiếng Nhật)
Khác với trọng âm cường độ (Stress Accent) của tiếng Anh hay thanh điệu (Tones) của tiếng Việt/Trung, tiếng Nhật Tokyo sử dụng trọng âm cao độ (Pitch Accent):
- Mỗi mora (âm tiết) có thể có cao độ **Cao (H)** hoặc **Thấp (L)**.
- **Nguyên tắc cơ bản 1**: Âm tiết thứ nhất và âm tiết thứ hai luôn khác nhau về cao độ (L-H hoặc H-L).
- **Nguyên tắc cơ bản 2**: Sau khi cao độ đã hạ xuống (Downstep / アクセント核), nó không thể tự tăng lên lại trong cùng một từ đơn.

## 2. Bốn Mẫu Cao độ Chuẩn Tokyo
1. **[0] 平板 (Heiban - Bằng)**:
   - Quy tắc: Âm 1 Thấp, từ âm 2 trở đi Cao. Trợ từ đi liền kề giữ nguyên mức Cao.
   - Ký hiệu: L-H-H-H... (vd: 日本 [にほん], 桜 [さくら]).
2. **[1] 頭高 (Atamadaka - Đầu cao)**:
   - Quy tắc: Âm 1 Cao, âm 2 trở đi Thấp ngay lập tức. Trợ từ đi kèm ở mức Thấp.
   - Ký hiệu: H-L-L... (vd: 雨 [あめ], 本 [ほん]).
3. **[2..n-1] 中高 (Nakadaka - Giữa cao)**:
   - Quy tắc: Âm 1 Thấp, âm 2 lên Cao, hạ xuống Thấp ở âm thứ $k$ trước âm cuối.
   - Ký hiệu: L-H...L (vd: 卵 [たまご - âm 2 cao], 飛行機 [ひこうき - âm 2 cao]).
4. **[n] 尾高 (Odaka - Đuôi cao)**:
   - Quy tắc: Âm 1 Thấp, từ âm 2 đến âm cuối cùng Cao. Tuy nhiên ngay khi có trợ từ theo sau, trợ từ sẽ bị tụt xuống Thấp.
   - Ký hiệu: L-H-H (trợ từ Thấp) (vd: 花 [はな] -> 花が [はなが: L-H-L]).
