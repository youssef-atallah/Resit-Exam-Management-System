// Table Sorting
export function sortTable(table, column, type = 'string') {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.cells[column].textContent;
        const bValue = b.cells[column].textContent;

        if (type === 'number') {
            return Number(aValue) - Number(bValue);
        }

        return aValue.localeCompare(bValue);
    });

    rows.forEach(row => tbody.appendChild(row));
} 