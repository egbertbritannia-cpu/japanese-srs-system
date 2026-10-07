import { NextResponse } from 'next/server';
import { MultimodalMediaService } from '@/services/multimodal/media.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const kanji = searchParams.get('kanji');
    const word = searchParams.get('word');
    const grammar = searchParams.get('grammar');
    const immersion = searchParams.get('immersion');
    const jlpt = searchParams.get('jlpt');
    const ielts = searchParams.get('ielts');
    const pubmed = searchParams.get('pubmed');
    const category = searchParams.get('category');
    const summary = searchParams.get('summary');

    if (summary === 'true') {
      return NextResponse.json({
        success: true,
        summary: MultimodalMediaService.getSummary(),
      });
    }

    if (key) {
      const asset = MultimodalMediaService.getAsset(key);
      return NextResponse.json({ success: true, asset });
    }

    if (kanji) {
      const strokeUrl = MultimodalMediaService.getKanjiStrokeUrl(kanji);
      return NextResponse.json({ success: true, kanji, strokeUrl });
    }

    if (word) {
      const audioUrl = MultimodalMediaService.getNativeAudioUrl(word);
      const illustrationUrl = MultimodalMediaService.getIllustrationUrl(word);
      return NextResponse.json({ success: true, word, audioUrl, illustrationUrl });
    }

    if (grammar) {
      const infographicUrl = MultimodalMediaService.getGrammarInfographicUrl(grammar);
      return NextResponse.json({ success: true, grammar, infographicUrl });
    }

    if (immersion) {
      const clip = MultimodalMediaService.getImmersionClip(immersion);
      return NextResponse.json({ success: true, immersion, clip });
    }

    if (jlpt) {
      const examItem = MultimodalMediaService.getJlptChoukai(jlpt);
      return NextResponse.json({ success: true, jlpt, examItem });
    }

    if (ielts) {
      const audioUrl = MultimodalMediaService.getIeltsAudioUrl(ielts);
      return NextResponse.json({ success: true, ielts, audioUrl });
    }

    if (pubmed) {
      const record = MultimodalMediaService.getPubMedRecord(pubmed);
      return NextResponse.json({ success: true, pubmed, record });
    }

    if (category) {
      const limitParam = searchParams.get('limit');
      const limit = limitParam !== null ? parseInt(limitParam, 10) : 20;
      const items = MultimodalMediaService.getAssetsByCategory(category, limit);
      return NextResponse.json({ success: true, category, count: items.length, items });
    }

    const searchQuery = searchParams.get('search') || searchParams.get('q');
    if (searchQuery) {
      const limitParam = searchParams.get('limit');
      const limit = limitParam !== null ? parseInt(limitParam, 10) : 20;
      const items = MultimodalMediaService.searchAssets(searchQuery, category || undefined, limit);
      return NextResponse.json({ success: true, query: searchQuery, count: items.length, items });
    }

    return NextResponse.json({
      success: true,
      summary: MultimodalMediaService.getSummary(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
