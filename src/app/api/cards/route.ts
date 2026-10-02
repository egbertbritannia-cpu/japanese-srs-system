import { NextResponse } from 'next/server';

/**
 * API CRUD thẻ học
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deck = searchParams.get('deck');

  // TODO: Gọi card-repository để lấy danh sách thẻ
  return NextResponse.json({
    success: true,
    data: [],
    filter: { deck },
  });
}

export async function POST(request: Request) {
  try {
    const cardData = await request.json();

    // TODO: Xác thực Atomicity bằng card.validator.ts trước khi lưu
    return NextResponse.json(
      {
        success: true,
        message: 'Card created successfully',
        data: cardData,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
