import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get('identifier') || 'admin@labtrack.com';

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const { data: users } = await supabase
      .from('user_profiles')
      .select('*')
      .or(`email.ilike.${identifier},username.ilike.${identifier}`)
      .limit(1);

    if (users && users.length > 0) {
      const user = users[0];
      if (user.password && user.password !== currentPassword) {
        return NextResponse.json(
          { success: false, message: 'Current password does not match.' },
          { status: 400 }
        );
      }

      await supabase
        .from('user_profiles')
        .update({
          password: newPassword,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
      data: null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update password' },
      { status: 500 }
    );
  }
}
