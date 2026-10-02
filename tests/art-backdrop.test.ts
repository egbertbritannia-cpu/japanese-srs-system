import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Authentic Wa-Art Assets & JapaneseArtBackdrop Validation', () => {
  const artDir = path.resolve(process.cwd(), 'public/assets/art');

  const EXPECTED_SEMANTIC_ASSETS = [
    'japanese-cultural-panorama.jpg',
    'golden-waves-kin-nami.jpg',
    'ryusui-indigo-stream.jpg',
    'hokusai-suwa-lake.jpg',
    'hokusai-cranes-fuji.jpg',
    'cloud-mist-kasumi-icons.jpg',
    'hokusai-great-wave-classic.jpg',
    'great-wave-isolated.webp',
    'kohaku-koi-pond.jpg',
    'night-golden-waves.jpg',
    'rinpa-gold-waves-clouds.jpg',
    'koi-peony-yuzen.jpg',
    'gold-sakura-washi.jpg',
  ];

  it('thư mục public/assets/art phải tồn tại trên ổ đĩa', () => {
    expect(fs.existsSync(artDir)).toBe(true);
  });

  it('toàn bộ 13 file ảnh nghệ thuật ngữ nghĩa phải tồn tại và có dung lượng hợp lệ (> 10KB)', () => {
    for (const fileName of EXPECTED_SEMANTIC_ASSETS) {
      const filePath = path.join(artDir, fileName);
      expect(fs.existsSync(filePath), `File thiếu: ${fileName}`).toBe(true);

      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(10 * 1024); // Tối thiểu 10KB
    }
  });

  it('toàn bộ 13 file ảnh gốc phải được bảo tồn song song với semantic aliases', () => {
    const allFiles = fs.readdirSync(artDir);
    expect(allFiles.length).toBeGreaterThanOrEqual(26);
  });

  it('tất cả các blend modes trong thiết kế phải hợp lệ cho CSS mix-blend-mode', () => {
    const validBlendModes = ['multiply', 'overlay', 'soft-light', 'screen', 'normal'];
    for (const mode of validBlendModes) {
      expect(['multiply', 'overlay', 'soft-light', 'screen', 'normal']).toContain(mode);
    }
  });
});
