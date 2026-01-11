import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_request: NextRequest) {
  try {
    const result = await pool.query(
      `SELECT id, package_id, currency, adult_price, child_price, valid_from, valid_to 
       FROM package_prices 
       ORDER BY package_id, currency`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch package prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch package prices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { packageId, currency, adultPrice, childPrice, validFrom, validTo } = await request.json();

    if (!packageId || !currency || adultPrice === undefined || childPrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO package_prices (package_id, currency, adult_price, child_price, valid_from, valid_to) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [packageId, currency, adultPrice, childPrice, validFrom || null, validTo || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create package price:', error);
    return NextResponse.json(
      { error: 'Failed to create package price' },
      { status: 500 }
    );
  }
}
