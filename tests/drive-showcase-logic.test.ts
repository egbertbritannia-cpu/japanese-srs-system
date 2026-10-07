import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAllMultimodalAssets } from '@/services/multimodal/media.service';
import type { MultimodalAsset, AssetCategory } from '@/services/multimodal/types';

/**
 * Canonical Showcase Client-Side Business Logic Helpers
 * (Matching DriveShowcaseClient in-memory filtering, debouncing, and pagination specifications)
 */
export function filterShowcaseAssets(
  assets: MultimodalAsset[],
  category: string,
  searchQuery: string
): MultimodalAsset[] {
  const q = (searchQuery || '').trim().toLowerCase();
  const cat = (category || 'all').toLowerCase();

  return assets.filter((asset) => {
    // 1. Category Filter
    if (cat !== 'all' && asset.category.toLowerCase() !== cat) {
      return false;
    }

    // 2. Search Query Filter
    if (!q) {
      return true;
    }

    const key = (asset.key || '').toLowerCase();
    const fileName = (asset.fileName || '').toLowerCase();
    const kanji = (asset.metadata?.kanji || '').toLowerCase();
    const word = (asset.metadata?.word || '').toLowerCase();
    const title = (asset.metadata?.title || '').toLowerCase();
    const japanese = (asset.metadata?.japanese || '').toLowerCase();

    return (
      key.includes(q) ||
      fileName.includes(q) ||
      kanji.includes(q) ||
      word.includes(q) ||
      title.includes(q) ||
      japanese.includes(q)
    );
  });
}

export function paginateShowcaseAssets(
  assets: MultimodalAsset[],
  page: number,
  pageSize = 24
): {
  items: MultimodalAsset[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
} {
  const totalItems = assets.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * pageSize;
  const items = assets.slice(startIndex, startIndex + pageSize);

  return {
    items,
    currentPage,
    totalPages,
    totalItems,
  };
}

export function sortShowcaseAssets(
  assets: MultimodalAsset[],
  sortBy: 'name_asc' | 'name_desc' | 'size_asc' | 'size_desc'
): MultimodalAsset[] {
  const cloned = [...assets];
  switch (sortBy) {
    case 'name_asc':
      return cloned.sort((a, b) => (a.fileName || a.key).localeCompare(b.fileName || b.key));
    case 'name_desc':
      return cloned.sort((a, b) => (b.fileName || b.key).localeCompare(a.fileName || a.key));
    case 'size_asc':
      return cloned.sort((a, b) => a.sizeBytes - b.sizeBytes);
    case 'size_desc':
      return cloned.sort((a, b) => b.sizeBytes - a.sizeBytes);
    default:
      return cloned;
  }
}

describe('Tier 1-4 Multimodal Drive Showcase Logic & Search Benchmark (tests/drive-showcase-logic.test.ts)', () => {
  let allAssets: MultimodalAsset[];

  beforeEach(() => {
    allAssets = getAllMultimodalAssets();
  });

  // --------------------------------------------------------------------------
  // TIER 1: IN-MEMORY CATEGORY FILTERING ACROSS ALL 8 DOMAINS
  // --------------------------------------------------------------------------
  describe('Tier 1: Category Filtering Across 8 Domains', () => {
    it('T1-FIL-01: category "all" returns the complete asset dataset (>=456 items)', () => {
      const filtered = filterShowcaseAssets(allAssets, 'all', '');
      expect(filtered.length).toBe(allAssets.length);
      expect(filtered.length).toBeGreaterThanOrEqual(456);
    });

    it('T1-FIL-02: filters strictly for category "kanji" (>=111 items)', () => {
      const kanji = filterShowcaseAssets(allAssets, 'kanji', '');
      expect(kanji.length).toBeGreaterThanOrEqual(111);
      expect(kanji.every((item) => item.category === 'kanji')).toBe(true);
    });

    it('T1-FIL-03: filters strictly for category "vocab_audio" (>=322 items)', () => {
      const audio = filterShowcaseAssets(allAssets, 'vocab_audio', '');
      expect(audio.length).toBeGreaterThanOrEqual(322);
      expect(audio.every((item) => item.category === 'vocab_audio')).toBe(true);
    });

    it('T1-FIL-04: filters strictly for category "illustration" (>=136 items)', () => {
      const illustrations = filterShowcaseAssets(allAssets, 'illustration', '');
      expect(illustrations.length).toBeGreaterThanOrEqual(136);
      expect(illustrations.every((item) => item.category === 'illustration')).toBe(true);
    });

    it('T1-FIL-05: filters across remaining domains (grammar, ielts, immersion, jlpt, pubmed)', () => {
      const kanji = filterShowcaseAssets(allAssets, 'kanji', '');
      const audio = filterShowcaseAssets(allAssets, 'vocab_audio', '');
      const illustrations = filterShowcaseAssets(allAssets, 'illustration', '');
      const grammar = filterShowcaseAssets(allAssets, 'grammar_infographic', '');
      const ielts = filterShowcaseAssets(allAssets, 'ielts_audio', '');
      const immersion = filterShowcaseAssets(allAssets, 'immersion_clip', '');
      const jlpt = filterShowcaseAssets(allAssets, 'jlpt_choukai', '');
      const pubmed = filterShowcaseAssets(allAssets, 'pubmed_corpus', '');

      expect(grammar.length).toBeGreaterThanOrEqual(0);
      expect(ielts.length).toBeGreaterThanOrEqual(50);
      expect(immersion.length).toBeGreaterThanOrEqual(19);
      expect(jlpt.length).toBeGreaterThanOrEqual(9);
      expect(pubmed.length).toBeGreaterThanOrEqual(10);

      const sumCategories =
        kanji.length +
        audio.length +
        illustrations.length +
        grammar.length +
        ielts.length +
        immersion.length +
        jlpt.length +
        pubmed.length;
      expect(sumCategories).toBe(allAssets.length);
    });
  });

  // --------------------------------------------------------------------------
  // TIER 1: DEBOUNCED SEARCH MATCHING (NAME, KANJI, ASSET KEY)
  // --------------------------------------------------------------------------
  describe('Tier 1: Search Matching Logic', () => {
    it('T1-SCH-01: matches exact Kanji character in asset key or metadata', () => {
      const results = filterShowcaseAssets(allAssets, 'all', '東');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((item) => item.key === 'kanji:東')).toBe(true);
    });

    it('T1-SCH-02: matches by asset key prefix/suffix', () => {
      const results = filterShowcaseAssets(allAssets, 'all', 'vocab_audio:両親');
      expect(results.length).toBe(1);
      expect(results[0].key).toBe('vocab_audio:両親');
    });

    it('T1-SCH-03: matches by file name extension or partial name', () => {
      const results = filterShowcaseAssets(allAssets, 'all', 'animated.svg');
      expect(results.length).toBe(111);
      expect(results.every((item) => item.fileName.includes('animated.svg'))).toBe(true);
    });

    it('T1-SCH-04: is case-insensitive for search queries', () => {
      const upper = filterShowcaseAssets(allAssets, 'all', 'KANJI');
      const lower = filterShowcaseAssets(allAssets, 'all', 'kanji');
      expect(upper.length).toBe(lower.length);
      expect(upper.length).toBeGreaterThan(0);
    });

    it('T1-SCH-05: debounced search execution with simulated fake timers', () => {
      vi.useFakeTimers();
      let queryExecuted = '';
      let executionCount = 0;

      const triggerSearch = (query: string) => {
        queryExecuted = query;
        executionCount++;
      };

      // Create a debounce wrapper
      let timeoutId: any = null;
      const onKeystroke = (query: string) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          triggerSearch(query);
        }, 150);
      };

      // Rapid typing simulation
      onKeystroke('k');
      vi.advanceTimersByTime(30);
      onKeystroke('ka');
      vi.advanceTimersByTime(30);
      onKeystroke('kan');
      vi.advanceTimersByTime(30);
      onKeystroke('kanji');

      // Before debounce fires
      expect(executionCount).toBe(0);

      // Advance by remaining 150ms
      vi.advanceTimersByTime(150);
      expect(executionCount).toBe(1);
      expect(queryExecuted).toBe('kanji');

      vi.useRealTimers();
    });
  });

  // --------------------------------------------------------------------------
  // TIER 4: SUB-50MS SEARCH PERFORMANCE BENCHMARK ACROSS 456+ ASSETS
  // --------------------------------------------------------------------------
  describe('Tier 4: Sub-50ms Search Performance Benchmark', () => {
    it('T4-PRF-01: executes in-memory search over 688 items under 50ms budget', () => {
      const testQueries = ['東', 'audio', 'kanji', 'medical', '06771', 'dementia', 'nonexistent_query'];

      const runTimes: number[] = [];
      for (const query of testQueries) {
        const start = performance.now();
        const results = filterShowcaseAssets(allAssets, 'all', query);
        const duration = performance.now() - start;
        runTimes.push(duration);

        // Every individual search must take under 50ms
        expect(duration).toBeLessThan(50);
        expect(Array.isArray(results)).toBe(true);
      }

      // Average latency must be under 10ms for in-memory operations
      const avg = runTimes.reduce((acc, v) => acc + v, 0) / runTimes.length;
      expect(avg).toBeLessThan(10);
    });

    it('T4-PRF-02: stress-tests 100 consecutive search iterations under 500ms aggregate budget', () => {
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        const query = i % 2 === 0 ? '東' : 'audio';
        filterShowcaseAssets(allAssets, 'all', query);
      }
      const totalDuration = performance.now() - start;

      // 100 searches should take < 500ms (5ms per search)
      expect(totalDuration).toBeLessThan(500);
    });
  });

  // --------------------------------------------------------------------------
  // TIER 1 & 3: PAGINATION, SORTING & COMBINATIONS
  // --------------------------------------------------------------------------
  describe('Tier 1 & 3: Pagination & Sorting Logic', () => {
    it('T1-PAG-01: slices items accurately for 24 items per page', () => {
      const page1 = paginateShowcaseAssets(allAssets, 1, 24);
      expect(page1.items.length).toBe(24);
      expect(page1.currentPage).toBe(1);
      expect(page1.totalItems).toBe(allAssets.length);
      expect(page1.totalPages).toBe(Math.ceil(allAssets.length / 24));

      const page2 = paginateShowcaseAssets(allAssets, 2, 24);
      expect(page2.items.length).toBe(24);
      expect(page2.currentPage).toBe(2);
      expect(page2.items[0].key).not.toBe(page1.items[0].key);
    });

    it('T1-PAG-02: handles remainder on the last page without overflow', () => {
      const totalPages = Math.ceil(allAssets.length / 24);
      const lastPage = paginateShowcaseAssets(allAssets, totalPages, 24);
      const expectedRemainder = allAssets.length % 24 || 24;

      expect(lastPage.currentPage).toBe(totalPages);
      expect(lastPage.items.length).toBe(expectedRemainder);
    });

    it('T2-PAG-03: clamps out-of-bounds page numbers safely', () => {
      const negativePage = paginateShowcaseAssets(allAssets, -5, 24);
      expect(negativePage.currentPage).toBe(1);

      const hugePage = paginateShowcaseAssets(allAssets, 9999, 24);
      expect(hugePage.currentPage).toBe(hugePage.totalPages);
    });

    it('T1-SRT-01: sorts assets by name ascending and descending', () => {
      const asc = sortShowcaseAssets(allAssets, 'name_asc');
      const desc = sortShowcaseAssets(allAssets, 'name_desc');

      expect(asc[0].fileName.localeCompare(asc[asc.length - 1].fileName)).toBeLessThanOrEqual(0);
      expect(desc[0].fileName.localeCompare(desc[desc.length - 1].fileName)).toBeGreaterThanOrEqual(0);
    });

    it('T1-SRT-02: sorts assets by file sizeBytes ascending and descending', () => {
      const asc = sortShowcaseAssets(allAssets, 'size_asc');
      const desc = sortShowcaseAssets(allAssets, 'size_desc');

      expect(asc[0].sizeBytes).toBeLessThanOrEqual(asc[asc.length - 1].sizeBytes);
      expect(desc[0].sizeBytes).toBeGreaterThanOrEqual(desc[desc.length - 1].sizeBytes);
    });

    it('T3-CB-01: combines category filtering, search, sorting, and pagination simultaneously', () => {
      const filtered = filterShowcaseAssets(allAssets, 'kanji', 'kanji_');
      const sorted = sortShowcaseAssets(filtered, 'name_asc');
      const paginated = paginateShowcaseAssets(sorted, 1, 10);

      expect(paginated.items.length).toBe(10);
      expect(paginated.items.every((it) => it.category === 'kanji')).toBe(true);
      expect(paginated.totalItems).toBe(111);
    });
  });

  // --------------------------------------------------------------------------
  // TIER 2 & 5: ADVERSARIAL EDGE CASES & FAULT INJECTION
  // --------------------------------------------------------------------------
  describe('Tier 2 & 5: Adversarial Edge Cases & Fault Injection', () => {
    it('T2-ADV-01: empty or whitespace search query returns unfiltered category set', () => {
      const empty = filterShowcaseAssets(allAssets, 'kanji', '');
      const whitespace = filterShowcaseAssets(allAssets, 'kanji', '   ');
      expect(empty.length).toBe(111);
      expect(whitespace.length).toBe(111);
    });

    it('T5-ADV-02: special regex characters (.*+?^${}()|[]\\) do not crash the search algorithm', () => {
      const dangerousQueries = ['.*', '(?=.*)', '+', '[a-z]', '\\d+', '{1,3}', '$^'];
      for (const dangerous of dangerousQueries) {
        expect(() => {
          const results = filterShowcaseAssets(allAssets, 'all', dangerous);
          expect(Array.isArray(results)).toBe(true);
        }).not.toThrow();
      }
    });

    it('T5-ADV-03: oversized search query (1,000+ characters) executes safely under 20ms', () => {
      const oversized = 'a'.repeat(1500);
      const start = performance.now();
      const results = filterShowcaseAssets(allAssets, 'all', oversized);
      const elapsed = performance.now() - start;

      expect(results).toHaveLength(0);
      expect(elapsed).toBeLessThan(20);
    });

    it('T2-ADV-04: handles malformed assets with missing properties safely', () => {
      const malformed: MultimodalAsset[] = [
        {
          key: '',
          category: 'kanji',
          fileName: '',
          mimeType: '',
          fileId: '',
          driveUrl: '',
          cdnUrl: '',
          sizeBytes: 0,
        },
        {
          key: 'ghost:item',
          category: 'kanji',
          fileName: 'ghost.svg',
          mimeType: 'image/svg+xml',
          fileId: 'ghost123',
          driveUrl: '',
          cdnUrl: '',
          sizeBytes: 100,
          metadata: undefined,
        },
      ];

      expect(() => filterShowcaseAssets(malformed, 'kanji', 'ghost')).not.toThrow();
      const res = filterShowcaseAssets(malformed, 'kanji', 'ghost');
      expect(res.length).toBe(1);
    });
  });
});
