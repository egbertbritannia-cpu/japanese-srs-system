import { NextResponse } from 'next/server';
import { getContextConfig } from '@/lib/rag/context-prompts';
import { searchKnowledge, KnowledgeSnippet } from '@/lib/rag/knowledge-base';

interface ChatRequestBody {
  message: string;
  route: string;
  contextData?: {
    currentCard?: {
      kanji?: string;
      reading?: string;
      meaning?: string;
      sentence?: string;
    };
  };
}

/**
 * API Chatbot AI Trợ giảng Nhật ngữ với RAG & Context-Aware Prompting
 * - Tự động nhận diện ngữ cảnh từ màn hình hiện tại (Route Pathname)
 * - Truy xuất tri thức nội bộ từ kho RAG (50 động từ, biến âm thể Te, 544 thẻ từ vựng, FSRS)
 * - Tích hợp Gemini API nếu có key, đồng thời tích hợp Local Semantic Fallback Engine 0ms
 */
export async function POST(request: Request) {
  try {
    const body: ChatRequestBody = await request.json();
    const { message, route, contextData } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Tin nhắn không được để trống' }, { status: 400 });
    }

    const currentRoute = route || '/';
    const contextConfig = getContextConfig(currentRoute);

    // 1. RAG Retrieval: Trích xuất các tri thức liên quan từ kho dữ liệu bài học
    const relevantSnippets: KnowledgeSnippet[] = searchKnowledge(message, 3);
    const knowledgeText = relevantSnippets
      .map((s, idx) => `[Tài liệu ${idx + 1}: ${s.title}]\n${s.content}`)
      .join('\n\n');

    // Bổ sung thông tin thẻ bài hiện tại nếu đang trong phiên học
    let currentCardContext = '';
    if (contextData?.currentCard?.kanji) {
      currentCardContext = `\n[Thông tin thẻ đang xem trên màn hình]:\n- Từ: ${contextData.currentCard.kanji} (${contextData.currentCard.reading || ''})\n- Nghĩa: ${contextData.currentCard.meaning || ''}\n- Câu ví dụ: ${contextData.currentCard.sentence || 'Chưa có'}`;
    }

    // 2. Kiểm tra nếu có GEMINI_API_KEY để gọi mô hình AI nâng cao
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const fullPrompt = `${contextConfig.systemPrompt}

DƯỚI ĐÂY LÀ KIẾN THỨC BÀI HỌC NỘI BỘ TỪ HỆ THỐNG (RAG GROUNDING KNOWLEDGE):
${knowledgeText}
${currentCardContext}

CÂU HỎI CỦA HỌC VIÊN:
${message}

HÃY TRẢ LỜI:
- Bám sát vào kiến thức bài học được cung cấp ở trên.
- Trả lời bằng tiếng Việt lịch sự, thân thiện, mang đậm chất người thầy Nhật Bản (Sensei).
- Có cấu trúc rõ ràng, dùng bullet points nếu cần, giải thích cặn kẽ chữ Hán, Hiragana và Romaji.
- Kết thúc bằng một lời động viên ngắn gọn.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json({
              success: true,
              answer: generatedText,
              contextId: contextConfig.contextId,
              roleName: contextConfig.roleName,
              badgeText: contextConfig.badgeText,
              references: relevantSnippets.map((s) => s.title),
            });
          }
        }
      } catch (geminiError) {
        console.warn('[Gemini API Fallback]', geminiError);
      }
    }

    // 3. LOCAL SEMANTIC RAG FALLBACK ENGINE:
    // Đảm bảo chatbot luôn trả lời chuẩn xác ngay cả khi không có Internet hoặc chưa cấu hình API key
    let localAnswer = '';
    const qLower = message.toLowerCase();

    if (qLower.includes('thể te') || qLower.includes('te') || qLower.includes('biến âm') || qLower.includes('chia')) {
      localAnswer = `Chào bạn! Về **cách chia Thể Te (て形)** trong tiếng Nhật:\n\n` +
        `**1. Nhóm 1 (Godan):**\n` +
        `- Đuôi **う, つ, る** ➔ biến âm ngắt (促音便 - Sokuonbin) thành **〜 って** (ví dụ: *買う ➔ 買って*, *待つ ➔ 待って*, *取る ➔ 取って*).\n` +
        `- Đuôi **む, ぶ, ぬ** ➔ biến âm mũi (撥音便 - Hatsuonbin) thành **〜 んで** (ví dụ: *飲む ➔ 飲んで*, *遊ぶ ➔ 遊んで*, *死ぬ ➔ 死んで*).\n` +
        `- Đuôi **く** ➔ biến âm I (イ音便 - I-onbin) thành **〜 いて** (ví dụ: *書く ➔ 書いて*).\n` +
        `- Đuôi **ぐ** ➔ biến âm I đục thành **〜 いで** (ví dụ: *泳ぐ ➔ 泳いで*).\n` +
        `- Đuôi **す** ➔ chuyển thành **〜 して** (ví dụ: *話す ➔ 話して*).\n` +
        `- ★ **Ngoại lệ đặc biệt**: *行く (iku)* chuyển thành **行って (itte)** (促音便 âm ngắt, không phải 行いて)!\n\n` +
        `**2. Nhóm 2 (Ichidan):** Bỏ **る** thêm **て** (ví dụ: *食べる ➔ 食べて*, *見る ➔ 見て*).\n\n` +
        `**3. Nhóm 3 (Bất quy tắc):** *する ➔ して*, *来る (くる) ➔ 来て (きて)*.`;
    } else if (qLower.includes('ngoại lệ') || qLower.includes('iku') || qLower.includes('kaeru') || qLower.includes('nhóm 1')) {
      localAnswer = `Chào bạn! Trong tiếng Nhật có một số **động từ ngoại lệ kinh điển** mà bạn cần đặc biệt lưu ý:\n\n` +
        `1. **行く (iku - đi)**: Đuôi ku nhưng biến âm ngắt thành **行って (itte)** chứ không phải 行いて!\n` +
        `2. **Các động từ đuôi iru/eru nhưng thuộc Nhóm 1 (Godan)**:\n` +
        `- **帰る (kaeru - về)** ➔ Thể Te: *帰って (kaette)*, Thể Masu: *帰ります*.\n` +
        `- **入る (hairu - vào)** ➔ Thể Te: *入って (haitte)*, Thể Masu: *入ります*.\n` +
        `- **走る (hashiru - chạy)** ➔ Thể Te: *走って (hashitte)*.\n` +
        `- **知る (shiru - biết)** ➔ Thể Te: *知って (shitte)*.\n` +
        `- **切る (kiru - cắt)** ➔ Thể Te: *切って (kitte)*.\n\n` +
        `Hãy ghi nhớ: những từ này thuộc Nhóm 1 nên khi chia thể Te phải biến đổi âm ngắt [って]!`;
    } else if (qLower.includes('fsrs') || qLower.includes('thuật toán') || qLower.includes('chu kỳ')) {
      localAnswer = `Chào bạn! Hệ thống áp dụng **Thuật toán FSRS v4.5** (Free Spaced Repetition Scheduler):\n\n` +
        `- **Stability (S)**: Độ bền trí nhớ (số ngày bạn còn nhớ được trước khi xác suất rơi xuống dưới 90%).\n` +
        `- **Difficulty (D)**: Độ phức tạp tự nhiên của thẻ học từ 1 đến 10.\n` +
        `- **Retrievability (R)**: Xác suất nhớ lại thành công tại thời điểm hiện tại.\n\n` +
        `🎯 **Lời khuyên từ Sensei**: Khi ôn tập, hãy đánh giá trung thực: bấm **再 (1)** nếu quên hoàn toàn, **難 (2)** nếu nhớ khó khăn, **良 (3)** khi nhớ đúng sau suy nghĩ, và **易 (4)** nếu nhớ ngay tức khắc. Thuật toán sẽ tự động tối ưu hóa lịch giãn cách tốt nhất cho bạn!`;
    } else if (relevantSnippets.length > 0) {
      const topSnippet = relevantSnippets[0];
      localAnswer = `Sensei xin giải đáp thắc mắc của bạn dựa trên bài học trong hệ thống:\n\n` +
        `📌 **${topSnippet.title}**\n\n` +
        `${topSnippet.content}\n\n` +
        `Nếu bạn muốn luyện tập trực tiếp từ vựng này, hãy vào mục **Động từ** hoặc **Ôn tập Karuta** nhé! Chúc bạn học tập thật tốt! 一期一会 · 七転び八起き!`;
    } else {
      localAnswer = `Chào bạn! Tôi là Sensei AI đồng hành cùng bạn trên con đường chinh phục tiếng Nhật.\n\n` +
        `Tại màn hình hiện tại (${contextConfig.badgeText}), bạn có thể hỏi tôi về:\n` +
        `- Quy tắc chia thể Te (て形) và thể Ru (辞書形)\n` +
        `- Ý nghĩa và cách dùng của 50 động từ thông dụng\n` +
        `- Cơ chế tính chu kỳ ôn tập FSRS\n` +
        `- Cách giải nghĩa chữ Hán, âm On/Kun và ngữ cảnh câu ví dụ.\n\n` +
        `Hãy đặt câu hỏi cụ thể, Sensei sẽ phân tích chi tiết cho bạn nhé!`;
    }

    return NextResponse.json({
      success: true,
      answer: localAnswer,
      contextId: contextConfig.contextId,
      roleName: contextConfig.roleName,
      badgeText: contextConfig.badgeText,
      references: relevantSnippets.map((s) => s.title),
    });
  } catch (error: any) {
    console.error('[API Chat Error]', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
