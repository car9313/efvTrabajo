import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class PrintService {
  constructor() {
  }

  generatePdfUI(encabezado: any, cuerpo: Array<any>, titulo: string) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'letter'
    });
    const logo = new Image();
    logo.src = 'assets/logoPDF.png';
    doc.addImage(logo, 'JPEG', (doc.internal.pageSize.getWidth() / 2.45), 20, 75, 50);
    doc.setFontSize(12);
    doc.text('Dirección de Identificación, Inmigración y Extranjería', doc.internal.pageSize.width / 2, 80, { align: 'center' });
    doc.setFontSize(20);
    doc.text(titulo, doc.internal.pageSize.width / 2, 100, { align: 'center' });
    autoTable(doc, {
      startY: 110,
      theme: 'plain',
      // pageBreak : 'avoid',
      styles: {
        overflow: 'linebreak',
        fontSize: 12,
        font: 'arial',
        halign: 'center', // left, center, right
        valign: 'middle', // top, middle, bott
        // lineColor: [0, 0, 0],
        lineWidth: .2
      },
      headStyles: {
        fontSize: 12,
        valign: 'middle',
        halign: 'center',
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0]
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        fontSize: 12,
      },
      head: [encabezado],
      body: cuerpo,
    });
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text('Página ' + i + ' de ' + totalPages, (doc.internal.pageSize.getWidth() / 2.3), (doc.internal.pageSize.getHeight() - 10));
    }
    // Guardar automaticamente el PDF
    doc.save(titulo + '.pdf');
    /* doc.setProperties({
       title: titulo
     });
     doc.output('dataurlnewwindow');*/
  }

  generateExcelUI(encabezado: any, cuerpo: Array<any>, titulo: string) {
    const worksheetData: any[] = [];
    cuerpo.forEach((item: any) => {
      const worksheetItem = Object();
      encabezado.forEach(header => {
        worksheetItem[header.key] = item[header.name];
      });
      worksheetData.push(worksheetItem);
    });
    // excel file
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');
    XLSX.writeFileXLSX(workbook, `${titulo}.xlsx`, {});
  }
}
