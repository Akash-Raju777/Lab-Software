import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: reagents, error } = await supabase
      .from('reagents')
      .select('*')
      .order('expiry_date', { ascending: true });

    if (error) throw error;

    const thresholdDays = 7;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alerts: any[] = [];

    for (const r of reagents || []) {
      const expiry = new Date(r.expiry_date);
      expiry.setHours(0, 0, 0, 0);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        alerts.push({
          id: r.id,
          reagentName: r.name,
          quantity: Number(r.quantity),
          unit: r.unit,
          expiryDate: r.expiry_date,
          status: 'EXPIRED',
          daysUntilExpiry: diffDays,
          message: `EXPIRED: ${Math.abs(diffDays)} days ago. Do not use.`,
          severity: 'DANGER',
        });
      } else if (diffDays <= thresholdDays) {
        alerts.push({
          id: r.id,
          reagentName: r.name,
          quantity: Number(r.quantity),
          unit: r.unit,
          expiryDate: r.expiry_date,
          status: 'EXPIRING_SOON',
          daysUntilExpiry: diffDays,
          message: `Expiring soon: in ${diffDays} day${diffDays === 1 ? '' : 's'}. Plan replenishment.`,
          severity: 'WARNING',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Alerts retrieved successfully',
      data: alerts,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
