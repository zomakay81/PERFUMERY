import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StockItem } from '../store/useStore';

export const exportCatalogToPDF = (products: StockItem[]) => {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleDateString('it-IT');

  // Colors
  const purple = [147, 51, 234];
  const dark = [15, 23, 42];

  // Header
  doc.setFillColor(dark[0], dark[1], dark[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('ESSENZA', 15, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('CATALOGO PRODOTTI LABORATORIO', 15, 33);
  
  doc.setFontSize(10);
  doc.text(`DATA: ${timestamp}`, 170, 25);

  // Table
  autoTable(doc, {
    startY: 50,
    head: [['SKU', 'PRODOTTO', 'QUANTITÀ', 'PREZZO UNIT.']],
    body: products.map(p => [
      p.sku,
      p.name,
      `${p.quantity} ${p.unit}`,
      `€ ${p.price.toFixed(2)}`
    ]),
    headStyles: {
      fillColor: purple,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 15, right: 15 },
    styles: {
        fontSize: 10,
        cellPadding: 5
    }
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'Documento generato da ESSENZA Lab Management - Uso interno e commerciale.',
      15,
      doc.internal.pageSize.height - 10
    );
    doc.text(`Pagina ${i} di ${pageCount}`, 180, doc.internal.pageSize.height - 10);
  }

  doc.save(`Catalogo_Essenza_${timestamp.replace(/\//g, '-')}.pdf`);
};
