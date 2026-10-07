import { DriveFolderManager } from './drive-folder-manager';
import { StreamUploader } from './stream-uploader';
import { EXPANDED_IMMERSION_TOPICS } from './seed-lexicon';

export interface ImmersionScenario {
  keyword: string;
  topic: string;
  level: string;
  register: 'Kudaketa (Thân mật)' | 'Teineigo (Lịch sự)' | 'Sonkeigo/Kenjougo (Kính ngữ)';
  situation: string;
}

export const BASE_IMMERSION_SCENARIOS: ImmersionScenario[] = [
  { keyword: 'こんにちは', topic: 'Chào hỏi hàng ngày (Daily Greetings)', level: 'N5', register: 'Teineigo (Lịch sự)', situation: 'Gặp gỡ đồng nghiệp vào buổi trưa tại văn phòng' },
  { keyword: 'ありがとう', topic: 'Cảm ơn và xã giao (Gratitude)', level: 'N5', register: 'Teineigo (Lịch sự)', situation: 'Cảm ơn khi được đồng nghiệp giúp đỡ hoàn thành dự án' },
  { keyword: 'すみません', topic: 'Gọi phục vụ quán ăn (Ordering/Excuse me)', level: 'N5', register: 'Teineigo (Lịch sự)', situation: 'Gọi nhân viên quán mì ramen để gọi thêm trứng ngâm vị' },
  { keyword: '駅', topic: 'Hỏi đường ở nhà ga Tokyo (Tokyo Station Navigation)', level: 'N5', register: 'Teineigo (Lịch sự)', situation: 'Hỏi nhân viên đường ray đi tàu tuyến Yamanote' },
  { keyword: '電車', topic: 'Đi tàu điện ngầm Yamanote (Subway Commuting)', level: 'N5', register: 'Teineigo (Lịch sự)', situation: 'Thông báo trên tàu về việc sắp đến ga Akihabara' },
  { keyword: 'ご飯', topic: 'Bữa ăn gia đình Nhật Bản (Japanese Dining)', level: 'N5', register: 'Kudaketa (Thân mật)', situation: 'Gia đình quây quần thưởng thức bữa tối và mời cơm Itadakimasu' },
  { keyword: '勉強', topic: 'Học tập tại trường đại học (Campus Study)', level: 'N5', register: 'Teineigo (Lịch sự)', situation: 'Thảo luận với bạn cùng lớp về bài thi tiếng Nhật tuần tới' },
  { keyword: '友達', topic: 'Trò chuyện bạn bè thân thiết (Friendship)', level: 'N5', register: 'Kudaketa (Thân mật)', situation: 'Hẹn bạn đi uống trà sữa và xem phim hoạt hình cuối tuần' },
  { keyword: '仕事', topic: 'Giao tiếp công sở công ty Nhật (Business Office)', level: 'N4', register: 'Teineigo (Lịch sự)', situation: 'Báo cáo tiến độ hoàn thành công việc cho trưởng nhóm' },
  { keyword: '天気', topic: 'Dự báo thời tiết & Mùa hoa anh đào (Weather)', level: 'N5', register: 'Teineigo (Lịch sự)', situation: 'Bản tin dự báo thời tiết Tokyo trời nắng đẹp thích hợp ngắm hoa' },
  { keyword: '病院', topic: 'Khám bệnh và mua thuốc (Hospital & Pharmacy)', level: 'N4', register: 'Teineigo (Lịch sự)', situation: 'Mô tả triệu chứng đau đầu sốt nhẹ cho bác sĩ tại phòng khám' },
  { keyword: '買い物', topic: 'Mua sắm tại siêu thị & Konbini (Shopping)', level: 'N5', register: 'Teineigo (Lịch sự)', situation: 'Thanh toán tại quầy tính tiền cửa hàng tiện lợi 7-Eleven' },
  { keyword: '旅行', topic: 'Du lịch Kyoto & Onsen suối nước nóng (Travel)', level: 'N4', register: 'Teineigo (Lịch sự)', situation: 'Hỏi lễ tân khách sạn về hướng đi đền Fushimi Inari' },
  { keyword: '電話', topic: 'Nghe gọi điện thoại tiếng Nhật (Phone Manners)', level: 'N4', register: 'Sonkeigo/Kenjougo (Kính ngữ)', situation: 'Tiếp nhận cuộc gọi đối tác kinh doanh gọi đến công ty' },
  { keyword: '予約', topic: 'Đặt chỗ nhà hàng & khách sạn (Reservations)', level: 'N4', register: 'Teineigo (Lịch sự)', situation: 'Đặt bàn ăn 4 người cho buổi liên hoan tối thứ Sáu' },
  { keyword: 'コンビニ', topic: 'Mua đồ ăn nhanh tại Konbini (Convenience Store)', level: 'N5', register: 'Teineigo (Lịch sự)', situation: 'Nhờ nhân viên hâm nóng hộp cơm bento và từ chối túi nilon' },
  { keyword: '居酒屋', topic: 'Đi nhậu quán Izakaya (After-work Izakaya)', level: 'N4', register: 'Kudaketa (Thân mật)', situation: 'Nâng ly chúc mừng Kanpai cùng đồng nghiệp sau giờ làm' },
  { keyword: 'ラーメン', topic: 'Gọi món tại tiệm mì Ramen (Ordering Ramen)', level: 'N5', register: 'Teineigo (Lịch sự)', situation: 'Chọn độ đậm của nước súp Tonkotsu và độ cứng của sợi mì' },
  { keyword: '不動産', topic: 'Thuê nhà trọ tại Tokyo (Apartment Renting)', level: 'N3', register: 'Sonkeigo/Kenjougo (Kính ngữ)', situation: 'Thảo luận với môi giới bất động sản về tiền đặt cọc và hợp đồng' },
  { keyword: '面接', topic: 'Phỏng vấn xin việc công ty Nhật (Job Interview)', level: 'N3', register: 'Sonkeigo/Kenjougo (Kính ngữ)', situation: 'Giới thiệu bản thân và nêu lý do ứng tuyển vị trí kỹ sư' },
];

// Hợp nhất toàn bộ kịch bản từ cơ bản đến mở rộng nâng cao
export const IMMERSION_SCENARIOS: ImmersionScenario[] = [
  ...BASE_IMMERSION_SCENARIOS,
  ...EXPANDED_IMMERSION_TOPICS.map((e) => ({
    keyword: e.keyword,
    topic: e.topic,
    level: e.level,
    register: 'Teineigo (Lịch sự)' as const,
    situation: e.situation,
  })),
];

async function fetchImmersionSentences(keyword: string, page = 1): Promise<any[]> {
  const url = `https://tatoeba.org/en/api_v0/search?from=jpn&query=${encodeURIComponent(keyword)}&has_audio=yes&sort=relevance&page=${page}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KiokudoSRS/1.0 (Japanese Spaced Repetition Platform; Immersion Engine)',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return [];
    const data: any = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function crawlImmersionSentenceClips(limit?: number) {
  console.log('\n======================================================');
  console.log('🎬 [CRAWLER 3/6] ANIME & IMMERSION SPLICED SENTENCE MINING CLIPS');
  console.log('     Thu thập clip thoại ngữ cảnh i+1 có phụ đề song ngữ');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.immersionClipsFolderId || folders.rootFolderId;
  const manifest = DriveFolderManager.getManifest(true);

  // Loại bỏ các kịch bản trùng lặp keyword
  const scenarioMap = new Map<string, ImmersionScenario>();
  for (const s of IMMERSION_SCENARIOS) {
    if (!scenarioMap.has(s.keyword)) {
      scenarioMap.set(s.keyword, s);
    }
  }

  const allScenarios = Array.from(scenarioMap.values());
  const scenariosToRun = limit ? allScenarios.slice(0, limit) : allScenarios;
  console.log(`🎯 Đang xử lý ${scenariosToRun.length} kịch bản giao tiếp đời sống thực tế.`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < scenariosToRun.length; i++) {
    const scenario = scenariosToRun[i];

    try {
      // Tìm câu thoại trên Tatoeba có audio
      const sentences = await fetchImmersionSentences(scenario.keyword, 1);
      const audioSentences = sentences.filter((s) => s.audios && s.audios.length > 0);

      if (audioSentences.length === 0) {
        skipCount++;
        continue;
      }

      // Mỗi kịch bản lấy tối đa 2 câu thoại bản xứ phong phú
      const targetSentences = audioSentences.slice(0, 2);

      for (let sIdx = 0; sIdx < targetSentences.length; sIdx++) {
        const validSentence = targetSentences[sIdx];
        const audio = validSentence.audios[0];
        const key = sIdx === 0
          ? `immersion_clip:${scenario.keyword}`
          : `immersion_clip:${scenario.keyword}_${validSentence.id}`;

        const partition = DriveFolderManager.getPartition('immersion_clip');
        if (partition.assets[key]) {
          skipCount++;
          continue;
        }

        const audioUrl = `https://tatoeba.org/en/audio/download/${audio.id}`;
        const fileName = `immersion_${scenario.level}_${audio.id}_${encodeURIComponent(scenario.keyword).replace(/%/g, '_')}.mp3`;

        // Lấy bản dịch song ngữ
        let enTranslation = '';
        let viTranslation = '';
        if (validSentence.translations) {
          for (const group of validSentence.translations) {
            for (const t of group) {
              if (t.lang === 'eng' && !enTranslation) enTranslation = t.text;
              if (t.lang === 'vie' && !viTranslation) viTranslation = t.text;
            }
          }
        }

        const entry = await StreamUploader.streamUploadFromUrl({
          url: audioUrl,
          key,
          category: 'immersion_clip',
          fileName,
          mimeType: 'audio/mpeg',
          folderId,
          metadata: {
            keyword: scenario.keyword,
            topic: scenario.topic,
            level: scenario.level,
            register: scenario.register,
            situation: scenario.situation,
            japanese: validSentence.text,
            translationVi: viTranslation || enTranslation,
            translationEn: enTranslation,
            speaker: audio.author || 'Native Japanese Tokyo Speaker',
            tatoebaSentenceId: validSentence.id,
            tatoebaAudioId: audio.id,
            subtitlesSync: [
              {
                start: 0.0,
                end: 4.2,
                text: validSentence.text,
                vi: viTranslation || enTranslation,
                en: enTranslation,
              },
            ],
            source: 'Immersion Sentence Mining Master Corpus',
            sourceUrl: audioUrl,
          },
        });

        successCount++;
        console.log(`✅ [${i + 1}/${scenariosToRun.length}] [${scenario.level}] ${scenario.keyword} (#${validSentence.id}) -> "${validSentence.text}" (${entry.fileId})`);
        await delay(300);
      }
    } catch (err: any) {
      failCount++;
      console.error(`❌ [${i + 1}/${scenariosToRun.length}] ${scenario.keyword} Thất bại: ${err.message}`);
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler Immersion Clips: Thành công: +${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
}

if (process.argv[1]?.endsWith('immersion-clips-streamer.ts')) {
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const isAll = process.argv.includes('--all');
  const limit = isAll ? undefined : (limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined);
  crawlImmersionSentenceClips(limit).catch(console.error);
}
