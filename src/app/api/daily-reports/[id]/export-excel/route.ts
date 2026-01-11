import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import ExcelJS from 'exceljs';

export async function POST(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    // Fetch report and its lines
    const reportResult = await pool.query(
      `SELECT * FROM daily_reports WHERE id = $1`,
      [id]
    );

    if (reportResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const report = reportResult.rows[0];

    const linesResult = await pool.query(
      `SELECT rl.*, p.name as package_name
       FROM report_lines rl
       JOIN package_prices pp ON rl.package_price_id = pp.id
       JOIN packages p ON pp.package_id = p.id
       WHERE rl.report_id = $1
       ORDER BY rl.id`,
      [id]
    );

    const lines = linesResult.rows;

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Günlük Rapor');

    // Set column widths
    worksheet.columns = [
      { header: 'Paket', key: 'package', width: 25 },
      { header: 'Adult Adet', key: 'adult_qty', width: 12 },
      { header: 'Child Adet', key: 'child_qty', width: 12 },
      { header: 'KREDİ KARTI', key: 'cc_total', width: 15 },
      { header: 'TL', key: 'tl_total', width: 15 },
      { header: 'DOLAR', key: 'usd_total', width: 15 },
      { header: 'EURO', key: 'eur_total', width: 15 },
    ];

    // Add title
    worksheet.insertRows(1, [{ package: `Günlük Rapor - ${report.report_date}` }]);
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Add headers (now row 3)
    worksheet.insertRows(2, [{}]);

    // Add data rows
    let creditCardTotal = 0;
    let tlTotal = 0;
    let usdTotal = 0;
    let eurTotal = 0;

    lines.forEach((line, index) => {
      const rowNumber = 4 + index;
      worksheet.getCell(`A${rowNumber}`).value = line.package_name;
      worksheet.getCell(`B${rowNumber}`).value = line.adult_qty;
      worksheet.getCell(`C${rowNumber}`).value = line.child_qty;

      // Determine which column to fill based on currency
      if (line.currency === 'KK') {
        worksheet.getCell(`D${rowNumber}`).value = line.line_total;
        creditCardTotal += line.line_total;
      } else if (line.currency === 'TL') {
        worksheet.getCell(`E${rowNumber}`).value = line.line_total;
        tlTotal += line.line_total;
      } else if (line.currency === 'USD') {
        worksheet.getCell(`F${rowNumber}`).value = line.line_total;
        usdTotal += line.line_total;
      } else if (line.currency === 'EUR') {
        worksheet.getCell(`G${rowNumber}`).value = line.line_total;
        eurTotal += line.line_total;
      }
    });

    // Add totals row
    const totalRowNumber = 4 + lines.length;
    const totalCell = worksheet.getCell(`A${totalRowNumber}`);
    totalCell.value = 'TOPLAM';
    totalCell.font = { bold: true };

    worksheet.getCell(`D${totalRowNumber}`).value = creditCardTotal;
    worksheet.getCell(`D${totalRowNumber}`).font = { bold: true };
    worksheet.getCell(`E${totalRowNumber}`).value = tlTotal;
    worksheet.getCell(`E${totalRowNumber}`).font = { bold: true };
    worksheet.getCell(`F${totalRowNumber}`).value = usdTotal;
    worksheet.getCell(`F${totalRowNumber}`).font = { bold: true };
    worksheet.getCell(`G${totalRowNumber}`).value = eurTotal;
    worksheet.getCell(`G${totalRowNumber}`).font = { bold: true };

    // Style header row
    for (let col = 1; col <= 7; col++) {
      const cell = worksheet.getCell(3, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' },
      };
      cell.font = { bold: true };
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="daily_report_${report.report_date}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Failed to export Excel:', error);
    return NextResponse.json(
      { error: 'Failed to export Excel' },
      { status: 500 }
    );
  }
}
