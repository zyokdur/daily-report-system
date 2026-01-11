import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Simple authentication (in production, use proper methods)
    // For demo: admin/admin
    if (username === 'admin' && password === 'admin') {
      return NextResponse.json(
        {
          success: true,
          user: { id: 1, username: 'admin', role: 'admin' },
          token: 'demo-token',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
