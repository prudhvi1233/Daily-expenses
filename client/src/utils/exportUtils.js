import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const getTableData = (expenses) => {
  return expenses.map(exp => [
    format(new Date(exp.date), 'MMM dd, yyyy'),
    exp.time,
    exp.description,
    exp.category,
    exp.paymentMethod,
    `Rs. ${exp.amount.toFixed(2)}`
  ]);
};

const getColumns = () => ["Date", "Time", "Description", "Category", "Payment Method", "Amount"];

export const exportToPDF = (expenses) => {
  const doc = new jsPDF();
  doc.text("Personal Expense Tracker - Transactions", 14, 15);
  
  doc.autoTable({
    startY: 20,
    head: [getColumns()],
    body: getTableData(expenses),
  });
  
  doc.save('expenses.pdf');
};

export const exportToExcel = (expenses) => {
  const data = [getColumns(), ...getTableData(expenses)];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Expenses");
  XLSX.writeFile(wb, "expenses.xlsx");
};

export const exportToCSV = (expenses) => {
  const data = [getColumns(), ...getTableData(expenses)];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'expenses.csv';
  link.click();
};
