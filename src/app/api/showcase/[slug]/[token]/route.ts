import { NextResponse } from 'next/server';
import { getTemplateWithPagesBySlugAndToken } from '@/lib/data-service';

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string; token: string }> }
) {
  try {
    const { slug, token } = await context.params;
    const data = await getTemplateWithPagesBySlugAndToken(slug, token);
    if (!data) {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
