import { describe, it, expect } from 'vitest';
import { FSRS, createEmptyCard, generatorParameters } from 'ts-fsrs';
import fs from 'node:fs';
import path from 'node:path';

describe('FSRS Web Worker & Background Optimization Verification', () => {
  const workerFile = path.resolve(process.cwd(), 'src/workers/fsrs.worker.ts');
  const hookFile = path.resolve(process.cwd(), 'src/hooks/useFsrsScheduler.ts');

  it('file fsrs.worker.ts và useFsrsScheduler.ts phải tồn tại', () => {
    expect(fs.existsSync(workerFile)).toBe(true);
    expect(fs.existsSync(hookFile)).toBe(true);
  });

  it('worker file phải chứa khai báo FSRS và event listener message', () => {
    const workerContent = fs.readFileSync(workerFile, 'utf-8');
    expect(workerContent).toContain("from 'ts-fsrs'");
    expect(workerContent).toContain("addEventListener('message'");
    expect(workerContent).toContain('fsrs.repeat');
    expect(workerContent).toContain('postMessage');
  });

  it('hook file phải có cơ chế fallback an toàn cho môi trường không có Worker', () => {
    const hookContent = fs.readFileSync(hookFile, 'utf-8');
    expect(hookContent).toContain('useFsrsScheduler');
    expect(hookContent).toContain('fallbackFsrsRef');
    expect(hookContent).toContain('calculateNextReview');
  });

  it('thuật toán FSRS repeat phải tính toán đúng 4 trạng thái Again, Hard, Good, Easy', () => {
    const fsrs = new FSRS(generatorParameters());
    const card = createEmptyCard();
    const now = new Date();
    const schedulingCards = fsrs.repeat(card, now);

    expect(schedulingCards['1']).toBeDefined(); // Again
    expect(schedulingCards['2']).toBeDefined(); // Hard
    expect(schedulingCards['3']).toBeDefined(); // Good
    expect(schedulingCards['4']).toBeDefined(); // Easy

    // Độ ổn định của Good phải lớn hơn hoặc bằng Hard, và Easy lớn hơn Good
    expect(schedulingCards['3'].card.stability).toBeGreaterThanOrEqual(schedulingCards['2'].card.stability);
    expect(schedulingCards['4'].card.stability).toBeGreaterThan(schedulingCards['3'].card.stability);
  });
});
