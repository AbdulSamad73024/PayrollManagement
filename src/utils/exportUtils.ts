/**
 * Export tabular array data to CSV file download
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: { key: keyof T; label: string }[]
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const exportHeaders = headers || (Object.keys(data[0]).map(k => ({ key: k as keyof T, label: k })) as { key: keyof T; label: string }[]);
  
  const headerRow = exportHeaders.map(h => `"${h.label}"`).join(',');
  const rows = data.map(row => {
    return exportHeaders
      .map(h => {
        let val: any = row[h.key];
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        const strVal = String(val ?? '').replace(/"/g, '""');
        return `"${strVal}"`;
      })
      .join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headerRow, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Triggers standard print dialog for an element ID
 */
export function printElementById(elementId: string) {
  const content = document.getElementById(elementId);
  if (!content) {
    alert('Print content not found.');
    return;
  }

  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    window.print();
    return;
  }

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(style => style.outerHTML)
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payroll Print Document</title>
        ${styles}
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: white; color: #1e293b; }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 300);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
