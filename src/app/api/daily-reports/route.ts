import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_request: NextRequest) {
  try {
    const result = await pool.query(
      `SELECT id, report_date, usd_rate, eur_rate, created_at FROM daily_reports ORDER BY report_date DESC`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch daily reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { reportDate, usdRate, eurRate } = await request.json();

    if (!reportDate) {
      return NextResponse.json(
        { error: 'Report date is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO daily_reports (report_date, usd_rate, eur_rate, created_at) 
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [reportDate, usdRate || 0, eurRate || 0]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create daily report:', error);
    return NextResponse.json(
      { error: 'Failed to create daily report' },
      { status: 500 }
    );
  }
}
