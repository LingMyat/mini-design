import { NextResponse } from 'next/server';
import { seedSampleDataToSupabase } from '@/lib/data-service';

export async function POST() {
  try {
    const success = await seedSampleDataToSupabase();
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
