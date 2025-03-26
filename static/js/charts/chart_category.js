//static/js/charts/chart_category.js

document.addEventListener('DOMContentLoaded', function () {
    const table_rows = document.querySelectorAll('tbody tr');
    const filterDate = document.getElementById('filter-date');
    let categories = [];
    let values = [];
    let chart = null

    function updateChart() {
        const ctx2 = document.getElementById('chart_category').getContext('2d');
        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Despesa por categoria',
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(199, 199, 199, 0.7)',
                        'rgba(83, 102, 255, 0.7)',
                        'rgba(40, 159, 64, 0.7)',
                        'rgba(154,58,0,0.7)',
                    ],
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 5,
                            font: {
                                size: 10,
                                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: R$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 5,
                        right: 5,
                        top: 5,
                        bottom: 20
                    }
                },
                cutout: '50%'
            }
        })
    }

    function searchCategories() {
        categories = [];
        values = [];
        table_rows.forEach((row) => {
            if (row.style.display === 'none') return;

            const category = row.querySelector('td:nth-child(3)').textContent.trim();
            const valueCell = row.querySelector('td:nth-child(7)');
            const statusCell = row.querySelector('td:nth-child(4)').textContent.trim();
            let value = parseFloat(valueCell.textContent.trim().replace('R$', '').replace(',', '.'));
            if (statusCell === 'Active') {
                if (!categories.includes(category)) {
                    categories.push(category);
                    values.push(value);
                } else {
                    const index = categories.indexOf(category);
                    values[index] += value;
                }
            }

        });

        updateChart();
    }
    filterDate.addEventListener('click', function () {
        setTimeout(searchCategories, 10);
    });

    searchCategories();

    /*const ctx2 = document.getElementById('chart_category').getContext('2d');
    new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: 'Despesa por categoria',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)',
                    'rgba(83, 102, 255, 0.7)',
                    'rgba(40, 159, 64, 0.7)'
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top', // ou 'top', 'bottom', 'left'
                    labels: {
                        padding: 5,
                        font: {
                            size: 10,
                            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: R$${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            cutout: '50%' // Para transformar em doughnut chart (opcional)
        }
    });*/
});