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

    // Funções de Atualização de Campos
    function toggleField(field, isVisible, isRequired = false, isReadonly = false) {
        field.style.display = isVisible ? 'flex' : 'none';
        if (isRequired) {
            field.querySelector('input, select').setAttribute('required', true);
        } else {
            field.querySelector('input, select').removeAttribute('required');
        }
        if (isReadonly) {
            field.querySelector('input, select').setAttribute('readonly', true);
        } else {
            field.querySelector('input, select').removeAttribute('readonly');
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
            toggleField(installmentsField, false);
            toggleField(totalValueField, false);
            toggleField(recurrencyField, false);
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
            toggleField(installmentsField, false, false, true);
            toggleField(installmentsValueField, false, false, true);
        } else {
            toggleField(installmentsField, true);
            toggleField(installmentsValueField, true);
        }
    }

    function updateTotalValue() {
        const totalValue = parseFloat(totalValueSelect.value);
        const installments = parseFloat(installmentsSelect.value);
        if (!isNaN(totalValue) && !isNaN(installments) && totalValue > 0 && installments > 0) {
            const installmentValue = totalValue / installments;
            installmentsValueSelect.value = installmentValue.toFixed(2);
        } else {
            installmentsValueSelect.value = '';
        }
    }

    function updateInstallmentsValue() {
        const installmentsValue = parseFloat(installmentsValueSelect.value);
        const installments = parseFloat(installmentsSelect.value);
        if (!isNaN(installmentsValue) && !isNaN(installments) && installmentsValue > 0 && installments > 0) {
            const totalValue = installmentsValue * installments;
            totalValueSelect.value = totalValue.toFixed(2);
        } else {
            totalValueSelect.value = '';
        }
    }

    // Inicialização
    handleFixedTermChange();

    // Event Listeners
    fixedTerm.addEventListener('change', handleFixedTermChange);
    recurrency.addEventListener('change', handleRecurrencyChange);
    totalValueSelect.addEventListener('input', updateTotalValue);
    installmentsSelect.addEventListener('input', updateTotalValue);
    installmentsValueSelect.addEventListener('input', updateInstallmentsValue);
});