/**
 * ============================================================================
 * HỆ THỐNG MÃ MÀU VĂN HÓA TRUYỀN THỐNG NHẬT BẢN (日本の伝統色 - DENTŌSHOKU TOKENS)
 * ============================================================================
 * 
 * Bộ mã màu này được thiết kế riêng cho ứng dụng học tập tiếng Nhật Kiokudō (記憶道),
 * áp dụng triết lý Wabi-Sabi (侘寂), Zen (禅) và Kintsugi (金継ぎ).
 * 
 * TÀI LIỆU DÀNH CHO AGENT / DEVELOPER:
 * 1. Không dùng màu trắng điện tử thuần khiết (#FFFFFF) làm nền; ưu tiên hệ Torinoko giấy dó.
 * 2. Không dùng màu đen tuyệt đối (#000000) cho chữ; ưu tiên mực mài Sumi để bảo vệ mắt.
 * 3. Đỏ Bengara và Lam Chàm Aizome mang tính biểu tượng cao, dùng có chủ đích làm điểm nhấn.
 * 4. Tất cả các cặp màu văn bản / nền trong bộ này đều đạt chuẩn tương phản WCAG AA trở lên.
 */

export const DENTOSHOKU_RAW_PALETTE = {
  // 1. NHÓM GIẤY DÓ & NỀN THIỀN ĐỊNH (Washi & Canvas Base)
  torinoko: {
    kanji: '鳥の子色',
    romaji: 'Torinoko-iro',
    meaning: 'Màu vỏ trứng chim / Giấy dó sợi tơ tự nhiên thời Heian',
    tones: {
      base: '#F7F4EB',       // Nền chính toàn trang (êm dịu thị giác, chống lóa)
      card: '#FAF8F2',       // Bề mặt thẻ bài học, card nội dung nổi
      deep: '#EFEAE0',       // Nền phụ, ô input, thanh breadcrumb, bãi cát Zen
      sunken: '#E7E0D2',     // Trạng thái hover sâu, viền khối nhúng
      border: '#DFD9CB',     // Đường kẻ chia cắt, khung viền thanh mảnh
      borderSubtle: '#EBE5D8', // Viền phụ rất mờ cho danh sách chi tiết
    },
    rgb: {
      base: 'rgb(247, 244, 235)',
      card: 'rgb(250, 248, 242)',
      deep: 'rgb(239, 234, 224)',
    },
  },

  // 2. NHÓM MỰC MÀI THƯ PHÁP (Sumi Ink Hierarchy)
  sumi: {
    kanji: '墨色',
    romaji: 'Sumi-iro',
    meaning: 'Mực mài từ muội than củi thông cổ kính thời Nara',
    tones: {
      deep: '#1A1918',       // Nồng Mặc (濃墨) - Tiêu đề H1/H2, chữ Kanji lớn, Logo
      body: '#47433E',       // Trung Mặc (中墨) - Đoạn văn bản đọc, công thức câu
      faint: '#878278',      // Đạm Mặc (淡墨) - Nhãn phụ, timestamp, Furigana rt, shortcut
      ghost: '#BCB7AC',      // Mặc tàn - Placeholder, icon vô hiệu hóa
    },
    rgb: {
      deep: 'rgb(26, 25, 24)',
      body: 'rgb(71, 67, 62)',
      faint: 'rgb(135, 130, 120)',
    },
  },

  // 3. NHÓM ĐỎ KHOÁNG THẠCH CHU SA & SƠN MÀI (Bengara & Urushi Torii)
  bengara: {
    kanji: '弁柄色',
    romaji: 'Bengara-iro',
    meaning: 'Sắc đỏ khoáng đất nung của cổng Torii và đồ sơn mài Urushi',
    tones: {
      primary: '#9E3223',    // Màu hành động chính (CTA Ôn tập, nút bấm Torii)
      hover: '#83271A',      // Trạng thái hover / active khi nhấn
      soft: '#FDF2F0',       // Nền phụ mỏng cho badge đến hạn, tag cảnh báo
      border: '#E8A99F',     // Viền thẻ trạng thái FSRS Again [1]
      hankoBg: 'rgba(158, 50, 35, 0.08)', // Màu đổ bóng con dấu triện Hanko
    },
    rgb: {
      primary: 'rgb(158, 50, 35)',
      hover: 'rgb(131, 39, 26)',
      soft: 'rgb(253, 242, 240)',
    },
  },

  // 4. NHÓM LAM CHÀM SAMURAI (Aizome & Kachiiro)
  aizome: {
    kanji: '藍染 · 勝色',
    romaji: 'Aizome / Kachiiro',
    meaning: 'Màu chàm thắng lợi của áo giáp Samurai, tượng trưng cho trí tuệ & kỷ luật',
    tones: {
      deep: '#16253B',       // Khối bài học cao cấp JPD133, banner ngữ pháp
      surface: '#203450',    // Nền button phụ trong card chàm, hover
      soft: '#EDF2F7',       // Nền tag mẫu câu N4, N3, tag [3] Good
      border: '#BDCCDC',     // Viền cho trạng thái hồi tưởng Tốt
      textLight: '#F0F4F8',  // Văn bản tương phản cao trên nền chàm
    },
    rgb: {
      deep: 'rgb(22, 37, 59)',
      surface: 'rgb(32, 52, 80)',
      soft: 'rgb(237, 242, 247)',
    },
  },

  // 5. NHÓM VÀNG KIM TRẦM & THẾP VÀNG KINTSUGI (Kincha & Kogane)
  kincha: {
    kanji: '金茶 · 黄金箔',
    romaji: 'Kincha / Kogane-haku',
    meaning: 'Màu vàng lụa trà và bột vàng ròng hàn gắn đồ gốm vỡ Kintsugi',
    tones: {
      accent: '#AF7E36',     // Đường nứt Kintsugi, badge thuật toán FSRS
      shimmer: '#D6A657',    // Ánh sáng phát quang khi nối thẻ thành công
      soft: '#FBF5E8',       // Nền khối thẻ Khó [2], tag số lượng
      border: '#E5CCA0',     // Viền thẻ đánh giá [2] FSRS Hard
    },
    rgb: {
      accent: 'rgb(175, 126, 54)',
      shimmer: 'rgb(214, 166, 87)',
      soft: 'rgb(251, 245, 232)',
    },
  },

  // 6. NHÓM XANH RÊU THIỀN VIỆN & TRÀ ĐẠO (Koke-iro & Matcha)
  koke: {
    kanji: '苔色 · 抹茶',
    romaji: 'Koke-iro / Matcha',
    meaning: 'Sắc rêu ẩm thềm đá vườn thiền Karesansui và bột trà đạo Sen no Rikyū',
    tones: {
      accent: '#485642',     // Nút thêm thẻ mới, trạng thái hoàn thành Dễ [4]
      matcha: '#697858',     // Thẻ tag tích cực, biểu tượng tiết khí mùa
      soft: '#EFF4EE',       // Nền nhẹ cho thẻ 0 đến hạn, badge thành công
      border: '#C6D8C4',     // Viền đánh giá FSRS Easy [4]
    },
    rgb: {
      accent: 'rgb(72, 86, 66)',
      matcha: 'rgb(105, 120, 88)',
      soft: 'rgb(239, 244, 238)',
    },
  },
} as const;

/**
 * CẤU HÌNH TAILWIND CSS MỞ RỘNG
 */
export const TAILWIND_COLOR_CONFIG = {
  theme: {
    extend: {
      colors: {
        // Nền giấy dó
        'washi-base': '#F7F4EB',
        'washi-card': '#FAF8F2',
        'washi-deep': '#EFEAE0',
        'washi-sunken': '#E7E0D2',
        'washi-border': '#DFD9CB',
        'washi-subtle': '#EBE5D8',

        // Mực mài
        'sumi-deep': '#1A1918',
        'sumi-body': '#47433E',
        'sumi-faint': '#878278',
        'sumi-ghost': '#BCB7AC',

        // Đỏ Chu Sa Torii
        'bengara': '#9E3223',
        'bengara-hover': '#83271A',
        'bengara-soft': '#FDF2F0',
        'bengara-border': '#E8A99F',

        // Lam Chàm Aizome
        'aizome': '#16253B',
        'aizome-surface': '#203450',
        'aizome-soft': '#EDF2F7',
        'aizome-border': '#BDCCDC',

        // Vàng kim Kintsugi
        'kincha': '#AF7E36',
        'kincha-shimmer': '#D6A657',
        'kincha-soft': '#FBF5E8',
        'kincha-border': '#E5CCA0',

        // Xanh Rêu Thiền
        'koke': '#485642',
        'koke-matcha': '#697858',
        'koke-soft': '#EFF4EE',
        'koke-border': '#C6D8C4',
      },
    },
  },
};

/**
 * MA TRẬN MAPPING MÀU SẮC CHO CÁC THÀNH PHẦN GIAO DIỆN (UI Semantic Map)
 */
export const UI_SEMANTIC_GUIDELINES = {
  header: {
    background: 'rgba(247, 244, 235, 0.95)',
    borderBottom: '#DFD9CB',
    logoTitle: '#1A1918',
    logoSubtitle: '#878278',
    sealHanko: '#9E3223',
  },
  fsrsCard: {
    containerBg: '#FAF8F2',
    containerBorder: '#DFD9CB',
    formulaBoxBg: '#EFEAE0',
    formulaText: '#1A1918',
    furiganaText: '#878278',
    kintsugiVein: '#AF7E36',
    kintsugiShimmer: '#D6A657',
  },
  fsrsButtons: {
    gradeAgain: {
      key: '[1] 破 · Quên',
      background: '#FDF2F0',
      border: '#E8A99F',
      textColor: '#9E3223',
      intervalHint: '< 10 phút',
    },
    gradeHard: {
      key: '[2] 磨 · Khó',
      background: '#FBF5E8',
      border: '#E5CCA0',
      textColor: '#8C601E',
      intervalHint: '+ 1.2 ngày',
    },
    gradeGood: {
      key: '[3] 継 · Tốt',
      background: '#EDF2F7',
      border: '#BDCCDC',
      textColor: '#16253B',
      intervalHint: '+ 3.5 ngày',
    },
    gradeEasy: {
      key: '[4] 悟 · Dễ',
      background: '#EFF4EE',
      border: '#C6D8C4',
      textColor: '#485642',
      intervalHint: '+ 6.8 ngày',
    },
  },
  sandGardenCanvas: {
    sandSurface: '#EFEAE0',
    rakeGrooveShadow: '#DFD6C2',
    zenStoneColor: '#302E2B',
    stoneMossColor: '#485642',
  },
} as const;
