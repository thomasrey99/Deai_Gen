// app/api/modificar-excel/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  const data = await req.json();

  const filePath = path.join(process.cwd(), 'public', 'PLANILLA DE VISUALIZACIÓN.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet('DETALLE ');

  worksheet.getCell('B1').value = data.sae;
  worksheet.getCell('B4').value = data.fechaHecho;
  worksheet.getCell('B5').value = data.lugar;
  worksheet.getCell('B6').value = data.caratula;
  worksheet.getCell('B7').value = data.visualizador;
  worksheet.getCell('B8').value = data.intervenor;
  worksheet.getCell('B11').value = data.reseña;

  ['B4', 'B5', 'B6', 'B7', 'B8'].forEach((cellRef) => {
    worksheet.getCell(cellRef).font = { bold: false };
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=PLANILLA DE VISUALIZACIÓN.xlsx',
    },
  });
}
