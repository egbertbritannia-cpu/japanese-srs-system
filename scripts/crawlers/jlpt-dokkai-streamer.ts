import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim();
      process.env[k] = v;
    }
  }
}

import { DriveFolderManager } from './drive-folder-manager';
import { StreamUploader } from './stream-uploader';

interface DokkaiSource {
  id: string;
  name: string;
  category: 'jsquad' | 'jcommonsenseqa' | 'jnli' | 'jsts' | 'jcola';
  level: string;
  url: string;
  description: string;
}

const DOKKAI_DATASETS: DokkaiSource[] = [
  // 1. JSQuAD (Japanese Question Answering Dataset - Reading Comprehension)
  {
    id: 'jsquad_v1_2_train',
    name: 'JSQuAD v1.2 Master Train Set (Univ of Tokyo & RIKEN)',
    category: 'jsquad',
    level: 'N3-N1',
    url: 'https://raw.githubusercontent.com/yahoojapan/JGLUE/refs/tags/v1.2.0/datasets/jsquad-v1.2/train-v1.2.json',
    description: 'Kho đọc hiểu bài thi chuẩn SQuAD tiếng Nhật: ~32,000 cặp đoạn văn và câu hỏi đọc hiểu sâu',
  },
  {
    id: 'jsquad_v1_2_valid',
    name: 'JSQuAD v1.2 Official Validation Set',
    category: 'jsquad',
    level: 'N3-N1',
    url: 'https://raw.githubusercontent.com/yahoojapan/JGLUE/refs/tags/v1.2.0/datasets/jsquad-v1.2/valid-v1.2.json',
    description: 'Tập kiểm định đọc hiểu JLPT Dokkai: ~4,500 câu hỏi kèm vị trí từ khóa trả lời (answer_start)',
  },

  // 2. JCommonsenseQA (Văn hóa & Đố vui tư duy Nhật Bản)
  {
    id: 'jcommonsenseqa_v1_2_train',
    name: 'JCommonsenseQA v1.2 Train (Trắc nghiệm suy luận thường thức)',
    category: 'jcommonsenseqa',
    level: 'N2-N1',
    url: 'https://raw.githubusercontent.com/yahoojapan/JGLUE/refs/tags/v1.2.0/datasets/jcommonsenseqa-v1.2/train-v1.2.json',
    description: 'Câu hỏi trắc nghiệm 5 phương án lựa chọn về văn hóa, xã hội và tư duy Nhật Bản',
  },
  {
    id: 'jcommonsenseqa_v1_2_valid',
    name: 'JCommonsenseQA v1.2 Valid',
    category: 'jcommonsenseqa',
    level: 'N2-N1',
    url: 'https://raw.githubusercontent.com/yahoojapan/JGLUE/refs/tags/v1.2.0/datasets/jcommonsenseqa-v1.2/valid-v1.2.json',
    description: 'Tập kiểm định trắc nghiệm suy luận ngôn ngữ học',
  },

  // 3. JNLI (Japanese Natural Language Inference - Suy luận logic ngữ cảnh)
  {
    id: 'jnli_v1_2_train',
    name: 'JNLI v1.2 Train (Suy luận ngữ cảnh logic)',
    category: 'jnli',
    level: 'N3-N2',
    url: 'https://raw.githubusercontent.com/yahoojapan/JGLUE/refs/tags/v1.2.0/datasets/jnli-v1.2/train-v1.2.json',
    description: 'Xác định mối quan hệ tiền đề - kết luận (Entailment, Contradiction, Neutral)',
  },
  {
    id: 'jnli_v1_2_valid',
    name: 'JNLI v1.2 Valid',
    category: 'jnli',
    level: 'N3-N2',
    url: 'https://raw.githubusercontent.com/yahoojapan/JGLUE/refs/tags/v1.2.0/datasets/jnli-v1.2/valid-v1.2.json',
    description: 'Tập kiểm định suy luận ngữ nghĩa câu tiếng Nhật',
  },

  // 4. JSTS (Japanese Semantic Textual Similarity - Đồng nghĩa & Diễn đạt lại)
  {
    id: 'jsts_v1_2_train',
    name: 'JSTS v1.2 Train (Thang điểm đồng nghĩa ngữ nghĩa)',
    category: 'jsts',
    level: 'N3-N1',
    url: 'https://raw.githubusercontent.com/yahoojapan/JGLUE/refs/tags/v1.2.0/datasets/jsts-v1.2/train-v1.2.json',
    description: 'Đánh giá mức độ tương đương ngữ nghĩa giữa 2 câu tiếng Nhật (thang điểm 0-5)',
  },
  {
    id: 'jsts_v1_2_valid',
    name: 'JSTS v1.2 Valid',
    category: 'jsts',
    level: 'N3-N1',
    url: 'https://raw.githubusercontent.com/yahoojapan/JGLUE/refs/tags/v1.2.0/datasets/jsts-v1.2/valid-v1.2.json',
    description: 'Tập kiểm định sắc thái diễn đạt lại (Paraphrasing)',
  },

  // 5. JCoLA (Japanese Corpus of Linguistic Acceptability - Ngữ pháp chuẩn mực)
  {
    id: 'jcola_in_domain_train',
    name: 'JCoLA v1.0 In-Domain Train (Chuẩn ngữ pháp ĐH Tokyo)',
    category: 'jcola',
    level: 'N2-N1',
    url: 'https://raw.githubusercontent.com/osekilab/JCoLA/main/data/jcola-v1.0/in_domain_train-v1.0.json',
    description: 'Đánh giá tính chuẩn xác ngữ pháp tiếng Nhật từ Oseki Lab (ĐHQG Tokyo)',
  },
  {
    id: 'jcola_in_domain_valid',
    name: 'JCoLA v1.0 In-Domain Valid',
    category: 'jcola',
    level: 'N2-N1',
    url: 'https://raw.githubusercontent.com/osekilab/JCoLA/main/data/jcola-v1.0/in_domain_valid-v1.0.json',
    description: 'Tập kiểm định chấp nhận tính ngữ pháp tiếng Nhật',
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function crawlJlptDokkaiCorpus(limit?: number) {
  console.log('\n======================================================');
  console.log('📖 [HF CRAWLER 1/3] JLPT DOKKAI & JGLUE READING COMPREHENSION');
  console.log('     Thu thập toàn văn bộ đề đọc hiểu JSQuAD, JCommonsenseQA, JCoLA');
  console.log('======================================================');

  const folders = await DriveFolderManager.initFolders();
  const folderId = folders.jlptDokkaiFolderId;
  if (!folderId) {
    throw new Error('Chưa tìm thấy thư mục 09_JLPT_Dokkai_Reading_Comprehension trên Google Drive');
  }

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  console.log(`📁 Thư mục Google Drive đích: ${folderId}`);
  console.log(`🎯 Tổng số kho đề thi đọc hiểu học thuật: ${DOKKAI_DATASETS.length}\n`);

  for (const ds of DOKKAI_DATASETS) {
    if (limit && successCount >= limit) break;

    const masterKey = `jlpt_dokkai:${ds.id}_master`;
    const masterFileName = `${ds.id}.json`;

    console.log(`📚 Đang xử lý bộ: 【${ds.name}】 (${ds.id})...`);

    // 1. Kiểm tra tải tệp Master JSON nguyên bản trực tiếp lên Drive
    if (DriveFolderManager.hasAsset(masterKey)) {
      console.log(`  ⏭️ Tệp Master [${ds.id}] đã có sẵn trên Google Drive, bỏ qua.`);
      skipCount++;
    } else {
      console.log(`  ⬇️ Đang stream tệp Master từ upstream: ${ds.url}...`);
      try {
        const entry = await StreamUploader.streamUploadFromUrl({
          url: ds.url,
          key: masterKey,
          category: 'jlpt_dokkai',
          fileName: masterFileName,
          mimeType: 'application/json',
          folderId,
          metadata: {
            datasetId: ds.id,
            datasetName: ds.name,
            category: ds.category,
            level: ds.level,
            description: ds.description,
            type: 'master_raw_json',
            source: 'JGLUE / University of Tokyo / RIKEN AIP',
          },
        });
        successCount++;
        console.log(`  ✅ [Master] Streamed thành công: ${entry.fileName} (${((entry.sizeBytes || 0) / 1024 / 1024).toFixed(2)} MB)`);
      } catch (err: any) {
        console.warn(`  ⚠️ Lỗi stream tệp Master ${ds.id}:`, err.message);
        failCount++;
      }
    }

    // 2. Phân tách thành các gói đề thi đọc hiểu chuyên biệt (Partitioned Dokkai Units)
    // Đối với JSQuAD: Phân tách theo từng chủ đề bài báo Wikipedia để người học luyện đề Dokkai
    if (ds.category === 'jsquad') {
      try {
        console.log(`  🔍 Đang phân tích cú pháp cấu trúc đề thi đọc hiểu JSQuAD (${ds.id})...`);
        const res = await fetch(ds.url, { signal: AbortSignal.timeout(30000) });
        if (!res.ok) continue;
        const rawJson: any = await res.json();
        const dataEntries = rawJson.data || [];

        console.log(`  📖 Tổng số bài đọc văn bản lớn trong ${ds.id}: ${dataEntries.length} chủ đề.`);

        // Nhóm thành các gói bài thi 25 chủ đề / tệp
        const CHUNK_SIZE = 25;
        const totalChunks = Math.ceil(dataEntries.length / CHUNK_SIZE);

        for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
          if (limit && successCount >= limit) break;
          const chunkId = `${ds.id}_unit_${String(chunkIdx + 1).padStart(3, '0')}`;
          const chunkKey = `jlpt_dokkai:${chunkId}`;

          if (DriveFolderManager.hasAsset(chunkKey)) {
            skipCount++;
            continue;
          }

          const chunkData = dataEntries.slice(chunkIdx * CHUNK_SIZE, (chunkIdx + 1) * CHUNK_SIZE);
          let totalPassages = 0;
          let totalQuestions = 0;

          for (const item of chunkData) {
            for (const para of item.paragraphs || []) {
              totalPassages++;
              totalQuestions += (para.qas || []).length;
            }
          }

          const payload = JSON.stringify({
            unitId: chunkId,
            sourceDataset: ds.id,
            level: ds.level,
            totalTopics: chunkData.length,
            totalPassages,
            totalQuestions,
            topics: chunkData,
          }, null, 2);

          const fileName = `jlpt_dokkai_${chunkId}.json`;
          const entry = await DriveFolderManager.uploadAndRegister({
            key: chunkKey,
            category: 'jlpt_dokkai',
            fileName,
            mimeType: 'application/json',
            content: Buffer.from(payload, 'utf-8'),
            folderId,
            sizeBytes: Buffer.byteLength(payload),
            metadata: {
              unitId: chunkId,
              sourceDataset: ds.id,
              level: ds.level,
              totalPassages,
              totalQuestions,
              type: 'dokkai_study_unit',
              source: 'JSQuAD v1.2 / JGLUE',
            },
          });

          successCount++;
          console.log(`    📝 [Unit ${chunkIdx + 1}/${totalChunks}] ${fileName} -> ${entry.fileId} (${totalPassages} đoạn văn, ${totalQuestions} câu hỏi)`);
          await delay(300);
        }
      } catch (parseErr: any) {
        console.warn(`  ⚠️ Lỗi phân tích Dokkai Unit ${ds.id}:`, parseErr.message);
      }
    }

    // 3. Phân tách thành các gói trắc nghiệm suy luận thường thức (JCommonsenseQA) & logic suy luận (JNLI)
    if (ds.category === 'jcommonsenseqa' || ds.category === 'jnli') {
      try {
        console.log(`  🔍 Đang phân tích cú pháp câu hỏi đọc hiểu ${ds.category.toUpperCase()} (${ds.id})...`);
        const res = await fetch(ds.url, { signal: AbortSignal.timeout(30000) });
        if (!res.ok) continue;
        const text = await res.text();
        const lines = text.trim().split('\n').filter((l) => l.trim().length > 0);
        const entries = lines.map((l) => {
          try { return JSON.parse(l); } catch { return null; }
        }).filter(Boolean);

        const CHUNK_SIZE = 50;
        const totalChunks = Math.ceil(entries.length / CHUNK_SIZE);

        for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
          if (limit && successCount >= limit) break;
          const chunkId = `${ds.id}_unit_${String(chunkIdx + 1).padStart(3, '0')}`;
          const chunkKey = `jlpt_dokkai:${chunkId}`;

          if (DriveFolderManager.hasAsset(chunkKey)) {
            skipCount++;
            continue;
          }

          const chunkData = entries.slice(chunkIdx * CHUNK_SIZE, (chunkIdx + 1) * CHUNK_SIZE);
          const payload = JSON.stringify({
            unitId: chunkId,
            sourceDataset: ds.id,
            category: ds.category,
            level: ds.level,
            totalItems: chunkData.length,
            items: chunkData,
          }, null, 2);

          const fileName = `jlpt_dokkai_${chunkId}.json`;
          const entry = await DriveFolderManager.uploadAndRegister({
            key: chunkKey,
            category: 'jlpt_dokkai',
            fileName,
            mimeType: 'application/json',
            content: Buffer.from(payload, 'utf-8'),
            folderId,
            sizeBytes: Buffer.byteLength(payload),
            metadata: {
              unitId: chunkId,
              sourceDataset: ds.id,
              level: ds.level,
              totalItems: chunkData.length,
              type: `${ds.category}_study_unit`,
              source: `${ds.name} / JGLUE`,
            },
          });

          successCount++;
          console.log(`    📝 [${ds.category.toUpperCase()} Unit ${chunkIdx + 1}/${totalChunks}] ${fileName} -> ${entry.fileId} (${chunkData.length} câu)`);
          await delay(300);
        }
      } catch (parseErr: any) {
        console.warn(`  ⚠️ Lỗi phân tích Dokkai Unit ${ds.id}:`, parseErr.message);
      }
    }
  }

  console.log(`\n🎉 Hoàn thành Crawler JLPT Dokkai Corpus: Thành công: +${successCount}, Bỏ qua: ${skipCount}, Lỗi: ${failCount}`);
  return { successCount, skipCount, failCount };
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('jlpt-dokkai-streamer.ts')) {
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;
  crawlJlptDokkaiCorpus(limit).catch((err) => {
    console.error('Lỗi thực thi JLPT Dokkai Crawler:', err);
    process.exit(1);
  });
}
