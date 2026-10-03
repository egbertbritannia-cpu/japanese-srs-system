import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JapaneseAudioPool } from '@/lib/audio-pool';

describe('TẦNG 6: JapaneseAudioPool Runtime Memory & GC Optimization', () => {
  beforeEach(() => {
    JapaneseAudioPool.clear();
  });

  it('xử lý an toàn trong môi trường không có Audio element (SSR / Node)', async () => {
    // Trong môi trường Node/SSR, không ném ngoại lệ khi gọi play hoặc preload
    await expect(JapaneseAudioPool.play('https://example.com/audio.mp3')).resolves.not.toThrow();
    expect(() => JapaneseAudioPool.preload('https://example.com/audio.mp3')).not.toThrow();
    expect(() => JapaneseAudioPool.clear()).not.toThrow();
  });

  it('quản lý thể hiện Audio khi window và Audio được giả lập', async () => {
    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();

    class MockAudio {
      src = '';
      paused = true;
      currentTime = 0;
      preload = '';
      play = playMock;
      pause = pauseMock;
    }

    (global as any).window = {};
    (global as any).Audio = MockAudio;

    await JapaneseAudioPool.play('/sounds/hyoshigi.mp3');
    expect(playMock).toHaveBeenCalledTimes(1);

    // Phát lần 2 tái sử dụng instance chứ không tạo instance rò rỉ
    await JapaneseAudioPool.play('/sounds/suzu.mp3');
    expect(playMock).toHaveBeenCalledTimes(2);

    JapaneseAudioPool.clear();
    expect(pauseMock).toHaveBeenCalled();

    delete (global as any).window;
    delete (global as any).Audio;
  });
});
