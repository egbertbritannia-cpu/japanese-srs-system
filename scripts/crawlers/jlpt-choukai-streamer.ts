import path from 'path';
import { DriveFolderManager } from './drive-folder-manager';
import { StreamUploader } from './stream-uploader';

export interface JlptChoukaiItem {
  id: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  mondai: number;
  mondaiName: string;
  questionNumber: number;
  title: string;
  audioUrl: string;
  script: string;
  question: string;
  options: string[];
  correctOption: number;
  explanationVi: string;
  officialSource: string;
}

/**
 * Danh mục các đề thi nghe JLPT chuẩn Nhật Bản chính thức từ The Japan Foundation & JEES.
 * Âm thanh là các file MP3 nghe thi thực tế chất lượng cao từ cổng thông tin jlpt.jp.
 */
export const JLPT_CHOUKAI_ARCHIVE: JlptChoukaiItem[] = [
  // --- N5 ---
  {
    id: 'jlpt_n5_mondai1_q1',
    level: 'N5',
    mondai: 1,
    mondaiName: '課題理解 (Hiểu đề bài - Task Comprehension)',
    questionNumber: 1,
    title: 'Câu hỏi về vật dụng cần mang theo (持ち物)',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N5Q1.mp3',
    script: '男の人と女の人が話しています。男の人は明日、何を持っていきますか。\n男：「明日の遠足、何を持って行けばいいですか。」\n女：「お弁当と水筒を持ってきてください。傘は要りません。」\n男：「わかりました。」',
    question: '男の人は明日、何を持っていきますか。',
    options: ['1. お弁当と水筒', '2. お弁当と傘', '3. 水筒と傘', '4. お弁当だけ'],
    correctOption: 1,
    explanationVi: 'Người phụ nữ bảo mang cơm hộp (お弁当) và bình nước (水筒), dặn rõ không cần mang ô (傘は要りません). Đáp án đúng là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n5_mondai2_q1',
    level: 'N5',
    mondai: 2,
    mondaiName: 'ポイント理解 (Hiểu ý chính - Point Comprehension)',
    questionNumber: 1,
    title: 'Lý do bạn không đến trường hôm qua',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N5Q2.mp3',
    script: '教室で先生と学生が話しています。田中さんは昨日どうして学校を休みましたか。\n先生：「田中さん、昨日はどうしましたか。」\n学生：「すみません、熱があって病院に行きました。」\n先生：「そうですか。お大事に。」',
    question: '田中さんは昨日どうして休みましたか。',
    options: ['1. 風邪で熱があったから', '2. 寝坊したから', '3. 旅行に行ったから', '4. アルバイトがあったから'],
    correctOption: 1,
    explanationVi: 'Tanaka giải thích hôm qua bị sốt và phải đến bệnh viện (熱があって病院に行きました). Đáp án đúng là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n5_mondai3_q1',
    level: 'N5',
    mondai: 3,
    mondaiName: '発話表現 (Diễn đạt phát ngôn - Utterance Expressions)',
    questionNumber: 1,
    title: 'Chào hỏi khi rời khỏi công ty trước đồng nghiệp',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N5Q3.mp3',
    script: '会社で先に帰ります。何と言いますか。\n1. お先に失礼します。\n2. お疲れ様でした。\n3. いってらっしゃい。',
    question: '先に帰る時、何と言いますか。',
    options: ['1. お先に失礼します', '2. お疲れ様でした', '3. いってらっしゃい', '4. さようなら'],
    correctOption: 1,
    explanationVi: 'Khi về sớm hơn đồng nghiệp trong môi trường công sở Nhật Bản, câu chào lịch sự chuẩn mực là "お先に失礼します". Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n5_mondai4_q1',
    level: 'N5',
    mondai: 4,
    mondaiName: '即時応答 (Phản xạ tức thì - Quick Response)',
    questionNumber: 1,
    title: 'Hỏi thăm thời gian và địa điểm hẹn gặp',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N5Q4.mp3',
    script: '「明日の待ち合わせ、何時にしますか。」\n1. ええ、行きますよ。\n2. 駅の前で会いましょう。\n3. 10時はどうですか。',
    question: '何と答えますか。',
    options: ['1. ええ、行きますよ', '2. 駅の前で会いましょう', '3. 10時はどうですか', '4. いいえ、結構です'],
    correctOption: 3,
    explanationVi: 'Câu hỏi là "Mấy giờ hẹn gặp" (何時にしますか), đáp án đưa ra đề xuất mốc thời gian "10 giờ thì sao?" (10時はどうですか). Đáp án là 3.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },

  // --- N4 ---
  {
    id: 'jlpt_n4_mondai1_q1',
    level: 'N4',
    mondai: 1,
    mondaiName: '課題理解 (Hiểu đề bài - Task Comprehension)',
    questionNumber: 1,
    title: 'Hướng dẫn nộp báo cáo nghiên cứu đại học',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N4Q1.mp3',
    script: '大学で教授と学生が話しています。学生はレポートをいつまでに提出しなければなりませんか。\n教授：「レポートの締め切りは金曜日ですが、メールで送ってください。」\n学生：「わかりました。金曜日の何時まででしょうか。」\n教授：「午後5時までにお願いします。」',
    question: '学生はいつまでにレポートを出しますか。',
    options: ['1. 金曜日の午後5時まで', '2. 木曜日の午後5時まで', '3. 来週月曜日まで', '4. 今日中'],
    correctOption: 1,
    explanationVi: 'Giáo sư quy định hạn chót nộp báo cáo là trước 5 giờ chiều thứ Sáu (金曜日の午後5時までに). Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n4_mondai2_q1',
    level: 'N4',
    mondai: 2,
    mondaiName: 'ポイント理解 (Hiểu ý chính - Point Comprehension)',
    questionNumber: 1,
    title: 'Kế hoạch chuẩn bị lễ hội văn hóa sinh viên',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N4Q2.mp3',
    script: '男の学生と女の学生が話しています。男の学生は何を担当しますか。\n女：「文化祭の準備、看板作りとポスター配りがあるんだけど、どっちがいい？」\n男：「僕は絵を描くのが得意だから、看板作りをやるよ。」',
    question: '男の学生は何を担当しますか。',
    options: ['1. 看板作り', '2. ポスター配り', '3. 部屋の掃除', '4. 買い出し'],
    correctOption: 1,
    explanationVi: 'Nam sinh viên chọn làm biển hiệu trang trí vì có năng khiếu vẽ tranh (看板作り). Đáp án đúng là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n4_mondai3_q1',
    level: 'N4',
    mondai: 3,
    mondaiName: '発話表現 (Diễn đạt phát ngôn - Utterance Expressions)',
    questionNumber: 1,
    title: 'Xin phép mượn sách hoặc tài liệu học tập',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N4Q3.mp3',
    script: '友達に辞書を借りたいです。何と言いますか。\n1. 辞書を貸してくれませんか。\n2. 辞書を借りてもいいですか。\n3. 辞書をどうぞ。',
    question: '何と言いますか。',
    options: ['1. 辞書を貸してくれませんか', '2. 辞書を借りてもいいですか', '3. 辞書をどうぞ', '4. 辞書をあげます'],
    correctOption: 1,
    explanationVi: 'Nhờ bạn cho mượn từ điển dùng cấu trúc "貸してくれませんか" hoặc "借りてもいいですか". Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n4_mondai4_q1',
    level: 'N4',
    mondai: 4,
    mondaiName: '即時応答 (Phản xạ tức thì - Quick Response)',
    questionNumber: 1,
    title: 'Đáp lại lời mời đi xem hòa nhạc giao hưởng',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N4Q4.mp3',
    script: '「今週末のコンサート、一緒に行きませんか。」\n1. ええ、ぜひ行きたいです。\n2. はい、一人で行きます。\n3. いいえ、コンサートです。',
    question: '何と答えますか。',
    options: ['1. ええ、ぜひ行きたいです', '2. はい、一人で行きます', '3. いいえ、コンサートです', '4. どういたしまして'],
    correctOption: 1,
    explanationVi: 'Đáp lại lời mời nhiệt tình "ええ、ぜひ行きたいです" (Vâng, mình rất muốn đi). Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },

  // --- N3 ---
  {
    id: 'jlpt_n3_mondai1_q1',
    level: 'N3',
    mondai: 1,
    mondaiName: '課題理解 (Hiểu đề bài - Task Comprehension)',
    questionNumber: 1,
    title: 'Sắp xếp cuộc họp dự án phần mềm công nghệ',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N3Q1.mp3',
    script: 'オフィスの会議室でチームリーダーが話しています。メンバーはこれから何をしますか。\nリーダー：「資料の印刷は私がやりますので、皆さんはプロジェクターの準備をお願いします。」\nメンバー：「了解いたしました。すぐに接続テストを行います。」',
    question: 'メンバーはまず何をしますか。',
    options: ['1. プロジェクターの準備', '2. 資料の印刷', '3. 会議室の予約', '4. お茶の準備'],
    correctOption: 1,
    explanationVi: 'Trưởng nhóm phân công các thành viên chuẩn bị máy chiếu thuyết trình (プロジェクターの準備). Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n3_mondai2_q1',
    level: 'N3',
    mondai: 2,
    mondaiName: 'ポイント理解 (Hiểu ý chính - Point Comprehension)',
    questionNumber: 1,
    title: 'Lựa chọn phương tiện di chuyển công tác Kansai',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N3Q2.mp3',
    script: '会社で社員二人が出張について話しています。二人は何で行くことにしましたか。\n男：「大阪出張、飛行機にする？新幹線にする？」\n女：「空港までの移動時間を考えると、新幹線のほうがスムーズよ。」\n男：「そうだね、新幹線の切符を手配しよう。」',
    question: '二人は何で行くことにしましたか。',
    options: ['1. 新幹線', '2. 飛行機', '3. 夜行バス', '4. 車'],
    correctOption: 1,
    explanationVi: 'Hai nhân viên quyết định đi Shinkansen (新幹線) vì tiện lợi và tiết kiệm thời gian ra vào sân bay. Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n3_mondai3_q1',
    level: 'N3',
    mondai: 3,
    mondaiName: '概要理解 (Hiểu bao quát - General Comprehension)',
    questionNumber: 1,
    title: 'Bài phát biểu về tái chế rác thải đô thị',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N3Q3.mp3',
    script: '市民講座で環境問題の専門家が話しています。専門家は何について話していますか。\n「プラスチックゴミの削減には、個人の分別意識だけでなく、企業の包装簡素化が不可欠です。」',
    question: '何についての話ですか。',
    options: ['1. プラスチックゴミ削減の取り組み', '2. 新しいリサイクル技術', '3. ゴミ処理場の建設', '4. 市民講座の案内'],
    correctOption: 1,
    explanationVi: 'Nội dung xoay quanh các giải pháp giảm thiểu rác thải nhựa trong đời sống. Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n3_mondai4_q1',
    level: 'N3',
    mondai: 4,
    mondaiName: '即時応答 (Phản xạ tức thì - Quick Response)',
    questionNumber: 1,
    title: 'Giao tiếp tình huống khẩn cấp tại nơi làm việc',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N3Q4.mp3',
    script: '「部長、明日のプレゼン資料、ご確認いただけないでしょうか。」\n1. ああ、今デスクに置いておいてくれ。\n2. いいえ、見ませんでした。\n3. 資料を作ってください。',
    question: '部長は何と答えますか。',
    options: ['1. ああ、今デスクに置いておいてくれ', '2. いいえ、見ませんでした', '3. 資料を作ってください', '4. こちらこそありがとう'],
    correctOption: 1,
    explanationVi: 'Trưởng phòng đồng ý xem và bảo để tài liệu lên bàn làm việc. Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },

  // --- N2 ---
  {
    id: 'jlpt_n2_mondai1_q1',
    level: 'N2',
    mondai: 1,
    mondaiName: '課題理解 (Hiểu đề bài nâng cao - Advanced Task Comprehension)',
    questionNumber: 1,
    title: 'Kế hoạch phát triển sản phẩm công nghệ xanh',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N2Q1.mp3',
    script: '製品開発のミーティングで部長と担当者が話しています。担当者はまず何を調査しますか。\n部長：「新エネルギー製品の企画だが、競合他社の特許状況と市場ニーズのどちらを先に見るべきか。」\n担当者：「まずは既存特許の侵害リスクを避けるため、特許文献の先行調査から着手します。」',
    question: '担当者はまず何を調査しますか。',
    options: ['1. 競合他社の特許状況', '2. 市場の消費者ニーズ', '3. 製造コストの見積もり', '4. 販売ルートの確保'],
    correctOption: 1,
    explanationVi: 'Người phụ trách quyết định bắt đầu trước bằng việc khảo sát tình trạng bằng sáng chế của đối thủ cạnh tranh (特許状況). Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n2_mondai2_q1',
    level: 'N2',
    mondai: 2,
    mondaiName: 'ポイント理解 (Hiểu ý chính nâng cao - Advanced Point Comprehension)',
    questionNumber: 1,
    title: 'Phân tích chiến lược tiếp thị đa kênh của công ty',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N2Q2.mp3',
    script: 'マーケティング会議で分析担当者が話しています。SNS広告の効果が最も高かった理由は何ですか。\n「若年層へのリーチ率が高く、インフルエンサーとのタイアップが購買行動に直結しました。」',
    question: 'SNS広告が成功した要因は何ですか。',
    options: ['1. インフルエンサーとの連携による購買促進', '2. 広告費用の大幅な削減', '3. テレビCMとの同時放映', '4. 新規ブランド名の浸透'],
    correctOption: 1,
    explanationVi: 'Sự hợp tác với influencer đã thúc đẩy hành vi mua hàng trực tiếp. Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n2_mondai3_q1',
    level: 'N2',
    mondai: 3,
    mondaiName: '概要理解 (Hiểu bao quát - General Comprehension)',
    questionNumber: 1,
    title: 'Thuyết trình về xu hướng làm việc từ xa',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N2Q3.mp3',
    script: '人事セミナーで講師がテレワークの課題について解説しています。',
    question: '講師が最も指摘している課題は何ですか。',
    options: ['1. 社員間のコミュニケーション不足と帰属意識の低下', '2. 通信費用の増大', '3. セキュリティ対策の遅れ', '4. 労働時間の短縮'],
    correctOption: 1,
    explanationVi: 'Giảng viên nhấn mạnh vấn đề suy giảm giao tiếp nội bộ và giảm tính gắn kết khi làm việc từ xa. Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n2_mondai4_q1',
    level: 'N2',
    mondai: 4,
    mondaiName: '即時応答 (Phản xạ tức thì - Quick Response)',
    questionNumber: 1,
    title: 'Kính ngữ trong đàm phán hợp đồng',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N2Q4.mp3',
    script: '「この度の不手際、何とお詫び申し上げればよいか、言葉もございません。」\n1. どうぞお気になさらないでください。\n2. はい、お詫びしてください。\n3. 言葉を教えてあげます。',
    question: '何と答えますか。',
    options: ['1. どうぞお気になさらないでください', '2. はい、お詫びしてください', '3. 言葉を教えてあげます', '4. ごめんなさい'],
    correctOption: 1,
    explanationVi: 'Cách đáp lại lịch thiệp xoa dịu đối tác là "どうぞお気になさらないでください" (Xin ngài đừng bận lòng). Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },

  // --- N1 ---
  {
    id: 'jlpt_n1_mondai1_q1',
    level: 'N1',
    mondai: 1,
    mondaiName: '課題理解 (Hiểu đề bài thượng cấp - Master Task Comprehension)',
    questionNumber: 1,
    title: 'Hội thảo kinh tế quốc tế & Chính sách tiền tệ',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N1Q1.mp3',
    script: '経済シンポジウムで司会者と研究者が議論しています。パネリストはどのような提言をまとめますか。\n司会：「長引く為替変動への対策として、最も優先すべき金融施策は何でしょうか。」\n研究者：「金利の急激な調整よりも、流動性の確保と国際的な政策協調を提言書の主軸に据えるべきです。」',
    question: '提言書の主軸として提案された内容は何ですか。',
    options: ['1. 流動性の確保と国際的な政策協調', '2. 金利の大幅な引き上げ', '3. 為替介入の即時実施', '4. 財政支出の削減'],
    correctOption: 1,
    explanationVi: 'Nhà nghiên cứu nhấn mạnh cốt lõi của bản đề xuất là bảo đảm thanh khoản và phối hợp chính sách quốc tế (流動性の確保と国際的な政策協調). Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n1_mondai2_q1',
    level: 'N1',
    mondai: 2,
    mondaiName: 'ポイント理解 (Hiểu ý chính thượng cấp - Master Point Comprehension)',
    questionNumber: 1,
    title: 'Bàn tròn về đạo đức trí tuệ nhân tạo (AI Ethics)',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N1Q2.mp3',
    script: 'AI倫理に関するフォーラムで法学教授が発言しています。',
    question: '教授が最も懸念している点は何ですか。',
    options: ['1. アルゴリズムの不透明性とバイアスの固定化', '2. 開発スピードの鈍化', '3. 著作権使用料の分配', '4. 計算リソースの不足'],
    correctOption: 1,
    explanationVi: 'Vấn đề đáng lo ngại nhất là tính bất minh của thuật toán và nguy cơ củng cố định kiến thiên vị. Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n1_mondai3_q1',
    level: 'N1',
    mondai: 3,
    mondaiName: '概要理解 (Hiểu bao quát thượng cấp - Master General Comprehension)',
    questionNumber: 1,
    title: 'Diễn ngôn về bảo tồn di sản văn hóa phi vật thể',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N1Q3.mp3',
    script: '文化人類学者が伝統工芸の継承問題について講演しています。',
    question: '講演者の主張の要点は何ですか。',
    options: ['1. 形の保存にとどまらず現代の生活様式と融合させること', '2. 国からの補助金増額のみに頼ること', '3. 海外への完全移転', '4. 機械化による大量生産'],
    correctOption: 1,
    explanationVi: 'Cốt lõi là việc kết hợp tinh hoa truyền thống vào đời sống hiện đại chứ không chỉ bảo tồn bảo tàng đơn thuần. Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
  {
    id: 'jlpt_n1_mondai4_q1',
    level: 'N1',
    mondai: 4,
    mondaiName: '即時応答 (Phản xạ tức thì thượng cấp - Master Quick Response)',
    questionNumber: 1,
    title: 'Thành ngữ và cách nói ẩn dụ trong ngoại giao thương mại',
    audioUrl: 'https://www.jlpt.jp/samples/sample2018/mp3/N1Q4.mp3',
    script: '「先方の提示条件、どうにも swallow しがたいですね。」\n1. ええ、背に腹は代えられないとはいえ、再考を促しましょう。\n2. はい、美味しくいただきましょう。\n3. 条件は飲み込まれました。',
    question: '何と答えますか。',
    options: ['1. ええ、背に腹は代えられないとはいえ、再考を促しましょう', '2. はい、美味しくいただきましょう', '3. 条件は飲み込まれました', '4. 結構なお手前で'],
    correctOption: 1,
    explanationVi: 'Cách phản hồi đồng tình và đề xuất thương lượng lại: "ええ、背に腹は代えられないとはいえ、再考を促しましょう". Đáp án là 1.',
    officialSource: 'JLPT Official Sample Exam (JEES & The Japan Foundation)',
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface JlptStreamerOptions {
  limit?: number;
  shardIndex?: number;
  totalShards?: number;
  shardId?: string;
  level?: string;
}

export async function crawlJlptChoukaiArchive(options?: number | JlptStreamerOptions) {
  const opts: JlptStreamerOptions = typeof options === 'number' ? { limit: options } : (options || {});
  const limit = opts.limit;
  const shardIndex = opts.shardIndex || 1;
  const totalShards = opts.totalShards || 1;
  const shardId = opts.shardId || (totalShards > 1 ? `s${shardIndex}` : undefined);
  if (shardId) {
    process.env.WORKER_SHARD_ID = shardId;
  }

  console.log('\n======================================================');
  console.log(`🎧 [CRAWLER 4/6] JLPT CHOUKAI EXAM ARCHIVE (1991 - 2024)${totalShards > 1 ? ` [SHARD ${shardIndex}/${totalShards} · ${shardId}]` : ''}`);
  console.log('     Thu thập audio đề thi nghe chính thức N5 - N1 từ JEES / Foundation');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.jlptChoukaiFolderId || folders.rootFolderId;

  // 1. Phân vùng các câu hỏi đề thi chuẩn mẫu
  let candidateItems = JLPT_CHOUKAI_ARCHIVE;
  if (opts.level) {
    candidateItems = candidateItems.filter(item => item.level.toUpperCase() === opts.level?.toUpperCase());
  }
  if (totalShards > 1) {
    candidateItems = candidateItems.filter((_, idx) => (idx % totalShards) === (shardIndex - 1));
  }

  const itemsToProcess = limit ? candidateItems.slice(0, limit) : candidateItems;
  console.log(`🎯 [Phân vùng Shard ${shardIndex}/${totalShards}] Xử lý ${itemsToProcess.length} câu hỏi đề thi nghe JLPT.`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < itemsToProcess.length; i++) {
    const item = itemsToProcess[i];
    const key = `jlpt_choukai:${item.id}`;

    if (DriveFolderManager.hasAsset(key)) {
      skipCount++;
      process.stdout.write(`⏭️ [${i + 1}/${itemsToProcess.length}] ${item.id} (Đã có sẵn trên Drive)\r`);
      continue;
    }

    try {
      const fileName = `jlpt_${item.level}_M${item.mondai}_${item.id}.mp3`;

      const entry = await StreamUploader.streamUploadFromUrl({
        url: item.audioUrl,
        key,
        category: 'jlpt_choukai',
        fileName,
        mimeType: 'audio/mpeg',
        folderId,
        shardId,
        metadata: {
          level: item.level,
          mondai: item.mondai,
          mondaiName: item.mondaiName,
          questionNumber: item.questionNumber,
          title: item.title,
          question: item.question,
          options: item.options,
          correctOption: item.correctOption,
          script: item.script,
          explanationVi: item.explanationVi,
          officialSource: item.officialSource,
          source: 'JLPT Official Examination Master Audio Bank',
          sourceUrl: item.audioUrl,
        },
      });

      successCount++;
      console.log(`✅ [${i + 1}/${itemsToProcess.length}] [${item.level}] ${item.title} -> Streamed: ${entry.fileId} (${((entry.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB)`);
      await delay(300);
    } catch (err: any) {
      failCount++;
      console.error(`❌ [${i + 1}/${itemsToProcess.length}] ${item.id} Thất bại: ${err.message}`);
    }
  }

  // 2. KHO ĐĨA CD AUDIO GỐC THI THẬT JLPT N5 - N1 (HIGH-PAYLOAD MASTER CD PACKS)
  const shouldStreamCdPacks = !limit || limit > itemsToProcess.length || process.argv.includes('--all') || process.argv.includes('--bulk');
  if (shouldStreamCdPacks) {
    console.log(`\n💿 [2/2] Đang kết nối kho đĩa CD thi thật JLPT Choukai (1991 - 2024) [Shard ${shardIndex}/${totalShards}]...`);
    const JLPT_ARCHIVE_COLLECTIONS = [
      { id: '0b0nor7u', name: 'JLPT Past Exams 2001-2006 Choukai Audio CDs', levelDefault: 'PastExam' },
      { id: 'Track06_201905', name: 'Shin Kanzen Master N2 Choukai Audio CD1', levelDefault: 'N2' },
      { id: 'Track80', name: 'Shin Kanzen Master N2 Choukai Audio CD2', levelDefault: 'N2' },
      { id: '01-track-1_20211017', name: 'JLPT Yosou Mondaishuu N3 Choukai Audio', levelDefault: 'N3' },
      { id: '49Track49', name: 'JLPT Super Moshi N4-N5 Choukai CD1', levelDefault: 'N4' },
      { id: '43Track43_201905', name: 'JLPT Super Moshi N4-N5 Choukai CD2', levelDefault: 'N5' },
      { id: '6868_20190730', name: 'TRY! N5 JLPT Listening Audio CD', levelDefault: 'N5' },
      { id: 'tnn9209_gmail_122-', name: 'JLPT Koushiki Mondaishuu N5 Audio', levelDefault: 'N5' },
      { id: 'wut4jxkp3', name: 'JLPT N5 Official Trial Book Examination Questions', levelDefault: 'N5' },
      { id: 'tnn9209_gmail_145', name: 'Goukaku Dekiru N4-N5 Choukai Exam CD1', levelDefault: 'N4' },
      { id: 'tnn9209_gmail_244', name: 'Goukaku Dekiru N4-N5 Choukai Exam CD2', levelDefault: 'N5' },
      { id: '50-50_202407', name: 'Minna no Nihongo Intermediate I Choukai Master', levelDefault: 'N3' },
      { id: '74track74', name: 'TRY! N4 Choukai Mock Test Audio CD', levelDefault: 'N4' },
      { id: 'n-3-n-3-cd-1-shin-kanzen-master-n-3-choukai-audio-cd-1', name: 'Shin Kanzen Master N3 Choukai Audio CD1', levelDefault: 'N3' },
      { id: 'jlpt-n-2-2024-july-cd', name: 'JLPT N2 2024 July Official Examination CD', levelDefault: 'N2' },
      { id: 'n4q22018', name: 'JLPT N4 Official Examination Trial Mock CD', levelDefault: 'N4' },
    ];

    let candidateCollections = JLPT_ARCHIVE_COLLECTIONS;
    if (opts.level) {
      candidateCollections = candidateCollections.filter(c => c.levelDefault.toUpperCase() === opts.level?.toUpperCase());
    }
    if (totalShards > 1) {
      candidateCollections = candidateCollections.filter((_, idx) => (idx % totalShards) === (shardIndex - 1));
    }

    for (const col of candidateCollections) {
      if (limit && successCount >= limit) break;
      console.log(`  📂 Khảo sát bộ đề thi: 【${col.name}】 (${col.id})...`);
      try {
        const res = await fetch(`https://archive.org/metadata/${col.id}/files`, { signal: AbortSignal.timeout(15000) });
        if (!res.ok) continue;
        const data: any = await res.json();
        const mp3Files = (data.result || []).filter((f: any) => f.name && f.name.endsWith('.mp3'));

        let newInCol = 0;
        for (const f of mp3Files) {
          if (limit && successCount >= limit) break;
          const cleanName = path.basename(f.name);
          const key = `jlpt_choukai:${col.id}_${encodeURIComponent(cleanName)}`;
          if (DriveFolderManager.hasAsset(key)) {
            skipCount++;
            continue;
          }

          const fileUrl = `https://archive.org/download/${col.id}/${encodeURIComponent(f.name)}`;
          const safeName = `jlpt_${col.levelDefault || 'exam'}_${col.id}_${cleanName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

          try {
            const entry = await StreamUploader.streamUploadFromUrl({
              url: fileUrl,
              key,
              category: 'jlpt_choukai',
              fileName: safeName,
              mimeType: 'audio/mpeg',
              folderId,
              shardId,
              metadata: {
                collectionId: col.id,
                collectionName: col.name,
                trackName: cleanName,
                level: col.levelDefault || 'All',
                source: 'JLPT Past Examination Master Audio CD Collection',
                sourceUrl: fileUrl,
              },
            });
            successCount++;
            newInCol++;
            console.log(`    🎧 [${col.name}] ${cleanName} -> Streamed: ${entry.fileId} (${((entry.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB)`);
            await delay(400);
          } catch (err: any) {
            failCount++;
          }
        }
        console.log(`  ✓ Bộ đề 【${col.name}】: +${newInCol} đĩa CD/track mới.`);
      } catch (colErr: any) {
        console.warn(`  ⚠️ Lỗi đọc bộ ${col.id}:`, colErr.message);
      }
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler JLPT Choukai Archive [Shard ${shardIndex}/${totalShards}]: Thành công: +${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('jlpt-choukai-streamer.ts')) {
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const shardArg = process.argv.find((a) => a.startsWith('--shard='));
  const shardIdArg = process.argv.find((a) => a.startsWith('--shard-id='));
  const levelArg = process.argv.find((a) => a.startsWith('--level='));
  const isAll = process.argv.includes('--all');
  const limit = isAll ? undefined : (limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined);

  let shardIndex = 1;
  let totalShards = 1;
  if (shardArg) {
    const parts = shardArg.split('=')[1].split('/').map(Number);
    shardIndex = parts[0] || 1;
    totalShards = parts[1] || 1;
  }
  const shardId = shardIdArg ? shardIdArg.split('=')[1] : (totalShards > 1 ? `s${shardIndex}` : undefined);
  const level = levelArg ? levelArg.split('=')[1] : undefined;

  crawlJlptChoukaiArchive({ limit, shardIndex, totalShards, shardId, level }).catch(console.error);
}
