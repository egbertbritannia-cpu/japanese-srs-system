import { describe, it, expect } from 'vitest';
import * as kirieComponents from '../src/components/kirie';

describe('Kirie Washi Paper-Cutout Design System & Components', () => {
  it('should export all 5 core Kirie components properly', () => {
    expect(kirieComponents.KirieWaveIllustration).toBeDefined();
    expect(kirieComponents.KirieHeroBanner).toBeDefined();
    expect(kirieComponents.KirieKpiCard).toBeDefined();
    expect(kirieComponents.KirieFocusListItem).toBeDefined();
    expect(kirieComponents.KirieBottomNav).toBeDefined();
  });

  it('should validate KirieFocusItemData interface mapping', () => {
    const mockItem: kirieComponents.KirieFocusItemData = {
      id: 'test-1',
      title: '曖昧 (あいまい)',
      subtitle: 'Mơ hồ, mập mờ',
      timeOrLevel: 'N2',
      statusText: 'Cần ôn ngay',
      statusType: 'due-now',
      barColor: 'navy',
      href: '/review',
      audioText: '曖昧',
    };

    expect(mockItem.id).toBe('test-1');
    expect(mockItem.barColor).toBe('navy');
    expect(mockItem.statusType).toBe('due-now');
  });
});
