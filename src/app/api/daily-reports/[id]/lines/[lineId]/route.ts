import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string; lineId: string }> }
) {
  try {
    const params = await props.params;
    const { id, lineId } = params;
    const { adultQty, childQty, lineTotal, currency } = await request.json();

    if (adultQty === undefined || childQty === undefined || lineTotal === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE report_lines SET adult_qty = $1, child_qty = $2, line_total = $3, currency = $4 
       WHERE id = $5 AND report_id = $6 RETURNING *`,
      [adultQty, childQty, lineTotal, currency || 'TL', lineId, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Report line not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to update report line:', error);
    return NextResponse.json(
      { error: 'Failed to update report line' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string; lineId: string }> }
) {
  try {
    const params = await props.params;
    const { id, lineId } = params;

    const result = await pool.query(
      `DELETE FROM report_lines WHERE id = $1 AND report_id = $2 RETURNING *`,
      [lineId, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Report line not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete report line:', error);
    return NextResponse.json(
      { error: 'Failed to delete report line' },
      { status: 500 }
    );
  }
}
