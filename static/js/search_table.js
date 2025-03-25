document.addEventListener('DOMContentLoaded', () => {
    const search = document.querySelector('.input-group input');
    const table_rows = document.querySelectorAll('tbody tr');
    //const table_headings = document.querySelectorAll('thead th');
    const filterBy = document.getElementById('filter-by');

    // Função de busca
    search.addEventListener('input', searchTable);

    // Função de filtro
    filterBy.addEventListener('change', filterTable);

    function searchTable() {
        const search_text = search.value.toLowerCase();
        table_rows.forEach((row) => {
            const row_text = row.textContent.toLowerCase();
            if (row_text.includes(search_text)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }

        });
    }

    function filterTable() {
        const filter_value = filterBy.value;
        const filter_text = search.value.toLowerCase();

        table_rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            const statusCell = cells[3];
            const statusText = statusCell.textContent.trim().toLowerCase();
            const rowText = row.textContent.toLowerCase();

            let display = false;

            if (filter_value === 'all') {
                display = true;
            } else if (filter_value === 'active' && statusText === 'active') {
                display = true;
            } else if (filter_value === 'waiting' && statusText === 'waiting') {
                display = true;
            }

            if (display && rowText.includes(filter_text)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
    }
});