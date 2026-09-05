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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const statusFilter = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'expiry_date';
    const sortDir = searchParams.get('sortDir') || 'asc';

    let query = supabase.from('reagents').select('*');

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: reagents, error } = await query;

    if (error) {
      throw error;
    }

    // Map to frontend model and compute status
    let mapped = (reagents || []).map((r: any) => {
      const { status, daysUntilExpiry } = calculateStatus(r.expiry_date);
      return {
        id: r.id,
        name: r.name,
        quantity: Number(r.quantity),
        unit: r.unit,
        expiryDate: r.expiry_date,
        createdAt: r.created_at,
        status,
        daysUntilExpiry,
      };
    });

    if (statusFilter && statusFilter !== 'ALL') {
      mapped = mapped.filter((r) => r.status === statusFilter);
    }

    // Sort
    mapped.sort((a: any, b: any) => {
      let valA = a[sortBy] || a.expiryDate;
      let valB = b[sortBy] || b.expiryDate;
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDir === 'desc' ? 1 : -1;
      if (valA > valB) return sortDir === 'desc' ? -1 : 1;
      return 0;
    });

    return NextResponse.json({
      success: true,
      message: 'Reagents retrieved successfully',
      data: mapped,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to fetch reagents' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, quantity, unit, expiryDate } = body;

    if (!name || quantity === undefined || !unit || !expiryDate) {
      return NextResponse.json(
        { success: false, message: 'All reagent fields are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('reagents')
      .insert({
        name: name.trim(),
        quantity: Number(quantity),
        unit: unit.trim(),
        expiry_date: expiryDate,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error details:', error);
      throw new Error(error.message || JSON.stringify(error));
    }

    const { status, daysUntilExpiry } = calculateStatus(data.expiry_date);

    return NextResponse.json({
      success: true,
      message: 'Reagent created successfully',
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
    console.error('Catch error in POST /api/reagents:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to create reagent' },
      { status: 500 }
    );
  }
}
