import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;
    const { currency, adultPrice, childPrice, validFrom, validTo } = await request.json();

    if (!currency || adultPrice === undefined || childPrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE package_prices SET currency = $1, adult_price = $2, child_price = $3, valid_from = $4, valid_to = $5 
       WHERE id = $6 RETURNING *`,
      [currency, adultPrice, childPrice, validFrom || null, validTo || null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Package price not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to update package price:', error);
    return NextResponse.json(
      { error: 'Failed to update package price' },
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

    const result = await pool.query(
      `DELETE FROM package_prices WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Package price not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete package price:', error);
    return NextResponse.json(
      { error: 'Failed to delete package price' },
      { status: 500 }
    );
  }
}
