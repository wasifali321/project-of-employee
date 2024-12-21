import { Worker } from '../types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export function exportToExcel(workers: Worker[]) {
  const workbook = XLSX.utils.book_new();
  
  // Transform data for Excel
  const data = workers.map(worker => ({
    'Name': worker.name,
    'Worker ID': worker.workerId,
    'Nationality': worker.nationality,
    'Organization': worker.organization,
    'Phone Number': worker.phoneNumber,
    'Date of Entry': format(new Date(worker.dateOfEntry), 'yyyy-MM-dd'),
    'Date of Issue': worker.dateOfIssue ? format(new Date(worker.dateOfIssue), 'yyyy-MM-dd') : '',
    'Iqama Expiry Date': worker.iqamaExpiryDate ? format(new Date(worker.iqamaExpiryDate), 'yyyy-MM-dd') : '',
    'Kafala Payments': worker.kafalatPayments?.length || 0,
    'Monthly Kafala Amount': worker.kafalatAmount || 0
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Workers');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `workers_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
}

export function exportToWord(workers: Worker[]) {
  let content = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f8f9fa; }
          h1 { color: #2563eb; }
        </style>
      </head>
      <body>
        <h1>Workers Report</h1>
        <p>Generated on: ${format(new Date(), 'PPP')}</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Worker ID</th>
              <th>Nationality</th>
              <th>Organization</th>
              <th>Phone Number</th>
              <th>Date of Entry</th>
              <th>Iqama Expiry</th>
            </tr>
          </thead>
          <tbody>
  `;

  workers.forEach(worker => {
    content += `
      <tr>
        <td>${worker.name}</td>
        <td>${worker.workerId}</td>
        <td>${worker.nationality}</td>
        <td>${worker.organization}</td>
        <td>${worker.phoneNumber}</td>
        <td>${format(new Date(worker.dateOfEntry), 'PP')}</td>
        <td>${worker.iqamaExpiryDate ? format(new Date(worker.iqamaExpiryDate), 'PP') : '-'}</td>
      </tr>
    `;
  });

  content += `
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([content], { type: 'application/msword' });
  saveAs(blob, `workers_report_${format(new Date(), 'yyyy-MM-dd')}.doc`);
}

export async function importFromExcel(file: File): Promise<Omit<Worker, 'id'>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const workers: Omit<Worker, 'id'>[] = jsonData.map((row: any) => ({
          name: row['Name'],
          workerId: row['Worker ID'],
          nationality: row['Nationality'],
          organization: row['Organization'],
          phoneNumber: row['Phone Number'],
          dateOfEntry: new Date(row['Date of Entry']).toISOString(),
          dateOfIssue: row['Date of Issue'] ? new Date(row['Date of Issue']).toISOString() : '',
          iqamaExpiryDate: row['Iqama Expiry Date'] ? new Date(row['Iqama Expiry Date']).toISOString() : '',
          kafalatAmount: row['Monthly Kafala Amount'] || 0,
          kafalatPayments: []
        }));

        resolve(workers);
      } catch (error) {
        reject(new Error('Failed to parse Excel file. Please ensure it matches the required format.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}