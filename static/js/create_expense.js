//static/js/create_expense.js

document.addEventListener('DOMContentLoaded', function () {
    // Seletores
    const fixedTerm = document.querySelector('#fixed_term');
    const installmentsField = document.querySelector('#installments-field');
    const installmentsSelect = document.querySelector('#installments');
    const totalValueField = document.querySelector('#total-value-field');
    const totalValueSelect = document.querySelector('#total-value');
    const installmentsValueField = document.querySelector('#installments-value-field');
    const installmentsValueSelect = document.querySelector('#installments-value');
    const recurrency = document.querySelector('#recurrency');
    const recurrencyField = document.querySelector('#recurrency-field');

    function parseBrazilianNumber(value) {
        if (typeof value === 'string') {
            // Remove pontos (separadores de milhar) e substitui vírgula por ponto
            return parseFloat(value.replace(/\./g, '').replace(',', '.'));
        }
        return parseFloat(value);
    }

    function formatBrazilianNumber(value) {
        if (isNaN(value)) return '';
        // Formata com 2 casas decimais e substitui ponto por vírgula
        return value.toFixed(2).replace('.', ',');
    }

    // Funções de Atualização de Campos
    function toggleField(field, isVisible, isRequired = false) {
        field.style.display = isVisible ? 'flex' : 'none';
        if (isRequired) {
            field.querySelector('input, select').setAttribute('required', true);
        } else {
            field.querySelector('input, select').removeAttribute('required');
        }
    }

    function toggleRecurrency(isDisabled, value = null) {
        recurrency.disabled = isDisabled;
        if (value !== null) {
            recurrency.value = value;
        }
    }

    // Funções de Lógica
    function handleFixedTermChange() {
        if (fixedTerm.value === 'True') {
            toggleField(installmentsField, true, true);
            toggleField(totalValueField, true, true);
            toggleField(installmentsValueField, true, true);
            toggleField(recurrencyField, true, true);
            toggleRecurrency(false);
            handleRecurrencyChange();
        } else if (fixedTerm.value === 'False') {
            toggleField(installmentsValueField, true, true);
            toggleField(installmentsField, false, true);
            toggleField(totalValueField, false, true);
            toggleField(recurrencyField, false, true);
            toggleRecurrency(false, 2); // Define recorrência mensal
            installmentsSelect.value = 180; // Define 180 parcelas (15 anos)
        } else {
            toggleField(installmentsValueField, false);
            toggleField(installmentsField, false);
            toggleField(totalValueField, false);
            toggleField(recurrencyField, true);
            toggleRecurrency(false);
        }
    }

    function handleRecurrencyChange() {
        updateTotalValue();
        if (recurrency.value === '1') { // Recorrência única
            installmentsSelect.value = 1;
            toggleField(installmentsField, false, false);
            toggleField(installmentsValueField, false, false);
        } else {
            toggleField(installmentsField, true);
            toggleField(installmentsValueField, true);
        }
    }

    function updateTotalValue() {
        const totalValue = parseBrazilianNumber(totalValueSelect.value);
        const installments = parseBrazilianNumber(installmentsSelect.value);

        if (!isNaN(totalValue) && !isNaN(installments) && totalValue > 0 && installments > 0) {
            const installmentValue = totalValue / installments;
            installmentsValueSelect.value = formatBrazilianNumber(installmentValue);
        } else {
            installmentsValueSelect.value = '';
        }
    }

    function updateInstallmentsValue() {
        const installmentsValue = parseBrazilianNumber(installmentsValueSelect.value);
        const installments = parseBrazilianNumber(installmentsSelect.value);

        if (!isNaN(installmentsValue) && !isNaN(installments) && installmentsValue > 0 && installments > 0) {
            const totalValue = installmentsValue * installments;
            totalValueSelect.value = formatBrazilianNumber(totalValue);
        } else {
            totalValueSelect.value = '';
        }
    }




    // Event Listeners
    fixedTerm.addEventListener('change', handleFixedTermChange);
    recurrency.addEventListener('change', handleRecurrencyChange);
    totalValueSelect.addEventListener('input', updateTotalValue);
    installmentsSelect.addEventListener('input', updateTotalValue);
    installmentsValueSelect.addEventListener('input', updateInstallmentsValue);

    // Inicialização
    handleFixedTermChange();
});