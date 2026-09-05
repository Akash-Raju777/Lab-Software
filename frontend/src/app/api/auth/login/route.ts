import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Try finding user in Supabase
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('*')
      .or(`email.ilike.${email},username.ilike.${email}`)
      .limit(1);

    if (!error && users && users.length > 0) {
      const user = users[0];
      if (user.password === password) {
        const token = `labtrack-jwt-${crypto.randomUUID()}`;
        return NextResponse.json({
          success: true,
          message: 'Authentication successful',
          data: {
            token,
            email: user.email,
            name: user.full_name,
            role: user.role || 'ADMIN',
            message: 'Authentication successful',
          },
        });
      }
    }

    // Default admin fallback
    if (email === 'admin@labtrack.com' && password === 'labpassword123') {
      const token = `labtrack-jwt-${crypto.randomUUID()}`;
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        data: {
          token,
          email: 'admin@labtrack.com',
          name: 'Dr. Sarah Mitchell',
          role: 'ADMIN',
          message: 'Authentication successful',
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid laboratory email/username or password.' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
