import { NextResponse } from 'next/server';

/**
 * API nhận và ghi nhận chỉ số viễn thám người dùng thực tế (RUM Telemetry)
 * Căn cứ: planning/06_PHASE_6_PERFORMANCE_OPTIMIZATION_AND_SRE.md (Mục 3)
 */
export async function POST(request: Request) {
  try {
    let body: any;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json') || contentType.includes('text/plain')) {
      const text = await request.text();
      try {
        body = JSON.parse(text);
      } catch {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
      }
    } else {
      body = await request.json().catch(() => null);
    }

    if (!body || !body.metric || typeof body.value !== 'number') {
      return NextResponse.json(
        { error: 'Metric name and numeric value are required' },
        { status: 400 }
      );
    }

    // Ghi log giám sát hiệu năng theo định dạng chuẩn
    if (process.env.NODE_ENV !== 'production' || body.rating === 'poor') {
      console.log(
        `[RUM Telemetry] ${body.metric}: ${body.value}ms (${body.rating || 'recorded'}) on ${body.url || '/'}`
      );
    }

    return NextResponse.json({
      success: true,
      receivedAt: Date.now(),
      metric: body.metric,
      value: body.value,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Lỗi xử lý telemetry' },
      { status: 500 }
    );
  }
}
