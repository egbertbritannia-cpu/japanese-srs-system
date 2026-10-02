/**
 * (Giai đoạn 2) Kanji Decomposer
 * Tách thành tố biểu ý (Semantic component) và thành tố biểu âm (Phonetic component - chữ Hình thanh / 形声文字)
 * Giúp người học ghi nhớ chữ Hán dựa trên cấu tạo chữ và cách phát âm Onyomi có hệ thống.
 */

export interface KanjiDecomposition {
  character: string;
  semanticComponent?: {
    radical: string;
    meaning: string;
  };
  phoneticComponent?: {
    component: string;
    reading: string;
  };
  classification: 'Keisei' | 'Shoukei' | 'Shiji' | 'Kaii'; // Hình thanh, Tượng hình, Chỉ sự, Hội ý
}

export class KanjiDecomposer {
  /**
   * Phân rã chữ Kanji thành các thành phần nguồn gốc (Naritachi)
   */
  static decompose(kanji: string): KanjiDecomposition {
    // Demo phân tích chữ Hán Hình thanh (ví dụ chữ 清 gồm bộ Thủy 氵 biểu ý và chữ 青 biểu âm せい)
    return {
      character: kanji,
      semanticComponent: {
        radical: '氵',
        meaning: 'Nước / Chất lỏng',
      },
      phoneticComponent: {
        component: '青',
        reading: 'セイ (sei)',
      },
      classification: 'Keisei',
    };
  }
}
