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
      `SELECT rl.id, rl.report_id, rl.package_price_id, rl.adult_qty, rl.child_qty, 
              rl.line_total, rl.currency, p.name as package_name, pp.adult_price, pp.child_price
       FROM report_lines rl
       JOIN package_prices pp ON rl.package_price_id = pp.id
       JOIN packages p ON pp.package_id = p.id
       WHERE rl.report_id = $1
       ORDER BY rl.id`,
      [id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch report lines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report lines' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;
    const { packagePriceId, adultQty, childQty, lineTotal, currency } = await request.json();

    if (!packagePriceId || adultQty === undefined || childQty === undefined || lineTotal === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO report_lines (report_id, package_price_id, adult_qty, child_qty, line_total, currency) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, packagePriceId, adultQty, childQty, lineTotal, currency || 'TL']
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create report line:', error);
    return NextResponse.json(
      { error: 'Failed to create report line' },
      { status: 500 }
    );
  }
}
