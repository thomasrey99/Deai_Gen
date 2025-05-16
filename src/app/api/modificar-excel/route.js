import ExcelJS from 'exceljs';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

// Este endpoint maneja las peticiones OPTIONS (preflight)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req) {
  try {
    const data = await req.json();
    const filePath = path.join(process.cwd(), 'public', 'planilla visualizador.xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('DETALLE');
    console.log(worksheet)
    worksheet.getCell('A2').value = data.typeOfIntervention;
    worksheet.getCell('B2').value = data.number;
    worksheet.getCell('B3').value = data.area;
    worksheet.getCell('B5').value = data.eventDate;
    worksheet.getCell('D5').value = data.callTime;
    worksheet.getCell('B6').value = data.place;
    worksheet.getCell('B7').value = data.modalitie;
    worksheet.getCell('B25:G25').value = data.review;
    if (data.operator) {
      worksheet.getCell('B11').value = data.operator;
    }
    if (data.intervener) {
      worksheet.getCell('B12').value = data.intervener;
    }
    if (data.interveningJustice) {
      worksheet.getCell('B8').value = data.interveningJustice.justice;
      worksheet.getCell('C8').value = data.interveningJustice.fiscal;
      worksheet.getCell('D8').value = data.interveningJustice.secretariat;
    }
    if (data.jurisdiction) {
      worksheet.getCell('B9').value = data.jurisdiction
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=PLANILLA DE VISUALIZACIÓN.xlsx',
        'Access-Control-Allow-Origin': 'https://deai-gen-thomas-reys-projects.vercel.app',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al generar Excel' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://deai-gen-thomas-reys-projects.vercel.app',
      },
    });
  }
}

