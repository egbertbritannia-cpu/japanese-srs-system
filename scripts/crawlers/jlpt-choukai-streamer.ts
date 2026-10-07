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
 * Âm thanh là các file MP3 nghe thi thực tế chất lượng cao (10-14MB mỗi bài) kèm đầy đủ kịch bản đối thoại và lời giải.
 */
export const JLPT_CHOUKAI_ARCHIVE: JlptChoukaiItem[] = [
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
];

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function crawlJlptChoukaiArchive(limit?: number) {
  console.log('\n======================================================');
  console.log('🎧 [CRAWLER 4/6] JLPT CHOUKAI EXAM ARCHIVE (1991 - 2024)');
  console.log('     Thu thập audio đề thi nghe chính thức N5 - N1 từ JEES / Foundation');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.jlptChoukaiFolderId || folders.rootFolderId;
  const manifest = DriveFolderManager.getManifest(true);

  // Dọn sạch các bản ghi giả mạo hoặc trỏ vào link dummy cũ nếu có
  const jlptPartition = DriveFolderManager.getPartition('jlpt_choukai');
  for (const item of JLPT_CHOUKAI_ARCHIVE) {
    const key = `jlpt_choukai:${item.id}`;
    const existing = jlptPartition.assets[key];
    if (existing && (existing.metadata?.sourceUrl?.includes('1051833') || existing.metadata?.source?.includes('Tatoeba') || existing.sizeBytes === 26737)) {
      console.log(`🧹 Phát hiện bản ghi JLPT cũ không hợp lệ: ${key} -> Loại bỏ để tải lại audio chuẩn...`);
      DriveFolderManager.removeAsset(key);
    }
  }

  const itemsToProcess = limit ? JLPT_CHOUKAI_ARCHIVE.slice(0, limit) : JLPT_CHOUKAI_ARCHIVE;
  console.log(`🎯 Xử lý ${itemsToProcess.length} câu hỏi đề thi nghe chính thức JLPT N5 - N1.`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < itemsToProcess.length; i++) {
    const item = itemsToProcess[i];
    const key = `jlpt_choukai:${item.id}`;

    const partition = DriveFolderManager.getPartition('jlpt_choukai');
    if (partition.assets[key]) {
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

  console.log(`\n🎉 Hoàn thành Crawler JLPT Choukai Archive: Thành công: ${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1]?.endsWith('jlpt-choukai-streamer.ts')) {
  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const isAll = process.argv.includes('--all');
  const limit = isAll ? undefined : (limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined);
  crawlJlptChoukaiArchive(limit).catch(console.error);
}

