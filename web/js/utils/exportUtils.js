// Export Functions
export function exportToExcel(data, filename) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPDF(element, filename) {
    html2pdf()
        .from(element)
        .save(`${filename}.pdf`);
} 