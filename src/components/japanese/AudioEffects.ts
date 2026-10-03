/**
 * Web Audio API Synthesizer & Japanese Speech Synthesis for SRS
 * Zero external audio files required - pure native browser synthesis!
 */

class JapaneseAudioEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Mở khóa AudioContext khi người dùng tương tác lần đầu (BUG-AUD-01)
   */
  public unlockAudioContext() {
    if (typeof window === 'undefined') return;
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  /**
   * Tiếng gõ phách gỗ Hyoshigi (拍子木) của nghệ thuật kịch Kabuki
   * Tạo âm gõ gỗ đanh, sắc nét khi bấm nút hoặc đánh giá lại (Again)
   */
  playHyoshigi() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Note A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio not supported or blocked by policy
    }
  }

  /**
   * Tiếng chuông đền Thần đạo Suzu (鈴) ngân vang
   * Dùng khi hoàn thành mục tiêu ngày hoặc trả lời Good / Easy
   */
  playSuzuBell() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const freqs = [1760, 2640, 3520]; // Các họa âm thanh khiết của chuông đồng
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const initialGain = 0.15 / (idx + 1);
        gain.gain.setValueAtTime(initialGain, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.65);
      });
    } catch {
      // Audio not supported
    }
  }

  /**
   * Tiếng gảy đàn tranh Koto (箏) theo điệu thức cổ Hirajoshi (平調子)
   */
  playKotoPluck() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } catch {
      // Audio not supported
    }
  }

  /**
   * Phát âm tiếng Nhật tự nhiên thông qua Web Speech API (Dual Coding)
   * Đồng thời đồng bộ callback onEnd với giao diện (BUG-AUD-05)
   */
  speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Dừng câu trước đó nếu đang đọc
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.88; // Tốc độ chuẩn cho người học tiếng Nhật
      utterance.pitch = 1.05; // Cao độ tự nhiên, rõ ràng
      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }
}

export const japaneseAudio = new JapaneseAudioEngine();

// Tự động mở khóa AudioContext trên cử chỉ chạm/click đầu tiên (BUG-AUD-01)
if (typeof window !== 'undefined') {
  const unlock = () => {
    japaneseAudio.unlockAudioContext();
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('click', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('touchstart', unlock, { once: true, passive: true });
  window.addEventListener('click', unlock, { once: true, passive: true });
  window.addEventListener('keydown', unlock, { once: true, passive: true });
}
