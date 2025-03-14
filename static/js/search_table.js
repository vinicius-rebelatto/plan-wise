document.addEventListener('DOMContentLoaded', () => {
    const search = document.querySelector('.input-group input');
    const table_rows = document.querySelectorAll('tbody tr');
    const table_headings = document.querySelectorAll('thead th');

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

    // Função de ordenação
    table_headings.forEach((head, i) => {
        head.onclick = () => {
            // Remove a classe 'active' de todos os cabeçalhos
            table_headings.forEach((h) => h.classList.remove('active', 'asc', 'desc'));

            // Alterna entre 'asc' e 'desc'
            if (head.classList.contains('asc')) {
                head.classList.remove('asc');
                head.classList.add('desc');
            } else if (head.classList.contains('desc')) {
                head.classList.remove('desc');
                head.classList.add('asc');
            } else {
                head.classList.add('asc');
            }

            // Ordena a tabela
            sortTable(i, head.classList.contains('asc'));
        };
    });

    // Função para ordenar a tabela
    function sortTable(column, asc = true) {
        const rows = Array.from(table_rows);
        const dir = asc ? 1 : -1;

        rows.sort((a, b) => {
            const a_text = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            const b_text = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

            // Verifica se o conteúdo é numérico
            if (!isNaN(a_text) && !isNaN(b_text)) {
                return (parseFloat(a_text) - parseFloat(b_text)) * dir;
            }
            // Verifica se o conteúdo é uma data
            else if (isDate(a_text) && isDate(b_text)) {
                const a_date = parseDate(a_text);
                const b_date = parseDate(b_text);
                return (a_date - b_date) * dir;
            }
            // Ordenação alfabética
            else {
                return a_text.localeCompare(b_text) * dir;
            }
        });

        // Reorganiza as linhas na tabela
        const tbody = document.querySelector('tbody');
        rows.forEach((row) => tbody.appendChild(row));
    }

    // Função para verificar se uma string é uma data
    function isDate(text) {
        return /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(text); // Formato: dd/MM/yyyy HH:mm
    }

    // Função para converter uma string em um objeto Date
    function parseDate(text) {
        const [date, time] = text.split(' ');
        const [day, month, year] = date.split('/');
        const [hour, minute] = time.split(':');
        return new Date(year, month - 1, day, hour, minute);
    }
});