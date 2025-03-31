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
        if (typeof value !== 'string') value = String(value);
        // Remove tudo que não é número, sinal negativo ou vírgula
        const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
        return parseFloat(cleaned) || 0;
    }

    function formatBrazilianNumber(value) {
        if (isNaN(value)) return '';
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function formatInstallmentsInput(event) {
        const input = event.target;
        // Remove tudo que não é dígito
        input.value = input.value.replace(/\D/g, '');
        updateTotalValue(); // Atualiza o valor da parcela
    }

    function formatCurrencyInput(event) {
        const input = event.target;
        let value = input.value.replace(/\D/g, '');

        // Converte para número com 2 casas decimais
        value = (parseInt(value || 0, 10) / 100).toFixed(2);

        // Formata para exibição
        input.value = formatBrazilianNumber(value);

        // Atualiza os cálculos
        if (input === totalValueSelect) {
            updateTotalValue();
        } else if (input === installmentsValueSelect) {
            updateInstallmentsValue();
        }
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

     // Funções de cálculo
    function updateTotalValue() {
        const totalValue = parseFloat(totalValueSelect.value);
        const installments = parseInt(installmentsSelect.value, 10) || 0;
        if (totalValue > 0 && installments > 0) {
            const installmentValue = parseBrazilianNumber(totalValue / installments);
            installmentsValueSelect.value = formatBrazilianNumber(installmentValue);
        } else {
            installmentsValueSelect.value = '';
        }
    }

    function updateInstallmentsValue() {
        const installmentsValue = parseFloat(installmentsValueSelect.value);
        const installments = parseInt(installmentsSelect.value, 10) || 0;

        if (installmentsValue > 0 && installments > 0) {
            const totalValue = parseBrazilianNumber(installmentsValue * installments);
            totalValueSelect.value = formatBrazilianNumber(totalValue);
        } else {
            totalValueSelect.value = '';
        }
    }




    // Event Listeners
    fixedTerm.addEventListener('change', handleFixedTermChange);
    recurrency.addEventListener('change', handleRecurrencyChange);
    totalValueSelect.addEventListener('input', formatCurrencyInput);
    installmentsSelect.addEventListener('input', formatInstallmentsInput);
    installmentsValueSelect.addEventListener('input', formatCurrencyInput);

    // Inicialização
    handleFixedTermChange();
});