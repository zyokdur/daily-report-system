import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    const result = await pool.query(
      `SELECT id, report_date, usd_rate, eur_rate, created_at FROM daily_reports WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Daily report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to fetch daily report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily report' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;
    const { usdRate, eurRate } = await request.json();

    const result = await pool.query(
      `UPDATE daily_reports SET usd_rate = $1, eur_rate = $2 WHERE id = $3 RETURNING *`,
      [usdRate || 0, eurRate || 0, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Daily report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to update daily report:', error);
    return NextResponse.json(
      { error: 'Failed to update daily report' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    // Delete report lines first
    await pool.query(`DELETE FROM report_lines WHERE report_id = $1`, [id]);

    // Delete report
    const result = await pool.query(
      `DELETE FROM daily_reports WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Daily report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete daily report:', error);
    return NextResponse.json(
      { error: 'Failed to delete daily report' },
      { status: 500 }
    );
  }
}
