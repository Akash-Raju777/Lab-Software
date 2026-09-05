import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const { data: reagents, error } = await supabase
      .from('reagents')
      .select('expiry_date');

    if (error) throw error;

    const thresholdDays = 7;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalReagents = (reagents || []).length;
    let goodCount = 0;
    let expiringSoonCount = 0;
    let expiredCount = 0;

    for (const r of reagents || []) {
      const expiry = new Date(r.expiry_date);
      expiry.setHours(0, 0, 0, 0);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        expiredCount++;
      } else if (diffDays <= thresholdDays) {
        expiringSoonCount++;
      } else {
        goodCount++;
      }
    }

    const calculationDate = today.toISOString().split('T')[0];

    return NextResponse.json({
      success: true,
      message: 'Operation completed successfully',
      data: {
        totalReagents,
        goodCount,
        expiringSoonCount,
        expiredCount,
        calculationDate,
        thresholdDays,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to calculate summary' },
      { status: 500 }
    );
  }
}
