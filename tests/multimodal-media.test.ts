import { describe, it, expect } from 'vitest';
import { MultimodalMediaService } from '../src/services/multimodal/media.service';
import { GET as getMediaRoute } from '../src/app/api/media/route';
import { StreamUploader } from '../scripts/crawlers/stream-uploader';
import { JLPT_CHOUKAI_ARCHIVE } from '../scripts/crawlers/jlpt-choukai-streamer';
import { OXFORD_CAMBRIDGE_ACADEMIC_WORDS, CAMBRIDGE_IELTS_EXAM_SECTIONS } from '../scripts/crawlers/cambridge-ielts-streamer';
import { BILINGUAL_MEDICAL_TERMINOLOGY } from '../scripts/crawlers/pubmed-jstage-streamer';
import { DriveFolderManager } from '../scripts/crawlers/drive-folder-manager';

describe('Multimodal Media Service & API Route', () => {
  it('should retrieve summary of multimodal assets', () => {
    const summary = MultimodalMediaService.getSummary();
    expect(summary).toBeDefined();
    expect(summary.totalAssets).toBeGreaterThanOrEqual(0);
    expect(summary.categories).toBeDefined();
  });

  it('should query /api/media?summary=true successfully', async () => {
    const req = new Request('http://localhost:3000/api/media?summary=true');
    const res = await getMediaRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.summary).toBeDefined();
    expect(typeof data.summary.totalAssets).toBe('number');
  });

  it('should query /api/media with kanji and word parameters', async () => {
    const req = new Request('http://localhost:3000/api/media?kanji=東&word=両親');
    const res = await getMediaRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it('should query /api/media with immersion parameter', async () => {
    const req = new Request('http://localhost:3000/api/media?immersion=こんにちは');
    const res = await getMediaRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.immersion).toBe('こんにちは');
  });

  it('should query /api/media with jlpt parameter', async () => {
    const req = new Request('http://localhost:3000/api/media?jlpt=jlpt_n5_mondai1_q1');
    const res = await getMediaRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.jlpt).toBe('jlpt_n5_mondai1_q1');
  });

  it('should query /api/media with ielts parameter', async () => {
    const req = new Request('http://localhost:3000/api/media?ielts=ubiquitous');
    const res = await getMediaRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.ielts).toBe('ubiquitous');
  });

  it('should query /api/media with pubmed parameter', async () => {
    const req = new Request('http://localhost:3000/api/media?pubmed=42391239');
    const res = await getMediaRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.pubmed).toBe('42391239');
  });

  it('should query /api/media with category parameter', async () => {
    const req = new Request('http://localhost:3000/api/media?category=kanji&limit=5');
    const res = await getMediaRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.category).toBe('kanji');
    expect(Array.isArray(data.items)).toBe(true);
  });

  it('should query /api/media with search / q parameter', async () => {
    const req = new Request('http://localhost:3000/api/media?q=kanji&limit=3');
    const res = await getMediaRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.query).toBe('kanji');
    expect(Array.isArray(data.items)).toBe(true);
  });

  it('should verify JLPT items link to official Japanese audio, rejecting dummy audio', () => {
    expect(JLPT_CHOUKAI_ARCHIVE.length).toBeGreaterThanOrEqual(6);
    for (const item of JLPT_CHOUKAI_ARCHIVE) {
      // Bắt buộc trỏ vào nguồn nghe thi chính thức của Foundation/JEES (chứa jlpt.jp)
      expect(item.audioUrl).toContain('jlpt.jp');
      expect(item.audioUrl).not.toContain('1051833'); // Tuyệt đối không dùng audio Thổ Nhĩ Kỳ dummy
      expect(item.options.length).toBeGreaterThanOrEqual(4);
      expect(item.script.length).toBeGreaterThan(10);
    }
  });

  it('should verify Oxford / Cambridge academic audio tracks and practice sections', () => {
    expect(OXFORD_CAMBRIDGE_ACADEMIC_WORDS.length).toBeGreaterThanOrEqual(30);
    expect(CAMBRIDGE_IELTS_EXAM_SECTIONS.length).toBe(4);
    for (const sec of CAMBRIDGE_IELTS_EXAM_SECTIONS) {
      expect(sec.audioUrl).toContain('ssl.gstatic.com/dictionary/static/sounds/oxford');
      expect(sec.transcript.length).toBeGreaterThan(20);
    }
  });

  it('should verify J-STAGE & MeSH bilingual medical terminology definitions', () => {
    expect(BILINGUAL_MEDICAL_TERMINOLOGY.length).toBeGreaterThanOrEqual(10);
    const dementia = BILINGUAL_MEDICAL_TERMINOLOGY.find(t => t.termJp === '認知症');
    expect(dementia).toBeDefined();
    expect(dementia?.termEn).toBe('Dementia');
  });

  it('should export StreamUploader with concurrency queue support', () => {
    expect(StreamUploader).toBeDefined();
    expect(typeof StreamUploader.streamUploadFromUrl).toBe('function');
    expect(typeof StreamUploader.mapConcurrent).toBe('function');
  });

  it('should test atomic manifest operations and removeAsset', () => {
    const testKey = 'test_unit_key_temp';
    DriveFolderManager.removeAsset(testKey); // Clean start
    const manifest = DriveFolderManager.getManifest(true);
    expect(manifest.assets[testKey]).toBeUndefined();
  });

  it('should verify partitioned manifest isolation and aggregation across domains', () => {
    DriveFolderManager.initPartitionManifests();
    const vocabPartition = DriveFolderManager.getPartition('vocab_audio');
    expect(vocabPartition).toBeDefined();
    expect(vocabPartition.category).toBe('vocab_audio');

    const ieltsPartition = DriveFolderManager.getPartition('ielts_audio');
    expect(ieltsPartition).toBeDefined();
    expect(ieltsPartition.category).toBe('ielts_audio');

    // Aggregate manifests
    const aggregated = DriveFolderManager.aggregateManifests();
    expect(aggregated.totalAssets).toBeGreaterThanOrEqual(vocabPartition.totalAssets);
    expect(aggregated.categories.vocab_audio).toBe(vocabPartition.totalAssets);
  });
});

