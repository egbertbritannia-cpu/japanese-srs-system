import { NextResponse } from 'next/server';

/**
 * (Giai đoạn 2) API Furigana & Phân tích cấu trúc
 */
export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text parameter is required' },
        { status: 400 }
      );
    }

    // TODO: Kết nối với japanese-nlp (Kuromoji/MeCab) để sinh Furigana & phân tách token
    return NextResponse.json({
      success: true,
      data: {
        raw: text,
        furigana: '', // placeholder
        tokens: [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
