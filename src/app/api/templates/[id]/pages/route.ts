import { NextResponse } from 'next/server';
import { createPage, reorderPages } from '@/lib/data-service';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await context.params;
    const body = await request.json();
    if (!body.name || !body.html_code) {
      return NextResponse.json({ error: 'Page name and HTML code are required' }, { status: 400 });
    }
    const page = await createPage(templateId, {
      name: body.name,
      html_code: body.html_code
    });
    return NextResponse.json(page, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await context.params;
    const body = await request.json();
    if (!Array.isArray(body.orderedPageIds)) {
      return NextResponse.json({ error: 'orderedPageIds array is required' }, { status: 400 });
    }
    const success = await reorderPages(templateId, body.orderedPageIds);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
