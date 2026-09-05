import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';

function calculateStatus(expiryDateStr: string, thresholdDays: number = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status: 'GOOD' | 'EXPIRING_SOON' | 'EXPIRED';
  if (diffDays < 0) {
    status = 'EXPIRED';
  } else if (diffDays <= thresholdDays) {
    status = 'EXPIRING_SOON';
  } else {
    status = 'GOOD';
  }

  return { status, daysUntilExpiry: diffDays };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const { data, error } = await supabase
      .from('reagents')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: `Reagent not found with ID: ${id}` },
        { status: 404 }
      );
    }

    const { status, daysUntilExpiry } = calculateStatus(data.expiry_date);

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        quantity: Number(data.quantity),
        unit: data.unit,
        expiryDate: data.expiry_date,
        createdAt: data.created_at,
        status,
        daysUntilExpiry,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching reagent' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const { error } = await supabase
      .from('reagents')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Reagent deleted successfully',
      data: null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to delete reagent' },
      { status: 500 }
    );
  }
}
