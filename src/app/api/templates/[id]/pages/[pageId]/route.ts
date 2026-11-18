import { NextResponse } from 'next/server';
import { updatePage, deletePage } from '@/lib/data-service';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string; pageId: string }> }
) {
  try {
    const { pageId } = await context.params;
    const body = await request.json();
    const updated = await updatePage(pageId, body);
    if (!updated) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string; pageId: string }> }
) {
  try {
    const { pageId } = await context.params;
    const success = await deletePage(pageId);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
