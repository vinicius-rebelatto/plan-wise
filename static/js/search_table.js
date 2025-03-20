document.addEventListener('DOMContentLoaded', () => {
    const search = document.querySelector('.input-group input');
    const table_rows = document.querySelectorAll('tbody tr');
    const filterBy = document.getElementById('filter-by');

    // Função de busca
    search.addEventListener('input', searchTable);


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

    filterBy.addEventListener('change', () => {
        const sort_by = filterBy.value;
        const url = new URL(window.location.href);
        url.searchParams.set('sort', sort_by);
        url.searchParams.set('order', 'desc'); // Ordem padrão: decrescente
        window.location.href = url.toString();
    });
});