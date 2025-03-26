//static/js/search_table.js

document.addEventListener('DOMContentLoaded', () => {
    const search = document.querySelector('.input-group input');
    const table_rows = document.querySelectorAll('tbody tr');
    //const table_headings = document.querySelectorAll('thead th');
    const filterBy = document.getElementById('filter-by');
    const filterDate = document.getElementById('filter-date');

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

    function filterByDate() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const filter_value = filterBy.value;
        // Adicione no início da função
        if (startDate && endDate && startDate > endDate) {
            alert('A data final deve ser maior ou igual à data inicial');
            return;
        }
        // Se não há datas selecionadas, mostra todas as linhas
        if (!startDate && !endDate) {
            table_rows.forEach(row => row.style.display = '');
            return;
        }

        table_rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            const statusCell = cells[3];
            const statusText = statusCell.textContent.trim().toLowerCase();

            // Verifique qual célula contém a data correta
            cells.forEach((cell, index) => {
                console.log(`Célula ${index}:`, cell.textContent.trim());
            });

            const dateCell = cells[4];
            const dateText = dateCell.textContent.trim();
            // Converter data do formato d/m/Y para Date object
            const [day, month, year] = dateText.split('/');
            const rowDate = new Date(`${year}-${month}-${day}`);
            // Converter datas de input para Date object
            const startDateObj = startDate ? new Date(startDate) : null;
            const endDateObj = endDate ? new Date(endDate) : null;

            let display = false;

            if (filter_value === 'all') {
                display = true;
            } else if (filter_value === 'active' && statusText === 'active') {
                display = true;
            } else if (filter_value === 'waiting' && statusText === 'waiting') {
                display = true;
            }

            if (startDateObj && rowDate < startDateObj) {
                display = false;
            }
            if (endDateObj && rowDate > endDateObj) {
                display = false;
            }
            row.style.display = display ? '' : 'none';
        });
    }

    filterDate.addEventListener('click', filterByDate);

    filterTable();

});