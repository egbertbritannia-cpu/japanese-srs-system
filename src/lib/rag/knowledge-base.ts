import rawVerbsData from '@/data/japanese-verbs.json';

export interface KnowledgeSnippet {
  id: string;
  category: 'verb_grammar' | 'verb_item' | 'fsrs_system' | 'kanji_vocab' | 'study_method';
  title: string;
  keywords: string[];
  content: string;
}

// Kho tri thức cơ sở được chuẩn hóa từ giáo trình bài học của hệ thống
const STATIC_KNOWLEDGE_BASE: KnowledgeSnippet[] = [
  // 1. Quy tắc ngữ pháp thể Te & Ru
  {
    id: 'kb_te_group1_sokuon',
    category: 'verb_grammar',
    title: 'Biến âm ngắt thể Te (促音便) - Đuôi u, tsu, ru',
    keywords: ['thể te', 'biến âm ngắt', 'sokuonbin', 'u', 'tsu', 'ru', 'tte', 'mua', 'chờ', 'lấy'],
    content:
      'Quy tắc biến âm ngắt (促音便 - Sokuonbin) trong động từ Nhóm 1 (Godan): Các động từ có tận cùng bằng う (u), つ (tsu), る (ru) khi chuyển sang Thể Te (て形) sẽ đổi đuôi thành [って (tte)]. Ví dụ: 買う (kau) -> 買って (katte), 待つ (matsu) -> 待って (matte), 取る (toru) -> 取って (totte).',
  },
  {
    id: 'kb_te_group1_hatsuon',
    category: 'verb_grammar',
    title: 'Biến âm mũi thể Te (撥音便) - Đuôi mu, bu, nu',
    keywords: ['thể te', 'biến âm mũi', 'hatsuonbin', 'mu', 'bu', 'nu', 'nde', 'uống', 'chơi', 'chết'],
    content:
      'Quy tắc biến âm mũi (撥音便 - Hatsuonbin) trong động từ Nhóm 1 (Godan): Các động từ có đuôi là む (mu), ぶ (bu), ぬ (nu) khi chuyển sang Thể Te sẽ biến đổi thành [んで (nde)] (có âm đục). Ví dụ: 飲む (nomu) -> 飲んで (nonde), 遊ぶ (asobu) -> 遊んで (asonde), 死ぬ (shinu) -> 死んで (shinde).',
  },
  {
    id: 'kb_te_group1_ionbin',
    category: 'verb_grammar',
    title: 'Biến âm I thể Te (イ音便) - Đuôi ku, gu',
    keywords: ['thể te', 'biến âm i', 'ionbin', 'ku', 'gu', 'ite', 'ide', 'viết', 'nghe', 'bơi', 'vội'],
    content:
      'Quy tắc biến âm I (イ音便 - I-onbin) trong động từ Nhóm 1 (Godan): Động từ đuôi [く (ku)] chuyển thành [いて (ite)] (ví dụ: 書く -> 書いて, 聞く -> 聞いて). Động từ đuôi [ぐ (gu)] chuyển thành [いで (ide)] có đục (ví dụ: 泳ぐ -> 泳いで, 急ぐ -> 急いで).',
  },
  {
    id: 'kb_te_exception_iku',
    category: 'verb_grammar',
    title: 'Ngoại lệ chí mạng của Thể Te: Động từ 行く (iku)',
    keywords: ['ngoại lệ', 'đi', 'iku', 'itte', 'iite', 'thể te'],
    content:
      'Động từ 行く (iku - đi) mặc dù có tận cùng là [く] nhưng KHÔNG chia theo biến âm I (không chia là 行いて), mà biến đổi đặc biệt thành âm ngắt: 行って (いって - itte). Đây là ngoại lệ xuất hiện liên tục trong đề thi JLPT N5.',
  },
  {
    id: 'kb_te_group1_su',
    category: 'verb_grammar',
    title: 'Động từ nhóm 1 đuôi su (す)',
    keywords: ['thể te', 'đuôi su', 'shite', 'nói chuyện', 'cho mượn'],
    content:
      'Động từ Nhóm 1 có tận cùng là [す (su)] không xảy ra biến âm mà chỉ chuyển [す] thành [して (shite)]. Ví dụ: 話す (hanasu) -> 話して (hanashite), 貸す (kasu) -> 貸して (kashite), 出す (dasu) -> 出して (dashite).',
  },
  {
    id: 'kb_te_group2_ichidan',
    category: 'verb_grammar',
    title: 'Cách chia Thể Te của Nhóm 2 (Nhất đoạn - Ichidan)',
    keywords: ['nhóm 2', 'ichidan', 'thể te', 'bỏ ru', 'ăn', 'ngủ', 'thức dậy'],
    content:
      'Động từ Nhóm 2 (Ichidan) có nguyên âm đứng trước る thuộc hàng I hoặc hàng E. Cách chia thể Te vô cùng đơn giản: Chỉ cần [Bỏ る và thêm て]. Ví dụ: 食べる (taberu) -> 食べて (tabete), 見る (miru) -> 見て (mite), 起きる (okiru) -> 起きて (okite), 寝る (neru) -> 寝て (nete).',
  },
  {
    id: 'kb_te_group3_fukisoku',
    category: 'verb_grammar',
    title: 'Cách chia Thể Te của Nhóm 3 (Bất quy tắc - Fukisoku)',
    keywords: ['nhóm 3', 'bất quy tắc', 'suru', 'kuru', 'shite', 'kite', 'làm', 'đến'],
    content:
      'Nhóm 3 gồm 2 động từ bất quy tắc: 1) する (suru) chuyển thành して (shite); 2) 来る (くる - kuru) chuyển thành 来て (きて - kite) - chú ý cách đọc chữ Hán đổi từ ku sang ki.',
  },
  {
    id: 'kb_verb_exceptions_group1',
    category: 'verb_grammar',
    title: 'Các động từ bẫy đuôi iru/eru nhưng thuộc Nhóm 1',
    keywords: ['bẫy', 'ngoại lệ', 'iru', 'eru', 'kaeru', 'hairu', 'shiru', 'hashiru', 'kiru'],
    content:
      'Các động từ sau nhìn bề ngoài giống Nhóm 2 nhưng thực chất thuộc Nhóm 1 (Godan) và chia biến âm ngắt [って]: 帰る (かえる - về -> 帰って), 入る (はいる - vào -> 入って), 走る (はしる - chạy -> 走って), 知る (しる - biết -> 知って), 切る (きる - cắt -> 切って), 要る (いる - cần -> 要って).',
  },

  // 2. Thuật toán FSRS & Phương pháp học
  {
    id: 'kb_fsrs_principles',
    category: 'fsrs_system',
    title: 'Nguyên lý Thuật toán FSRS (Free Spaced Repetition Scheduler)',
    keywords: ['fsrs', 'thuật toán', 'lặp lại ngắt quãng', 'stability', 'difficulty', 'retrievability', 'spaced repetition'],
    content:
      'Hệ thống áp dụng FSRS v4.5 để tính toán chu kỳ củng cố trí nhớ dựa trên 3 biến số tâm lý học thần kinh: 1) Stability (S): Độ bền vững của ký ức theo ngày; 2) Difficulty (D): Độ phức tạp nhận thức của thẻ từ (1-10); 3) Retrievability (R): Xác suất hồi tưởng thành công theo thời gian. Mục tiêu hệ thống duy trì Retrievability ở mức tối ưu 90%.',
  },
  {
    id: 'kb_fsrs_ratings',
    category: 'fsrs_system',
    title: 'Ý nghĩa 4 mức đánh giá FSRS: Again, Hard, Good, Easy',
    keywords: ['đánh giá', 'again', 'hard', 'good', 'easy', '1', '2', '3', '4', 'chấm điểm'],
    content:
      'Trong phiên ôn tập: 再 Again (1): Hoàn toàn không nhớ, thẻ sẽ quay lại ngay trong phiên; 難 Hard (2): Nhớ nhưng khó khăn, giãn khoảng cách ngắn; 良 Good (3): Nhớ đúng lúc sau nỗ lực suy nghĩ, khoảng cách chuẩn; 易 Easy (4): Nhớ lập tức không tốn sức, khoảng cách ôn được nhân rộng tối đa.',
  },
  {
    id: 'kb_kanji_atomicity',
    category: 'study_method',
    title: 'Nguyên tắc Thông tin Tối thiểu (Minimum Information Principle - Atomicity)',
    keywords: ['atomicity', 'tối thiểu', 'nguyên tắc', 'tạo thẻ', 'học nhanh'],
    content:
      'Một thẻ học hiệu quả chỉ nên chứa DUY NHẤT một đơn vị kiến thức (ví dụ 1 nghĩa chính hoặc 1 nét biến âm). Không nhồi nhét nhiều nghĩa hoặc nhiều câu phức tạp vào 1 thẻ vì sẽ gây quá tải nhận thức (Cognitive Overload) và làm sai lệch thống kê FSRS.',
  },
];

/**
 * Tìm kiếm các đoạn tri thức liên quan từ kho dữ liệu bài học (RAG Keyword & Semantic Filter)
 */
export function searchKnowledge(query: string, limit: number = 3): KnowledgeSnippet[] {
  if (!query || !query.trim()) {
    return STATIC_KNOWLEDGE_BASE.slice(0, limit);
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/[\s,;.?!]+/);

  // 1. Tìm trong kho static ngữ pháp & nguyên lý FSRS
  const scoredStatic = STATIC_KNOWLEDGE_BASE.map((item) => {
    let score = 0;
    // Khớp tiêu đề
    if (item.title.toLowerCase().includes(normalizedQuery)) score += 8;

    // Khớp keywords
    for (const kw of item.keywords) {
      if (normalizedQuery.includes(kw)) score += 5;
      for (const w of queryWords) {
        if (kw === w) score += 3;
      }
    }

    // Khớp nội dung
    for (const w of queryWords) {
      if (w.length > 1 && item.content.toLowerCase().includes(w)) score += 1;
    }

    return { item, score };
  });

  // 2. Tìm trong kho 50 động từ cốt lõi
  const scoredVerbs: { item: KnowledgeSnippet; score: number }[] = (rawVerbsData as any[]).map((v) => {
    let score = 0;
    const vKanji = v.kanji.toLowerCase();
    const vHira = v.hiragana.toLowerCase();
    const vRoma = v.romaji.toLowerCase();
    const vMean = v.meaning_vi.toLowerCase();

    if (normalizedQuery.includes(vKanji)) score += 10;
    if (normalizedQuery.includes(vHira)) score += 8;
    if (normalizedQuery.includes(vRoma)) score += 7;
    if (normalizedQuery.includes(vMean)) score += 5;

    const snippet: KnowledgeSnippet = {
      id: `verb_${v.id}`,
      category: 'verb_item',
      title: `Động từ: ${v.kanji} (${v.hiragana}) - ${v.meaning_vi}`,
      keywords: [v.kanji, v.hiragana, v.romaji, v.meaning_vi, `nhóm ${v.group}`],
      content: `Động từ ${v.kanji} (${v.hiragana} - ${v.romaji}): Ý nghĩa là "${v.meaning_vi}". Thuộc Nhóm ${v.group}${v.isException ? ' (Ngoại lệ)' : ''}. Thể Te: ${v.te_form.kanji} (${v.te_form.hiragana}). Thể Ru: ${v.ru_form.kanji} (${v.ru_form.hiragana}). Thể Masu: ${v.masu_form.kanji}. Ví dụ: ${v.example.sentence} (${v.example.meaning})`,
    };

    return { item: snippet, score };
  });

  const allScored = [...scoredStatic, ...scoredVerbs]
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (allScored.length === 0) {
    // Nếu không khớp từ khóa cụ thể, trả về các snippet hữu ích mặc định
    return STATIC_KNOWLEDGE_BASE.slice(0, limit);
  }

  return allScored.slice(0, limit).map((e) => e.item);
}
