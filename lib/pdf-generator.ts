import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define types for PDF generation
export interface PdfTableColumn {
  header: string;
  dataKey: string;
  width?: number;
}

export interface PdfTableRow {
  [key: string]: string | number | boolean;
}

export interface PdfOptions {
  title: string;
  subtitle?: string;
  filename: string;
  author?: string;
  subject?: string;
  keywords?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: string;
  columns?: PdfTableColumn[];
  rows?: PdfTableRow[];
  includeTimestamp?: boolean;
  logo?: {
    src: string;
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
  additionalInfo?: {
    label: string;
    value: string;
  }[];
  footer?: string;
  hidePrice?: boolean;
}

/**
 * Generate a PDF document with optional table data
 * @param options PDF generation options
 * @returns The generated PDF document
 */
export const generatePdf = (options: PdfOptions): jsPDF => {
  const {
    title,
    subtitle,
    filename,
    author = 'License Portal',
    subject = 'Report',
    keywords = 'report, data',
    orientation = 'portrait',
    pageSize = 'a4',
    columns = [],
    rows = [],
    includeTimestamp = true,
    logo,
    additionalInfo = [],
    footer,
    hidePrice = false
  } = options;

  // Create a new PDF document
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize
  });

  // Set document properties
  doc.setProperties({
    title,
    subject,
    author,
    keywords
  });

  // Set initial position
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Add logo if provided
  if (logo) {
    try {
      doc.addImage(
        logo.src,
        'PNG',
        logo.x || 14,
        logo.y || 10,
        logo.width,
        logo.height
      );
      yPos = logo.y ? logo.y + logo.height + 10 : yPos + 10;
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }

  // Add title
  doc.setFontSize(24);
  doc.setTextColor(40, 40, 40);
  doc.text(title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 12;

  // Add subtitle if provided
  if (subtitle) {
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text(subtitle, pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;
  }

  // Add timestamp if requested
  if (includeTimestamp) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const timestamp = `Generated on: ${new Date().toLocaleString()}`;
    doc.text(timestamp, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;
  }

  // Add additional info if provided
  if (additionalInfo.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);

    additionalInfo.forEach(info => {
      doc.text(`${info.label}: ${info.value}`, 14, yPos);
      yPos += 6;
    });

    yPos += 8;
  }

  // Add table if columns and rows are provided
  if (columns.length > 0 && rows.length > 0) {
    // Filter out price columns if hidePrice is true
    const filteredColumns = hidePrice
      ? columns.filter(col => !col.dataKey.toLowerCase().includes('price') &&
        !col.dataKey.toLowerCase().includes('revenue') &&
        !col.dataKey.toLowerCase().includes('total') &&
        !col.dataKey.toLowerCase().includes('value'))
      : columns;

    const tableColumns = filteredColumns.map(col => ({
      header: col.header,
      dataKey: col.dataKey,
      width: col.width
    }));

    const tableRows = rows.map(row => {
      const filteredRow: any = {};
      filteredColumns.forEach(col => {
        filteredRow[col.dataKey] = row[col.dataKey];
      });
      return Object.values(filteredRow);
    });

    autoTable(doc, {
      startY: yPos,
      head: [tableColumns.map(col => col.header)],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [66, 133, 244],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: tableColumns.reduce((styles, col, index) => {
        if (col.width) {
          styles[index] = { cellWidth: col.width };
        }
        return styles;
      }, {} as { [key: number]: { cellWidth: number } }),
      margin: { top: 10, right: 14, bottom: 20, left: 14 },
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Update yPos to after the table
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Add footer if provided
  if (footer) {
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        footer,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
  }

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 20,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  return doc;
};

/**
 * Generate and download a PDF document
 * @param options PDF generation options
 */
export const downloadPdf = (options: PdfOptions): void => {
  const doc = generatePdf(options);
  doc.save(`${options.filename}.pdf`);
};

/**
 * Generate a PDF report for sales data
 * @param data Sales data for the report
 * @param title Report title
 * @param subtitle Report subtitle
 * @param filename Filename for the downloaded PDF
 */
export const generateSalesReport = (
  data: any[],
  title: string = 'Sales Report',
  subtitle: string = 'Summary of sales performance',
  filename: string = 'sales-report'
): void => {
  const columns: PdfTableColumn[] = [
    { header: 'Period', dataKey: 'period' },
    { header: 'Licenses', dataKey: 'licenses' }
  ];

  const rows: PdfTableRow[] = data.map(item => ({
    period: item.month || item.period,
    licenses: item.licenses
  }));

  const totalLicenses = data.reduce((sum, item) => sum + item.licenses, 0);

  const additionalInfo = [
    { label: 'Total Licenses', value: totalLicenses.toString() }
  ];

  downloadPdf({
    title,
    subtitle,
    filename,
    columns,
    rows,
    additionalInfo,
    footer: 'Confidential - License Portal',
    hidePrice: true
  });
};

/**
 * Generate a PDF report for product data
 * @param data Product data for the report
 * @param title Report title
 * @param subtitle Report subtitle
 * @param filename Filename for the downloaded PDF
 */
export const generateProductReport = (
  data: any[],
  title: string = 'Product Report',
  subtitle: string = 'License distribution by product',
  filename: string = 'product-report'
): void => {
  const columns: PdfTableColumn[] = [
    { header: 'Product', dataKey: 'product' },
    { header: 'Licenses', dataKey: 'licenses' },
    { header: 'Percentage', dataKey: 'percentage' }
  ];

  const rows: PdfTableRow[] = data.map(item => ({
    product: item.product,
    licenses: item.licenses,
    percentage: `${item.percentage}%`
  }));

  const totalLicenses = data.reduce((sum, item) => sum + item.licenses, 0);

  const additionalInfo = [
    { label: 'Total Products', value: data.length.toString() },
    { label: 'Total Licenses', value: totalLicenses.toString() }
  ];

  downloadPdf({
    title,
    subtitle,
    filename,
    columns,
    rows,
    additionalInfo,
    footer: 'Confidential - License Portal',
    hidePrice: true
  });
};

/**
 * Generate a PDF report for customer data
 * @param data Customer data for the report
 * @param title Report title
 * @param subtitle Report subtitle
 * @param filename Filename for the downloaded PDF
 */
export const generateCustomerReport = (
  data: any[],
  title: string = 'Customer Report',
  subtitle: string = 'Top customers by license volume',
  filename: string = 'customer-report'
): void => {
  const columns: PdfTableColumn[] = [
    { header: 'Customer', dataKey: 'customer' },
    { header: 'Licenses', dataKey: 'licenses' }
  ];

  const rows: PdfTableRow[] = data.map(item => ({
    customer: item.customer,
    licenses: item.licenses
  }));

  const totalLicenses = data.reduce((sum, item) => sum + item.licenses, 0);

  const additionalInfo = [
    { label: 'Total Customers', value: data.length.toString() },
    { label: 'Total Licenses', value: totalLicenses.toString() }
  ];

  downloadPdf({
    title,
    subtitle,
    filename,
    columns,
    rows,
    additionalInfo,
    footer: 'Confidential - License Portal',
    hidePrice: true
  });
};

/**
 * Generate a PDF document from documentation content
 * @param title Document title
 * @param content Document content sections
 * @param filename Filename for the downloaded PDF
 */
export const generateDocumentation = (
  title: string,
  content: { heading: string; text: string }[],
  filename: string = 'documentation'
): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set document properties
  doc.setProperties({
    title,
    subject: 'Documentation',
    author: 'License Portal',
    keywords: 'documentation, guide, help'
  });

  // Set initial position
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);

  // Add title
  doc.setFontSize(24);
  doc.setTextColor(40, 40, 40);
  doc.text(title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const timestamp = `Generated on: ${new Date().toLocaleString()}`;
  doc.text(timestamp, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Add content sections
  content.forEach(section => {
    // Check if we need a new page
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
    }

    // Add section heading
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text(section.heading, margin, yPos);
    yPos += 8;

    // Add a line under the heading
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;

    // Add section text with word wrapping
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);

    const textLines = doc.splitTextToSize(section.text, contentWidth);

    // Check if we need a new page for the text
    if (yPos + (textLines.length * 5) > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }

    doc.text(textLines, margin, yPos);
    yPos += (textLines.length * 5) + 10;
  });

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 20,
      pageHeight - 10
    );
  }

  // Add footer
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'License Portal Documentation',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Download the PDF
  doc.save(`${filename}.pdf`);
};

/**
 * Generate a PDF for an order
 * @param order Order data
 * @param filename Filename for the downloaded PDF
 */
export const generateOrderPdf = (order: any, filename: string = 'order'): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set document properties
  doc.setProperties({
    title: `Order ${order.id}`,
    subject: 'Order Details',
    author: 'License Portal',
    keywords: 'order, license, invoice'
  });

  // Set initial position
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);

  // Add title
  doc.setFontSize(24);
  doc.setTextColor(40, 40, 40);
  doc.text(`Order ${order.id}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Add subtitle
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(`Placed on ${new Date(order.date).toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Add a horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Add order information section
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text('Order Information', margin, yPos);
  yPos += 8;

  // Add order details
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);

  const orderDetails = [
    { label: 'Status', value: order.status },
    { label: 'Type', value: order.type },
    { label: 'Product', value: order.product }
  ];

  orderDetails.forEach(detail => {
    doc.text(`${detail.label}: ${detail.value}`, margin, yPos);
    yPos += 6;
  });

  yPos += 10;

  // Add customer information section
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text('Customer Information', margin, yPos);
  yPos += 8;

  // Add customer details
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);

  const customerDetails = [
    { label: 'Name', value: order.customerDetails.name },
    { label: 'Company', value: order.customerDetails.company || 'N/A' },
    { label: 'Email', value: order.customerDetails.email },
    { label: 'Phone', value: order.customerDetails.phone },
    { label: 'Address', value: order.customerDetails.address }
  ];

  customerDetails.forEach(detail => {
    doc.text(`${detail.label}: ${detail.value}`, margin, yPos);
    yPos += 6;
  });

  yPos += 10;

  // Add a horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Add stations and licenses section
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text('Stations & Licenses', margin, yPos);
  yPos += 10;

  // Add stations table
  const stationColumns = [
    { header: 'Station ID', dataKey: 'id' },
    { header: 'Serial Number', dataKey: 'serialNumber' },
    { header: 'Model', dataKey: 'model' }
  ];

  const stationRows = order.stations.map((station: any) => ({
    id: station.id,
    serialNumber: station.serialNumber,
    model: station.model
  }));

  autoTable(doc, {
    startY: yPos,
    head: [stationColumns.map(col => col.header)],
    body: stationRows.map(row =>
      stationColumns.map(col => row[col.dataKey]?.toString() || '')
    ),
    theme: 'grid',
    headStyles: {
      fillColor: [66, 133, 244],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    margin: { top: 10, right: margin, bottom: 20, left: margin },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  // Update yPos to after the table
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Add licenses section
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);

  // Check if we need a new page
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.text('License Information', margin, yPos);
  yPos += 10;

  // Collect all licenses from all stations
  const allLicenses = order.stations.flatMap((station: any) =>
    station.licenses.map((license: any) => ({
      ...license,
      stationSerialNumber: station.serialNumber
    }))
  );

  // Add licenses table
  const licenseColumns = [
    { header: 'License ID', dataKey: 'id' },
    { header: 'Type', dataKey: 'type' },
    { header: 'Key', dataKey: 'key' },
    { header: 'Valid From', dataKey: 'startDate' },
    { header: 'Valid To', dataKey: 'endDate' },
    { header: 'Station', dataKey: 'stationSerialNumber' }
  ];

  const licenseRows = allLicenses.map((license: any) => ({
    id: license.id,
    type: license.type,
    key: license.key,
    startDate: new Date(license.startDate).toLocaleDateString(),
    endDate: new Date(license.endDate).toLocaleDateString(),
    stationSerialNumber: license.stationSerialNumber
  }));

  autoTable(doc, {
    startY: yPos,
    head: [licenseColumns.map(col => col.header)],
    body: licenseRows.map(row =>
      licenseColumns.map(col => row[col.dataKey]?.toString() || '')
    ),
    theme: 'grid',
    headStyles: {
      fillColor: [66, 133, 244],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    margin: { top: 10, right: margin, bottom: 20, left: margin },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 20,
      pageHeight - 10
    );
  }

  // Add footer
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Confidential - License Portal',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Download the PDF
  doc.save(`${filename}.pdf`);
}; 