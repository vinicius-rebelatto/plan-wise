//static/js/create_expense.js

document.addEventListener('DOMContentLoaded', function (qualifiedName, value) {
    const fixedTerm = document.querySelector('#fixed_term');
    const installmentsField = document.querySelector('#installments-field');
    const installmentsSelect = document.querySelector('#installments');
    const totalValueField = document.querySelector('#total-value-field');
    const totalValueSelect = document.querySelector('#total-value');
    const installmentsValueField = document.querySelector('#installments-value-field');
    const installmentsValueSelect = document.querySelector('#installments-value');
    const recurrency = document.querySelector('#recurrency');


    function fixedTermChange() {
        if (fixedTerm.value === 'True') {
            installmentsField.style.display = 'flex';
            installmentsSelect.setAttribute('required', true);
            totalValueField.style.display = 'flex';
            totalValueSelect.setAttribute('required', true);
            installmentsValueField.style.display = 'flex';
            installmentsSelect.setAttribute('required', true);
            recurrency.disabled = false;
            recurrencyChange();
        } else if (fixedTerm.value === 'False') {
            installmentsValueField.style.display = 'flex';
            installmentsSelect.setAttribute('required', true);
            installmentsField.style.display = 'none';
            installmentsSelect.removeAttribute('required');
            totalValueField.style.display = 'none';
            totalValueSelect.removeAttribute('required');

            // Define a recorrência como mensal e desabilita o campo
            recurrency.value = 2; // Recorrência mensal
            recurrency.disabled = true; // Desabilita o campo de recorrência

            // Define o número de parcelas como 180 (15 anos)
            installmentsSelect.value = 180;

        } else {
            installmentsValueField.style.display = 'none';
            installmentsValueSelect.removeAttribute('required');
            installmentsField.style.display = 'none';
            installmentsSelect.removeAttribute('required');
            totalValueField.style.display = 'none';
            totalValueSelect.removeAttribute('required');
            recurrency.disabled = false;
        }
    }

    function recurrencyChange() {
        totalValueChange();
        if (recurrency.value === '1') {//recorrencia unica
            installmentsSelect.value = 1;
            installmentsSelect.setAttribute('readonly', 'readonly')
            installmentsField.style.display = 'none';
            installmentsValueSelect.setAttribute('readonly', 'readonly')
            installmentsValueField.style.display = 'none';
        } else {
            installmentsSelect.removeAttribute('readonly')
            installmentsValueSelect.removeAttribute('readonly')
            installmentsField.style.display = 'flex';
            installmentsValueField.style.display = 'flex';
        }
    }

    function totalValueChange() {
        const totalValue = parseFloat(totalValueSelect.value);
        const installments = parseFloat(installmentsSelect.value);
        if (!isNaN(totalValue) && !isNaN(installments) && totalValue > 0 && installments > 0) {
            const installmentValue = totalValueSelect.value / installmentsSelect.value;
            installmentsValueSelect.value = installmentValue.toFixed(2);
        } else {
            installmentsValueSelect.value = '';
        }
    }

    function installmentsValueChange() {
        const installmentsValue = parseFloat(installmentsValueSelect.value);
        const installments = parseFloat(installmentsSelect.value);
        if (!isNaN(installmentsValue) && !isNaN(installments) && installmentsValue > 0 && installments > 0) {
            const totalValue = installmentsValue * installmentsSelect.value;
            totalValueSelect.value = totalValue.toFixed(2);
        } else {
            totalValueSelect.value = '';
        }
    }

    fixedTermChange();

    fixedTerm.addEventListener('change', fixedTermChange);
    recurrency.addEventListener('change', recurrencyChange);
    totalValueSelect.addEventListener('input', totalValueChange);
    installmentsSelect.addEventListener('input', totalValueChange);
    installmentsValueSelect.addEventListener('input', installmentsValueChange);
})